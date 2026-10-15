# Brief: Merging Informer Bundles into a Multi-Object Bundle

**Goal:** Add a page to the Docusaurus site where a user picks several items from the Report Library (datasets, ad hoc queries, reports) and downloads **one** `.tgz` bundle that they drag and drop into Informer to import all of them at once.

**Status:** Proven with code. A proof of concept ([poc-merge.mjs](./poc-merge.mjs)) merged `JOIN-Default Brand Rep.tgz` and `NAVIGA-Gen Clients.tgz`. The output has the same tables and row counts as the bundle Informer exported for the same two items (`bundleaitest.tgz`). It still needs to be imported into Informer to confirm.

**Decision:** UUIDs are **not** changed. Items keep their original IDs, the same as a normal Informer export.

---

## 1. What a bundle is

A bundle is **not** one JSON file per item. It is a gzipped tar of a **slice of Informer's Postgres database**, with one CSV file per table:

```text
bundle.json                 ← header: bundle name, system, Informer version, datasources[]
tables/
tables/public/
   schema.sql               ← DDL for every table (identical for a given Informer version)
   dataset.csv              dataset_field.csv     query.csv        report*.csv (when present)
   datasource.csv           mapping.csv           field.csv        link.csv
   tag.csv                  tag_entity.csv        code.csv         set.csv   mapping_set_entry.csv
   function.csv             map.csv               user.csv         team.csv  principal.csv
   domain.csv               tenant.csv            avatar.csv       migrations.csv
```

- The CSVs are in Postgres `COPY … CSV HEADER` format: `\n` line endings, `""` to escape a quote, and quoted values can span several lines.
- An unquoted empty value means `NULL`. A quoted `""` means an empty string. **Keep each row's original text unchanged.** Don't parse it and write it back out.
- Tables with no rows are left out of the bundle.

### `bundle.json`

```json
{
  "createdBy": { "username": "MARK.MCCOID", "displayName": "Mark McCoid" },
  "createdAt": "2026-10-13T20:00:11.779Z",
  "bundle":    { "id": "986c8dc6-…", "name": "BundleAITest" },
  "system":    { "id": "manager", "name": "Manager", "systemId": "d9f7b4d3-…" },
  "version":   "5.8.6",
  "datasources": [ { "id": "538e966c-…", "name": "DEVDIGITAL", "type": "unidata" } ]
}
```

A single-item export has only `bundle.name`. A bundle exported from an Informer *Bundle* object also has `bundle.id`.

### How the IDs connect (from the sample bundles)

| Item | Table / column | Points to |
|------|----------------|-----------|
| Dataset | `dataset.id` | the dataset itself |
| | `dataset.queryId` | a hidden query row (`query.embedded = t`) that defines the dataset |
| | `dataset_field.datasetId` | the dataset's columns |
| Ad hoc query ("report") | `query.id`, `query.datasourceId` | the datasource |
| Report (dataset-based) | `report`, `report_dataset` | datasets *(no sample bundle yet)* |
| Tags | `tag_entity.tagId` + `datasetId` / `queryId` / `datasourceId` | `tag.id` |
| Datasource | `datasource.id` | the datasource itself. Also used as a prefix in other IDs: `mapping.id = "<dsId>:ODBC_SALESREPS"`, `field.id = "<dsId>:ODBC_SALESREPS:REP_NAME"`, `link.fromId/toId` |

Every bundle also contains shared rows for the system: users, teams, domains, the tenant, avatar, **all saved functions** (`function.csv`), `map.csv` and `migrations.csv`.

---

## 2. Merge rule (checked against Informer's own output)

Informer's multi-item bundle is the **combination of the single-item bundles, with each row included once by primary key**. In the comparison:

- Every table in Informer's bundle had exactly the combined set of record IDs from the two single bundles, with nothing extra and nothing missing.
- `schema.sql` was byte-identical in all three files, and every CSV header matched.
- The only differences in content were newer values (timestamps, record counts, edited functions), because the single bundles were exported earlier.

### Algorithm

1. **Unpack** each input (`gunzip`, then read the tar).
2. **Check compatibility:** `schema.sql` and `bundle.json.version` must match across all inputs. If they don't, stop with a clear error, because some downloads in `static/downloads` come from older Informer versions (5.1.2, 5.4.6).
3. **Get the primary keys** from `schema.sql`:
   `ALTER TABLE "<t>" ADD CONSTRAINT "…" PRIMARY KEY (<cols>)`.
   Most tables use `(tenant, id)`. The exceptions are `user` `(tenant, username)`, `tenant` `(id)` and `migrations` `(migration)`.
4. **For each `tables/public/<t>.csv`:**
   - Check that the header line is the same in every input.
   - Split the file into records, minding quoted newlines, and work out each row's primary key.
   - Keep one row per key. If two inputs have the same key, **the newest `updatedAt` wins**; with no `updatedAt`, the last input wins.
5. **Datasources need no special step.** Shared datasource, mapping, field and link rows collapse automatically because they share primary keys. Optionally warn if two inputs have the same datasource ID with a different name.
6. **Write `bundle.json`:**
   - Base it on the last input.
   - Set `createdAt` to now and `bundle.name` to the user's chosen name.
   - Combine `datasources[]`, one entry per `id`.
   - Leave out `bundle.id`, the same as a single-item export (see open questions).
7. **Write the tar** in Informer's order: `bundle.json`, `tables/`, `tables/public/`, then the files sorted by name. Use mode 0666 for files and 0777 for directories, with uid/gid 0. Then gzip it.

---

## 3. Building it into Docusaurus

The site is static (Netlify), so **merge in the browser**. No server is needed.

- **Source bundles:** `static/downloads/report-library/<slug>.tgz`, already linked from each library page.
- **Item list:** build it from `reportLibrarySidebar.js` and the page front matter, or have the `publish-docs` step create a small `report-library/index.json` (slug, title, type, category, Informer version).
- **UI (a React component on an `.mdx` page):**
  - A checkbox list grouped by category.
  - A bundle name field.
  - A "Download bundle" button.
  - A warning when the selected items come from different Informer versions.
- **Libraries:** none needed.
  - gzip: use the browser's built-in `DecompressionStream('gzip')` / `CompressionStream('gzip')`.
  - tar: the small reader and writer in the proof of concept (about 40 lines).
  - Download: `Blob` plus `URL.createObjectURL`.
- **Code layout:** put the merge logic in one plain-JS module (for example `src/components/bundleMerger/mergeBundles.js`) that takes an array of `Uint8Array` and returns one. The same module can then run in Node (CLI or tests) and in the browser.
- **Size:** each bundle is about 0.15–0.7 MB (most of it is `map.csv` and `function.csv`). The merged file stays about the size of the largest input, so working in memory is fine.

---

## 4. Open questions and risks

1. **Import test.** Drag the proof-of-concept output into Informer and confirm all items appear with no errors. Also test whether a missing `bundle.id` makes any difference.
2. **Dataset-based Reports.** No sample has been checked yet. Confirm that `report`, `report_dataset` and the related tables follow the same primary-key rule. They should, since they're ordinary tables in `schema.sql`.
3. **Shared rows overwrite.** `function.csv` (all saved functions), `user`, `tenant` and `datasource` rows go into every bundle. On import they may overwrite newer versions on the customer's system. This is true of normal Informer exports too, but it's worth a note on the page.
4. **Different versions.** Block merging for now. Later we could allow it when the headers of every table in the selection match.
5. **Library hygiene.** Re-export older library bundles from the current Informer version so that any combination can be merged.

---

## 5. Reference files

- `briefs/poc-merge.mjs`: Node proof of concept with no dependencies (tar, gzip and CSV merge).
  Usage: `node briefs/poc-merge.mjs out.tgz "Bundle Name" a.tgz b.tgz …`
- Reference multi-item bundle exported by Informer: `D:\NAVIGA\OneDrive - Naviga\informerApps\reportHelper\bundleaitest.tgz`
- Single-item source bundles: `D:\NAVIGA\OneDrive - Naviga\myApplications\informer-report-library-obsidian\_bundles\`
