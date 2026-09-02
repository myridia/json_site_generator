# AGENTS.md — json_site_generator

## Overview
Static site generator (SSG) that renders one static page per JSON document.
Built on Nuxt so the output is fully static (crawler-friendly, one stored HTML
file per doc) while remaining Vue + PWA enabled. The engine has NO design of its
own: a micro-multi-site model where **a site is one folder** ("bag") under
`content/<name>/` that owns its `layout.vue`, `style.css`, config and docs.
Copy a folder -> new site.

## The site bag — `content/<name>/`
- `site.json` — shell data: title, tagline, slogan, logo, `nav[]`, footer, plus
  an optional `home` block (hero tiles `{label,url}[]`, a `repos` grid
  `{name,url,logo}[]`, and a manifesto `columns` `{heading?, paragraphs[]}[]`).
- `layout.vue` — the site's OWN layout (header/nav/footer markup), a plain SFC
  with `<slot />` for the page; pulls its look via `<style src="./style.css">`.
- `style.css` — this site's colors, fonts, width.
- `docs/<type>/<slug>.json` — the docs. Each `type` maps to a renderer
  (`utils/renderers.ts`), shared by default, overridable per site.
- `components/` — optional per-site renderer/component overrides
  (e.g. `components/Post.vue` beats the engine's `Post.vue`).

Adding a site = add a folder; adding a doc = add a JSON file. No engine changes.

## Site selection (scripts/run.mjs)
- 0 folders under `content/` -> error (create one)
- 1 folder -> auto-rendered, no arg needed
- 2+ folders -> `npm run dev <name>` / `npm run generate <name>` (no name = error
  listing the folders). The wrapper sets `NUXT_PUBLIC_SITE`, read via
  `runtimeConfig.public.site` -> `useActiveSite()`.

## Doc types
- `thread` — top-level `content` string + optional `replies[]` (Thread.vue).
- `post` — `content` **or** structured `body[]` (`{heading?, paragraphs[]}[]`),
  plus optional `created_at`, `tags[]`, `summary` (Post.vue). Posts are
  searchable.
- `page` — standing site pages (About/Contact/Manifesto); `content` **or**
  structured `body[]`, no date/tags (Page.vue).

Renderer resolution order: **per-site `components/<Name>.vue` -> engine default
-> `FallbackDoc.vue`** (`useSiteComponent` in `utils/site.ts`).

## Search (static, client-side)
- `utils/search.ts` builds an in-memory index of every doc (title + summary +
  full JSON text, lowercased) tagged with its site name; `searchDocs(site, q)`
  ranks by hit count, scoped to the active site.
- `/search?q=<query>` page (`pages/search.vue`) runs the client-side search.
- Search box lives in each site's `layout.vue` and submits to `/search`.

## Stack
- Nuxt (Vue 3) static generation (`nuxt generate`)
- Tailwind CSS (`@nuxtjs/tailwindcss`, v3, config in `tailwind.config.ts`) —
  engine default skin only; sites style via their own `style.css`
- PWA via `@vite-pwa/nuxt`
- JSON docs in `content/<site>/` bundled at build time via `import.meta.glob`
- Optional build-time CouchDB pull (`scripts/fetch-couchdb.mjs`)

## Dev Setup
```bash
npm install
npm run dev             # auto-selects a single site folder, else needs a name
npm run generate        # builds static site into .output/public
npm run generate <name> # builds a specific site (2+ folders present)
```

## Project Structure
- `app.vue` — root: `<SiteLayout><NuxtPage/></SiteLayout>`
- `components/SiteLayout.vue` — resolves the active site's `layout.vue`
  (`siteLayouts['/content/<name>/layout.vue']`) and wraps the page in it
- `pages/index.vue` — landing; resolves `SiteLanding` via `useSiteComponent`
- `pages/docs/[type]/[slug].vue` — per-doc page (active-site scoped)
- `pages/search.vue` — client-side full-text search results (`?q=`)
- `components/DocRenderer.vue` — type -> renderer dispatcher (override first)
- `components/Thread.vue`/`ThreadReply.vue` — thread renderer (tibellus thread schema)
- `components/Post.vue` — notebook post renderer (content string or body[])
- `components/Page.vue` — basic page renderer (content string or body[])
- `components/SiteLanding.vue` — default landing ("Welcome to the real world"
  columns + projects grid)
- `components/FallbackDoc.vue` — generic fallback for unknown types
- `utils/site.ts` — bag loader: import.meta.glob over `content/*/` for
  `site.json`, `docs/`, `layout.vue`, `components/`; exports `sites`, `getSite`,
  `getSiteDoc`, `useActiveSite`, `useSiteComponent`, `siteLayouts`, `siteComponents`
- `utils/renderers.ts` — doc-type -> component NAME registry (`rendererName`)
- `utils/search.ts` — build-time per-site index + `searchDocs(site, query)`
- `scripts/run.mjs` — site-selection wrapper used by dev/build/generate
- `scripts/fetch-couchdb.mjs` — optional build-time CouchDB pull
  (`-s <site>` selects the bag, default `myridia`) into `content/<site>/docs/`
- `nuxt.config.ts` — PWA module, Tailwind module, `runtimeConfig.public.site`,
  prerender routes (scans the active bag's docs)

## URLs
- `/` — landing page
- `/docs/<type>/<slug>` — one doc
- `/search?q=<query>` — search

## Key Architecture
- **Per-site design**: layout + style are NOT engine-level. Each bag carries
  `layout.vue` (frame) and `style.css` (look); `SiteLayout` mounts the active
  site's layout around `NuxtPage`. Engine has no look of its own.
- **Component resolution**: `useSiteComponent(name)` = bag `components/<Name>.vue`
  if present, else the engine default component. Used for the landing and the
  doc renderers. New doc type = add a registry entry in `utils/renderers.ts`
  (and a component). Unknown types fall back to `FallbackDoc`.
- **Static data**: docs + layout + site config are bundled into the build via
  `import.meta.glob` (no runtime fetch), so each page is fully pre-rendered.
- **Routes for prerender**: `nuxt.config.ts` scans the active bag's
  `content/<name>/docs/*` to enumerate `/docs/<type>/<slug>` for
  `nitro.prerender`.

## Conventions
- No comments in code unless asked.
- Template + JSON shape must stay in sync; document JSON schemas per type.
- Do not commit secrets (CouchDB creds via env, never hardcoded).
- Keep at most one site folder active when you want no-arg commands; with
  several folders you must pass the site name.