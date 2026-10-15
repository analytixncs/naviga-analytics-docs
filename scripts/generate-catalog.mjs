import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import crypto from 'node:crypto';

// Configuration
const TARGET_INFORMER_VERSION = process.env.INFORMER_VERSION || '5.8.6';
const REPORT_LIBRARY_DIR = path.resolve('static/downloads/report-library');
const DOCS_REPORT_LIBRARY_DIR = path.resolve('docs/report-library');
const OUTPUT_FILE = path.join(REPORT_LIBRARY_DIR, 'index.json');

function untar(buffer) {
  const files = new Map();
  let offset = 0;
  while (offset + 512 <= buffer.length) {
    const header = buffer.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;

    const readString = (start, length) =>
      buffer
        .subarray(offset + start, offset + start + length)
        .toString('utf8')
        .replace(/\0.*$/s, '')
        .trim();

    let name = readString(0, 100);
    const prefix = readString(345, 155);
    if (prefix) name = `${prefix}/${name}`;

    const size = parseInt(readString(124, 12) || '0', 8);
    const type = readString(156, 1) || '0';

    offset += 512;
    if (type === '0') {
      files.set(name.replace(/^\.\//, ''), buffer.subarray(offset, offset + size));
    }
    offset += Math.ceil(size / 512) * 512;
  }
  return files;
}

function parseMarkdownMetadata(slug) {
  const extensions = ['.md', '.mdx'];
  let content = null;
  for (const ext of extensions) {
    const fullPath = path.join(DOCS_REPORT_LIBRARY_DIR, `${slug}${ext}`);
    if (fs.existsSync(fullPath)) {
      content = fs.readFileSync(fullPath, 'utf8');
      break;
    }
  }

  if (!content) {
    return {};
  }

  const result = {};

  // Frontmatter parsing
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    for (const line of fmMatch[1].split('\n')) {
      const idx = line.indexOf(':');
      if (idx > -1) {
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        result[key] = value;
      }
    }
  }

  // Look for **Type:** <Category> in markdown body
  const typeCategoryMatch = content.match(/\*\*Type:\*\*\s*([^\r\n]+)/i);
  if (typeCategoryMatch) {
    result.bodyCategory = typeCategoryMatch[1].trim();
  }

  // Look for description paragraph right after **Type:** line or before callouts
  const descAfterTypeMatch = content.match(/\*\*Type:\*\*[^\r\n]*\r?\n\r?\n([^\r\n#:<]+)/i);
  if (descAfterTypeMatch) {
    result.bodyDescription = descAfterTypeMatch[1].trim();
  }

  // Look for ## Summary section
  const summaryMatch = content.match(/##\s+Summary\r?\n\r?\n([^\r\n#]+)/i);
  if (summaryMatch) {
    result.summaryDescription = summaryMatch[1].trim();
  }

  return result;
}

function parseSideJsonMetadata(slug) {
  const jsonPath = path.join(REPORT_LIBRARY_DIR, `${slug}.json`);
  if (!fs.existsSync(jsonPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  } catch {
    return null;
  }
}

export function generateCatalog() {
  if (!fs.existsSync(REPORT_LIBRARY_DIR)) {
    console.error(`Report library directory not found: ${REPORT_LIBRARY_DIR}`);
    process.exit(1);
  }

  const tgzFiles = fs
    .readdirSync(REPORT_LIBRARY_DIR)
    .filter((file) => file.endsWith('.tgz'))
    .sort();

  console.log(`Found ${tgzFiles.length} .tgz files in ${REPORT_LIBRARY_DIR}`);

  // First pass: identify the canonical schema hash for TARGET_INFORMER_VERSION
  const bundleData = [];
  const schemaHashesByVersion = new Map();

  for (const file of tgzFiles) {
    const filePath = path.join(REPORT_LIBRARY_DIR, file);
    try {
      const gzipped = fs.readFileSync(filePath);
      const unzipped = zlib.gunzipSync(gzipped);
      const tarFiles = untar(unzipped);

      const bundleJsonRaw = tarFiles.get('bundle.json');
      if (!bundleJsonRaw) {
        console.warn(`[EXCLUDE] ${file}: missing bundle.json`);
        continue;
      }

      const bundleJson = JSON.parse(bundleJsonRaw.toString('utf8'));
      const schemaBytes = tarFiles.get('tables/public/schema.sql');
      const schemaHash = schemaBytes
        ? crypto.createHash('sha256').update(schemaBytes).digest('hex')
        : null;

      const version = bundleJson.version || '';
      if (!schemaHashesByVersion.has(version) && schemaHash) {
        schemaHashesByVersion.set(version, schemaHash);
      }

      bundleData.push({
        file,
        bundleJson,
        schemaHash,
        tarFiles,
      });
    } catch (err) {
      console.warn(`[EXCLUDE] ${file}: Failed to read/parse archive - ${err.message}`);
    }
  }

  const expectedSchemaHash = schemaHashesByVersion.get(TARGET_INFORMER_VERSION);
  console.log(`Target Informer version: ${TARGET_INFORMER_VERSION}`);
  console.log(`Expected schema hash: ${expectedSchemaHash ? expectedSchemaHash.slice(0, 12) : 'N/A'}`);

  const items = [];

  for (const { file, bundleJson, schemaHash, tarFiles } of bundleData) {
    const slug = file.replace(/\.tgz$/, '');

    // 1. Version Validation: strictly exclude version mismatch
    if (bundleJson.version !== TARGET_INFORMER_VERSION) {
      console.warn(
        `[EXCLUDE] ${file}: Version mismatch (found: "${bundleJson.version}", expected: "${TARGET_INFORMER_VERSION}")`
      );
      continue;
    }

    // 2. Schema Validation: strictly exclude schema hash mismatch
    if (expectedSchemaHash && schemaHash !== expectedSchemaHash) {
      console.warn(
        `[EXCLUDE] ${file}: Schema hash mismatch (found: "${schemaHash?.slice(0, 8)}", expected: "${expectedSchemaHash?.slice(0, 8)}")`
      );
      continue;
    }

    // 3. Metadata Mapping
    const docMeta = parseMarkdownMetadata(slug);
    const sideJson = parseSideJsonMetadata(slug);

    // Title: front matter title -> sideJson sourceName -> bundle name
    const bundleName = bundleJson.bundle?.name || bundleJson.name || slug;
    const title = docMeta.title || sideJson?.sourceName || bundleName;

    // Category: front matter category -> doc body category -> sideJson vaultReportType -> 'Uncategorized'
    const category =
      docMeta.category ||
      docMeta.bodyCategory ||
      sideJson?.vaultReportType ||
      'Uncategorized';

    // Description: front matter description -> doc body description -> summary -> sideJson vaultSummary -> fallback
    const description =
      docMeta.description ||
      docMeta.bodyDescription ||
      docMeta.summaryDescription ||
      sideJson?.vaultSummary ||
      bundleName;

    // Object Type determination:
    // Check markdown front matter first ('type'), then sideJson ('sourceType'), then primary CSV in tar
    let objectType = docMeta.type?.toLowerCase();
    if (!objectType) {
      if (sideJson?.sourceType === 'dataset') {
        objectType = 'dataset';
      } else if (sideJson?.sourceType === 'adHocReport') {
        objectType = 'query';
      } else if (sideJson?.sourceType === 'report') {
        objectType = 'report';
      } else if (tarFiles.has('tables/public/report.csv')) {
        objectType = 'report';
      } else if (tarFiles.has('tables/public/dataset.csv')) {
        const dsCsv = tarFiles.get('tables/public/dataset.csv').toString('utf8').trim();
        const dsLines = dsCsv ? dsCsv.split('\n').length - 1 : 0;
        const qCsv = tarFiles.has('tables/public/query.csv')
          ? tarFiles.get('tables/public/query.csv').toString('utf8').trim()
          : '';
        const qLines = qCsv ? qCsv.split('\n').length - 1 : 0;
        objectType = dsLines > qLines ? 'dataset' : 'query';
      } else if (tarFiles.has('tables/public/query.csv')) {
        objectType = 'query';
      } else {
        objectType = 'dataset';
      }
    }

    // Normalize type to one of 'dataset', 'query', 'report'
    if (objectType.includes('query')) objectType = 'query';
    else if (objectType.includes('report')) objectType = 'report';
    else objectType = 'dataset';

    // Extract datasources from bundle.json
    const datasources = Array.isArray(bundleJson.datasources)
      ? bundleJson.datasources.map((ds) => (typeof ds === 'string' ? ds : ds.name || ds.id)).filter(Boolean)
      : [];

    const item = {
      slug: docMeta.id || slug,
      title,
      description,
      type: objectType,
      category,
      version: bundleJson.version,
      datasources,
      tgzUrl: `/downloads/report-library/${file}`,
      docUrl: `/docs/report-library/${docMeta.id || slug}`,
    };

    items.push(item);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    informerVersion: TARGET_INFORMER_VERSION,
    items,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`Successfully generated manifest at ${OUTPUT_FILE} with ${items.length} items.`);
  return manifest;
}

// Run catalog generation
generateCatalog();

