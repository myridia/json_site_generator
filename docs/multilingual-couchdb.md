# Multilingual CouchDB design

Architecture for multi-language (up to ~130 languages) content where the site is
generated statically from CouchDB docs. Sources are written in one language
(default `en`); every other language is a machine translation of the source,
produced by the `mtranslate` service and stored as a separate CouchDB document.

## Model: one document per (source x language)

**Source doc (unchanged):**

```json
{
  "_id": "page:about",
  "type": "page",
  "site": "myridia",
  "lang": "en",
  "title": "About us",
  "body": [ { "heading": "What this is", "paragraphs": ["..."] } ],
  "tags": ["meta"],
  "created_at": "..."
}
```

**Translation doc (same shape, namespaced):**

```json
{
  "_id": "translation:de:page:about",
  "type": "translation",
  "site": "myridia",
  "lang": "de",
  "source_id": "page:about",
  "source_hash": "9f2c...",
  "title": "Über uns",
  "body": [ ... ],
  "translated_by": "mtranslate",
  "translated_at": "..."
}
```

- `_id` namespaces: source docs keep their ids (`thread:...`, `post:...`,
  `page:...`); translations are `translation:<lang>:<source_id>`.
- **No conflicts**: every language is an independent document with its own
  `_rev`; concurrent writes for different languages never collide.
- Replication works per language (filter by `_id` prefix), no cross-lang
  `_changes` noise.
- `source_hash` is the **drift marker**: `sha256` over the *translatable*
  fields only (`title | content | body | replies`), so editing non-translatable
  fields (e.g. `tags`) does not retrigger translation. Do not use `source_rev`
  for this: CouchDB `_rev` changes on every write.

## Which layout to avoid

- One doc with a `translations: { lang: {...} }` field — concurrent translation
  writes conflict, docs grow unbounded, granular replication is lost.
- One database per language — breaks cross-lang queries and the language
  switcher lookup.

## Views (design doc)

| View | Key | Purpose |
|------|-----|---------|
| `by_site` | `["site", "lang", "type"]` | `fetch-couchdb` pulls a whole bag |
| `by_source` | `["source_id", "lang"]` | language switcher lookup |
| `missing` | `["site", "source_id"]` | emit per configured lang when translation missing -> worker queue |
| `stale` | `["site", "source_id"]` | emit when the translation's `source_hash` != current source hash |

Mango selectors can replace views if simpler, but views keep the worker and the
bag pull to single queries.

## Translation worker flow

1. Tail CouchDB `_changes` (filtered to source docs, i.e. `type != translation`).
2. For each configured language (from a per-site language list) check
   `translation:<lang>:<id>`:
   - exists and `source_hash` matches -> do nothing
   - missing or stale -> call `mtranslate` (`GET /?s=<src>&t=<tgt>&v=<text>`
     or `POST /` with `{html, s, t}` for blocks) -> `PUT` the translation doc.
3. Steady state cost is zero; mtranslate's MySQL phrase-memory makes re-runs
   instant.

## i18n chrome strings

UI strings (title, tagline, slogan, nav[], footer, search placeholder) live in
CouchDB as `i18n:<lang>` docs and overlay the base `site.json` config for that
locale:

```json
{ "_id": "i18n:de", "type": "i18n", "site": "myridia", "lang": "de",
  "title": "Myridia", "tagline": "...", "nav": [ ... ], "footer": "..." }
```

## Static build integration

- Every doc carries a `site` field so several bags can share one CouchDB; the
  per-site pull is one view query.
- `fetch-couchdb` pulls source + `translation:*` + `i18n:*` docs into the bag
  (`content/<site>/docs/`). The site generator needs only:
  - a `[lang]` route segment under the default-language root;
  - source_hash-aware fallback to the default language when a translation file
    is missing;
  - a language switcher mapping the current doc to sibling languages via
    `source_id`.
- SEO: `<html lang="de">`, `hreflang` alternates, canonical to the default
  language URL. Search indexes per language.