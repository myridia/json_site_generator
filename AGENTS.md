# Project: json_site_generator

## Overview
Static site generator (SSG) that renders one static page per JSON document.
Shared site shell (header/menu/footer/PWA) applied to every page; each
document TYPE gets its own Vue renderer tailored to that type's JSON shape.
Built on Nuxt so the output is fully static (crawler-friendly, one stored
HTML file per doc) while remaining Vue + PWA enabled.

## Stack
- Nuxt (Vue 3) static generation (`nuxt generate`)
- Tailwind CSS (`@nuxtjs/tailwindcss`, v3, config in `tailwind.config.ts`)
- Site theme modeled on <https://www.myridia.com>: light `#eee` background, serif
  italic headings (`font-family: times`), green link accent `#88bb00` (in config as
  `myridia.green`), dotted 2px borders, right-side vertical nav, slogan quote bar
- PWA via `@vite-pwa/nuxt`
- JSON docs in `content/` bundled at build time via `import.meta.glob`
- Optional build-time CouchDB pull (`scripts/fetch-couchdb.mjs`)

## Dev Setup
```bash
npm install
npm run dev      # dev server
npm run generate # build static site into .output/public
```
Add docs as JSON in `content/docs/<type>/<slug>.json`, then rebuild.

## Project Structure
- `app.vue` — root app (NuxtLayout + NuxtPage)
- `layouts/` — shared site shell (header nav, footer), data from `content/site.json`
- `pages/` — `index.vue` (doc listing) + `docs/[type]/[slug].vue` (per-doc page)
- `components/` — `DocRenderer.vue` (type registry), `Thread.vue`/`ThreadReply.vue`,
  `FallbackDoc.vue`
- `utils/docs.ts` — `import.meta.glob` loader: `allDocs`, `getDoc(type, slug)`
- `content/docs/` — JSON docs, one file per doc
- `content/site.json` — site shell config (title, nav, footer, logo)
- `scripts/fetch-couchdb.mjs` — optional build-time CouchDB pull
- `nuxt.config.ts` — PWA module, Tailwind module, prerender routes

## Key Architecture
- **Shared shell**: Nuxt layout holds header/menu/footer + PWA; docs carry
  only their own content (threads etc. do NOT repeat the site layout).
- **Per-type renderers**: `pages/docs/[type]/[slug].vue` dispatches on `type`
  via `DocRenderer` to the right component. Add a new doc type = add a renderer
  and register it in `DocRenderer.vue`. Unknown types fall back to `FallbackDoc`.
- **Static data**: docs are bundled into the build via `import.meta.glob`
  (no runtime fetch), so each page is fully pre-rendered and crawler-friendly.
- **Routes for prerender**: `nuxt.config.ts` scans `content/docs/` to enumerate
  the `/docs/<type>/<slug>` routes for `nitro.prerender`.
- **CouchDB**: `scripts/fetch-couchdb.mjs` pulls docs into `content/docs/`
  before building (`-d <db>` or `-u <user>`).

## Conventions
- No comments in code unless asked.
- Template + JSON shape must stay in sync; document JSON schemas per type.
- Do not commit secrets (CouchDB creds via env, never hardcoded).
