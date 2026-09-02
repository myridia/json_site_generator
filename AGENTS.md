# Project: json_site_generator

## Overview
Static site generator (SSG) that renders one static page per JSON document.
Built on Nuxt so the output is fully static (crawler-friendly, one stored HTML
file per doc) while remaining Vue + PWA enabled. A shared engine hosts ONE site
(shell + docs + renderers) — there is no multi-site layer.

## Content model
- `content/site.json` — the site shell config: title, tagline, slogan, logo,
  `nav[]`, footer, plus an optional `home` block (hero tiles `{label,url}[]`,
  a `repos` grid `{name,url,logo}[]`, and a manifesto `columns`
  `{heading?, paragraphs[]}[]`) rendered on the landing page.
- `content/docs/<type>/<slug>.json` — the docs. Each `type` gets a renderer
  registered in `utils/renderers.ts` (type -> Vue component).

Adding content = add a JSON file under `content/docs/`. No engine changes needed.

## Doc types
- `thread` — top-level `content` string + optional `replies[]` (Thread.vue)
- `post` — `content` **or** structured `body[]` (`{heading?, paragraphs[]}[]`),
  plus optional `created_at`, `tags[]`, `summary` (Post.vue). Posts are surfaced
  as "Recent from the Notebook" on the landing page and are searchable.

## Search (static, client-side)
- `utils/search.ts` scans every doc at build time into an in-memory index
  (title + summary + full JSON text, lowercased) and `searchDocs(query)` returns
  matches ranked by hit count.
- `/search?q=<query>` page (`pages/search.vue`) runs the client-side search.
- Search box in the header (`layouts/default.vue`) submits to `/search`.
- No search server; matching happens in the browser against the pre-built index.

## Stack
- Nuxt (Vue 3) static generation (`nuxt generate`)
- Tailwind CSS (`@nuxtjs/tailwindcss`, v3, config in `tailwind.config.ts`)
- Theme modeled on <https://www.myridia.com>: light `#eee` background, serif
  italic headings (`font-family: times`), green link accent `#88bb00` (in config
  as `myridia.green`), dotted 2px borders, right-side vertical nav, slogan quote bar
- PWA via `@vite-pwa/nuxt`
- JSON docs in `content/` bundled at build time via `import.meta.glob`
- Optional build-time CouchDB pull (`scripts/fetch-couchdb.mjs`)

## Dev Setup
```bash
npm install
npm run dev        # dev server, one site at root URLs
npm run generate   # build static site into .output/public
```

## Project Structure
- `app.vue` — root app (NuxtLayout + NuxtPage)
- `layouts/default.vue` — shared site shell (header nav, search, footer); reads
  the single site config from `utils/site.ts`
- `pages/index.vue` — landing page (`SiteLanding`)
- `pages/docs/[type]/[slug].vue` — per-doc page
- `pages/search.vue` — client-side full-text search results (`?q=`)
- `components/DocRenderer.vue` — type -> renderer dispatcher
- `components/Thread.vue`/`ThreadReply.vue` — thread renderer (tibellus thread schema)
- `components/Post.vue` — notebook post renderer (content string or body[])
- `components/SiteLanding.vue` — landing layout (hero/repos/manifesto/recent posts)
- `components/FallbackDoc.vue` — generic fallback for unknown types
- `utils/site.ts` — loads `content/site.json` + `content/docs/**/*.json` via
  `import.meta.glob`: `site`, `docs`, `getDoc(type, slug)`
- `utils/renderers.ts` — doc-type renderer registry: type -> `Component`,
  `resolveRenderer(type)`
- `utils/search.ts` — build-time index of all docs + `searchDocs(query)`
- `content/site.json` — site shell config (title, nav, footer, home)
- `content/docs/` — one folder per doc type (`<type>/<slug>.json`)
- `scripts/fetch-couchdb.mjs` — optional build-time CouchDB pull into `content/docs/`
- `nuxt.config.ts` — PWA module, Tailwind module, prerender routes (scans content/docs)

## URLs
- `/` — landing page
- `/docs/<type>/<slug>` — one doc
- `/search?q=<query>` — search

## Key Architecture
- **Shared shell**: Nuxt layout holds header/menu/footer + PWA; docs carry only
  their own content (threads etc. do NOT repeat the site layout).
- **Per-type renderers**: `pages/docs/[type]/[slug].vue` dispatches on `type`
  via `DocRenderer` to the right component registered in `utils/renderers.ts`.
  Add a new doc type = add a registry entry (and a component). Unknown types
  fall back to `FallbackDoc`.
- **Static data**: docs are bundled into the build via `import.meta.glob`
  (no runtime fetch), so each page is fully pre-rendered and crawler-friendly.
- **Routes for prerender**: `nuxt.config.ts` scans `content/docs/*` to enumerate
  the `/docs/<type>/<slug>` routes for `nitro.prerender`.

## Conventions
- No comments in code unless asked.
- Template + JSON shape must stay in sync; document JSON schemas per type.
- Do not commit secrets (CouchDB creds via env, never hardcoded).