const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');

// ---------- gzip / gunzip (Browser Web Streams API) ----------
async function gunzip(uint8Array) {
  const stream = new Blob([uint8Array]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gzip(uint8Array) {
  const stream = new Blob([uint8Array]).stream().pipeThrough(new CompressionStream('gzip'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// ---------- tar (ustar) read/write ----------
function untar(buf) {
  const files = new Map();
  let off = 0;
  while (off + 512 <= buf.length) {
    const h = buf.subarray(off, off + 512);
    if (h.every((b) => b === 0)) break;
    const str = (s, l) => decoder.decode(h.subarray(s, s + l)).replace(/\0.*$/s, '');
    let name = str(0, 100);
    const prefix = str(345, 155);
    if (prefix) name = prefix + '/' + name;
    const size = parseInt(str(124, 12).trim() || '0', 8);
    const type = str(156, 1) || '0';
    off += 512;
    if (type === '0') {
      files.set(name.replace(/^\.\//, ''), buf.subarray(off, off + size));
    }
    off += Math.ceil(size / 512) * 512;
  }
  return files;
}

function tarHeader(name, size, type, mtime) {
  const h = new Uint8Array(512);
  const w = (s, o, l) => {
    const bytes = encoder.encode(s);
    h.set(bytes.subarray(0, l), o);
  };
  const oct = (n, l) => n.toString(8).padStart(l - 1, '0') + '\0';

  w(name, 0, 100);
  w(oct(type === '5' ? 0o777 : 0o666, 8), 100);
  w(oct(0, 8), 108);
  w(oct(0, 8), 116);
  w(oct(size, 12), 124);
  w(oct(mtime, 12), 136);
  w('        ', 148);
  w(type, 156);
  w('ustar\0', 257);
  w('00', 263);

  let sum = 0;
  for (const b of h) sum += b;
  w(sum.toString(8).padStart(6, '0') + '\0 ', 148);
  return h;
}

function concatUint8Arrays(arrays) {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function tar(entries) {
  const mtime = Math.floor(Date.now() / 1000);
  const parts = [];
  for (const [name, data] of entries) {
    if (data == null) {
      parts.push(tarHeader(name, 0, '5', mtime));
      continue;
    }
    parts.push(
      tarHeader(name, data.length, '0', mtime),
      data,
      new Uint8Array((512 - (data.length % 512)) % 512)
    );
  }
  parts.push(new Uint8Array(1024));
  return concatUint8Arrays(parts);
}

// ---------- CSV (Postgres COPY CSV) ----------
function parseCsv(text) {
  const rows = [];
  let row = [];
  let f = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { f += '"'; i++; } else q = false;
      } else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows;
}

function rawRecords(text) {
  const out = [];
  let start = 0;
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') q = !q;
    else if (c === '\n' && !q) {
      out.push(text.slice(start, i));
      start = i + 1;
    }
  }
  if (start < text.length) out.push(text.slice(start));
  return out;
}

function primaryKeys(schemaSql) {
  const pk = {};
  for (const m of schemaSql.matchAll(/ALTER TABLE "([^"]+)" ADD CONSTRAINT "[^"]+" PRIMARY KEY \(([^)]+)\)/g)) {
    pk[m[1]] = m[2].split(',').map((s) => s.trim().replace(/"/g, ''));
  }
  return pk;
}

// ---------- Main Merge Function ----------
export async function mergeBundles(tgzBuffers, bundleName) {
  if (!tgzBuffers.length) throw new Error('No bundles provided to merge.');

  const unzippedBuffers = await Promise.all(tgzBuffers.map((b) => gunzip(b)));
  const bundles = unzippedBuffers.map((b) => untar(b));

  const schemaBytes = bundles[0].get('tables/public/schema.sql');
  if (!schemaBytes) throw new Error('Invalid bundle: missing tables/public/schema.sql');
  const schema = decoder.decode(schemaBytes);

  for (const b of bundles) {
    const bSchema = decoder.decode(b.get('tables/public/schema.sql'));
    if (bSchema !== schema) {
      throw new Error('Schema mismatch: Selected bundles come from different Informer versions and cannot be merged.');
    }
  }

  const pks = primaryKeys(schema);
  const tables = new Map();

  for (const b of bundles) {
    for (const [name, data] of b) {
      const m = name.match(/^tables\/public\/(.+)\.csv$/);
      if (!m) continue;
      const t = m[1];
      const text = decoder.decode(data);
      const [headerRaw, ...recs] = rawRecords(text);
      const header = parseCsv(headerRaw + '\n')[0];

      let T = tables.get(t);
      if (!T) {
        T = { headerRaw, header, rows: new Map() };
        tables.set(t, T);
      }
      if (T.headerRaw !== headerRaw) throw new Error(`CSV header mismatch in table "${t}".`);

      const keyCols = (pks[t] ?? ['id']).map((c) => header.indexOf(c));
      const updIdx = header.indexOf('updatedAt');

      for (const raw of recs) {
        const vals = parseCsv(raw + '\n')[0];
        const key = keyCols.map((i) => vals[i]).join('\u0001');
        const upd = updIdx >= 0 ? vals[updIdx] : '';
        const prev = T.rows.get(key);
        if (!prev || upd >= prev.upd) {
          T.rows.set(key, { raw, upd });
        }
      }
    }
  }

  const metas = bundles.map((b) => JSON.parse(decoder.decode(b.get('bundle.json'))));
  const ds = new Map();
  for (const m of metas) {
    for (const d of m.datasources ?? []) {
      ds.set(d.id, d);
    }
  }

  // Mimic single-item export by omitting bundle.id unless explicitly required by Informer
  const meta = {
    ...metas.at(-1),
    createdAt: new Date().toISOString(),
    bundle: { name: bundleName },
    datasources: [...ds.values()],
  };

  const entries = [
    ['bundle.json', encoder.encode(JSON.stringify(meta, null, 4))],
    ['tables/', null],
    ['tables/public/', null],
  ];

  const files = [...tables.keys()].map((t) => t + '.csv').concat('schema.sql').sort();

  for (const f of files) {
    if (f === 'schema.sql') {
      entries.push(['tables/public/schema.sql', encoder.encode(schema)]);
      continue;
    }
    const T = tables.get(f.slice(0, -4));
    const csvContent = [T.headerRaw, ...[...T.rows.values()].map((r) => r.raw)].join('\n') + '\n';
    entries.push([`tables/public/${f}`, encoder.encode(csvContent)]);
  }

  return await gzip(tar(entries));
}
