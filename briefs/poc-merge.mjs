// Proof-of-concept: merge Informer .tgz bundles (pure Node, no deps).
// usage: node poc-merge.mjs out.tgz "Bundle Name" in1.tgz in2.tgz ...
import fs from 'node:fs';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

// ---------- tar (ustar) read/write ----------
function untar(buf) {
  const files = new Map(); let off = 0;
  while (off + 512 <= buf.length) {
    const h = buf.subarray(off, off + 512);
    if (h.every(b => b === 0)) break;
    const str = (s, l) => h.subarray(s, s + l).toString('utf8').replace(/\0.*$/s, '');
    let name = str(0, 100); const prefix = str(345, 155); if (prefix) name = prefix + '/' + name;
    const size = parseInt(str(124, 12).trim() || '0', 8); const type = str(156, 1) || '0';
    off += 512;
    if (type === '0') files.set(name.replace(/^\.\//, ''), buf.subarray(off, off + size));
    off += Math.ceil(size / 512) * 512;
  }
  return files;
}
function tarHeader(name, size, type, mtime) {
  const h = Buffer.alloc(512);
  const w = (s, o, l) => h.write(s, o, l, 'utf8');
  const oct = (n, l) => n.toString(8).padStart(l - 1, '0') + '\0';
  w(name, 0, 100); w(oct(type === '5' ? 0o777 : 0o666, 8), 100); w(oct(0, 8), 108); w(oct(0, 8), 116);
  w(oct(size, 12), 124); w(oct(mtime, 12), 136); w('        ', 148); w(type, 156);
  w('ustar\0', 257); w('00', 263);
  let sum = 0; for (const b of h) sum += b; w(sum.toString(8).padStart(6, '0') + '\0 ', 148);
  return h;
}
function tar(entries) { // entries: [name, Buffer|null(dir)]
  const mtime = Math.floor(Date.now() / 1000), parts = [];
  for (const [name, data] of entries) {
    if (data == null) { parts.push(tarHeader(name, 0, '5', mtime)); continue; }
    parts.push(tarHeader(name, data.length, '0', mtime), data, Buffer.alloc((512 - data.length % 512) % 512));
  }
  parts.push(Buffer.alloc(1024));
  return Buffer.concat(parts);
}

// ---------- CSV (Postgres COPY CSV) ----------
function parseCsv(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; } else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}
// NOTE: COPY distinguishes NULL (unquoted empty) from "" (quoted empty). Keep raw record text to preserve that.
function rawRecords(text) {
  const out = []; let start = 0, q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') q = !q; else if (c === '\n' && !q) { out.push(text.slice(start, i)); start = i + 1; }
  }
  if (start < text.length) out.push(text.slice(start));
  return out;
}

function primaryKeys(schemaSql) {
  const pk = {};
  for (const m of schemaSql.matchAll(/ALTER TABLE "([^"]+)" ADD CONSTRAINT "[^"]+" PRIMARY KEY \(([^)]+)\)/g))
    pk[m[1]] = m[2].split(',').map(s => s.trim().replace(/"/g, ''));
  return pk;
}

// ---------- merge ----------
const [out, bundleName, ...inputs] = process.argv.slice(2);
const bundles = inputs.map(p => untar(zlib.gunzipSync(fs.readFileSync(p))));
const schema = bundles[0].get('tables/public/schema.sql').toString('utf8');
for (const b of bundles) if (b.get('tables/public/schema.sql').toString('utf8') !== schema) throw new Error('schema.sql mismatch (different Informer versions?)');
const pks = primaryKeys(schema);

const tables = new Map(); // table -> {header, rows: Map(pkKey -> {raw, updatedAt})}
for (const b of bundles) for (const [name, data] of b) {
  const m = name.match(/^tables\/public\/(.+)\.csv$/); if (!m) continue;
  const t = m[1], text = data.toString('utf8');
  const [headerRaw, ...recs] = rawRecords(text);
  const header = parseCsv(headerRaw + '\n')[0];
  const T = tables.get(t) ?? { headerRaw, header, rows: new Map() }; tables.set(t, T);
  if (T.headerRaw !== headerRaw) throw new Error(`header mismatch in ${t}`);
  const keyCols = (pks[t] ?? ['id']).map(c => header.indexOf(c));
  const updIdx = header.indexOf('updatedAt');
  for (const raw of recs) {
    const vals = parseCsv(raw + '\n')[0];
    const key = keyCols.map(i => vals[i]).join('\u0001');
    const upd = updIdx >= 0 ? vals[updIdx] : '';
    const prev = T.rows.get(key);
    if (!prev || upd >= prev.upd) T.rows.set(key, { raw, upd }); // newest wins
  }
}

// bundle.json
const metas = bundles.map(b => JSON.parse(b.get('bundle.json').toString('utf8')));
const ds = new Map(); for (const m of metas) for (const d of m.datasources ?? []) ds.set(d.id, d);
const meta = { ...metas.at(-1), createdAt: new Date().toISOString(), bundle: { id: crypto.randomUUID(), name: bundleName }, datasources: [...ds.values()] };

const entries = [['bundle.json', Buffer.from(JSON.stringify(meta, null, 4))], ['tables/', null], ['tables/public/', null]];
const files = [...tables.keys()].map(t => t + '.csv').concat('schema.sql').sort();
for (const f of files) {
  if (f === 'schema.sql') { entries.push(['tables/public/schema.sql', Buffer.from(schema)]); continue; }
  const T = tables.get(f.slice(0, -4));
  entries.push([`tables/public/${f}`, Buffer.from([T.headerRaw, ...[...T.rows.values()].map(r => r.raw)].join('\n') + '\n')]);
}
fs.writeFileSync(out, zlib.gzipSync(tar(entries)));
console.log('wrote', out, Object.fromEntries([...tables].map(([t, T]) => [t, T.rows.size])));
