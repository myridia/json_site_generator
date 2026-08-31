<img src="json_site_generator.svg" alt="json_site_generator" width="120">

# json_site_generator
Static site generator that renders one static, crawlable page per JSON document —
Vue + PWA enabled, with a shared site shell.

## Features
- One static HTML page per JSON document (SSG, pre-rendered server-side)
- Crawler-friendly: full content in the HTML, no client-side rendering required
- Shared site shell (header/nav/footer) applied to every page
- Per-type renderers: each doc `type` has a Vue component that fits its JSON
- Vue 3 (Nuxt) with Tailwind CSS
- PWA (manifest + service worker) via `@vite-pwa/nuxt`
- Easy storage: just files, deployable to any static host

## Quick start
```bash
npm install
npm run generate   # builds static site into .output/public
npx serve .output/public
```

### Add a document
1. Add a JSON file: `content/docs/<type>/<slug>.json`
2. Ensure a renderer exists for `<type>`, or it renders as fallback
3. Rebuild: `npm run generate`

Rendered at `/docs/<type>/<slug>`.

### Pull docs from CouchDB (optional)
```bash
node scripts/fetch-couchdb.mjs -u <user> -p <pass>   # pulls userdb-<hex>
node scripts/fetch-couchdb.mjs -d <db>               # pulls a named db
```
Fetched docs are written into `content/docs/`, then build as normal.

## Structure
```
content/docs/<type>/<slug>.json   # JSON docs (source)
content/site.json                 # site shell config (title, nav, footer)
utils/docs.ts                     # import.meta.glob loader (allDocs, getDoc)
components/DocRenderer.vue        # type -> renderer registry
components/Thread.vue             # thread renderer (tibellus thread schema)
components/FallbackDoc.vue        # generic fallback for unknown types
layouts/default.vue               # shared shell (header/nav/footer)
pages/index.vue                   # doc listing
pages/docs/[type]/[slug].vue      # per-doc page
assets/css/main.css               # Tailwind entry
tailwind.config.ts                # Tailwind theme
nuxt.config.ts                    # PWA + prerender routes
```

## Stack
- Nuxt / Vue 3
- Tailwind CSS
- @vite-pwa/nuxt
