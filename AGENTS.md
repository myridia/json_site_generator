# Project: json_site_generator

## Overview
Reusable multi-site static site generator (SSG) that renders one static page
per JSON document. A shared engine hosts MANY independent sites, each with its
own theme (site shell), its own JSON docs, and its own renderer logic. Shared
site shell (header/menu/footer/PWA) applied to every page; each document TYPE
gets its own Vue renderer tailored to that type's JSON shape.
Built on Nuxt so the output is fully static (crawler-friendly, one stored
HTML file per doc) while remaining Vue + PWA enabled.

## Multi-site model
Each site is a self-contained folder:
`content/sites/<site>/` containing:
- `site.json` — that site's shell config (title, tagline, slogan, logo, nav, footer)
  plus an optional `home` block (hero tiles `{label,url}[]` and manifesto
  `columns` `{heading?, paragraphs[]}[]`) rendered on that site's landing page.
- `docs/<type>/<slug>.json` — that site's documents (each `type` gets a renderer)
- Renderers for that site's doc types are registered in `utils/renderers.ts`
  (keyed by site name; see below)

Adding a new project/site = add a folder under `content/sites/` + a renderer
registry entry in `utils/renderers.ts`. No engine code changes needed.

## Doc types
- `thread` — top-level `content` string + optional `replies[]` (renderer: Thread.vue)
- `post` — Notebook/blog entry: `content` **or** structured `body[]`
  (`{heading?, paragraphs[]}[]`), plus optional `created_at`, `tags[]`, `summary`
  (renderer: Post.vue). Posts are surfaced as "Recent from the Notebook" on the
  landing page and are searchable.

## Search (static, client-side)
- `utils/search.ts` scans every site's docs at build time into an in-memory index
  (title + summary + full JSON text, lowercased) and `searchDocs(query)` returns
  matched docs ranked by hit count.
- `/search?q=<query>` page (`pages/search.vue`) runs the client-side search.
- A search box in the header layout (`layouts/default.vue`) submits to `/search`.
- There is no search server; all matching happens in the browser against the
  pre-built index, so it works on a fully static deployment.

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
Add docs as JSON in `content/sites/<site>/docs/<type>/<slug>.json`, then rebuild.

## Project Structure
- `app.vue` — root app (NuxtLayout + NuxtPage)
- `layouts/default.vue` — shared site shell (header nav, footer); resolves the
  current site from the route (`/s/<site>/...` -> `content/sites/<site>/site.json`)
- `pages/index.vue` — lists all sites + their docs
- `pages/s/[site].vue` — one site's landing (hero/manifesto from `site.json home`
  + "Recent from the Notebook" posts)
- `pages/s/[site]/docs/[type]/[slug].vue` — per-doc page
- `pages/search.vue` — client-side full-text search results (`?q=`)
- `components/DocRenderer.vue` — per-site type registry dispatcher
- `components/Thread.vue`/`ThreadReply.vue` — thread renderer (tibellus thread schema)
- `components/Post.vue` — Notebook post renderer (content string or body[])
- `components/FallbackDoc.vue` — generic fallback for unknown types
- `utils/sites.ts` — `import.meta.glob` loader of `content/sites/*`: `sites`,
  `getSite(name)`, `getSiteDoc(site, type, slug)`
- `utils/renderers.ts` — per-site renderer registry: site name -> `{type: Component}`,
  `resolveRenderer(site, type)`, `registerSiteRenderers(site, registry)`
- `utils/search.ts` — build-time index of all docs + `searchDocs(query)`
- `content/sites/` — one folder per site (site.json + docs/)
- `scripts/fetch-couchdb.mjs` — optional build-time CouchDB pull
- `nuxt.config.ts` — PWA module, Tailwind module, prerender routes (scans all sites)

## URLs
- `/` — all sites listing
- `/s/<site>` — a site's landing page
- `/s/<site>/docs/<type>/<slug>` — one doc

## Key Architecture
- **Shared shell**: Nuxt layout holds header/menu/footer + PWA; docs carry
  only their own content (threads etc. do NOT repeat the site layout). The
  shell reads the active site from `route.params.site`.
- **Per-site renderers**: `pages/s/[site]/docs/[type]/[slug].vue` dispatches on
  `type` via `DocRenderer` to the right component registered for that site in
  `utils/renderers.ts`. Add a new doc type/site logic = add a registry entry
  (and a component). Unknown types fall back to `FallbackDoc`.
- **Static data**: docs are bundled into the build via `import.meta.glob`
  (no runtime fetch), so each page is fully pre-rendered and crawler-friendly.
- **Routes for prerender**: `nuxt.config.ts` scans `content/sites/*` to enumerate
  the `/s/<site>` and `/s/<site>/docs/<type>/<slug>` routes for `nitro.prerender`.

## Conventions
- No comments in code unless asked.
- Template + JSON shape must stay in sync; document JSON schemas per type.
- Do not commit secrets (CouchDB creds via env, never hardcoded).
