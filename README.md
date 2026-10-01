<img src="json_site_generator.svg" alt="json_site_generator" width="120">
# json_site_generator
Static site generator that renders one static, crawlable page per JSON document —
Vue 3 (Nuxt) + Tailwind + PWA. The engine has no design of its own: **a site is a
folder**, and the folder owns its layout, its style, and its docs. Make a new site
by copying a folder.

## Features
- One static HTML file per JSON document (SSG, pre-rendered server-side)
- Crawler-friendly: full content in the HTML, no client-side render step
- **A site = one folder** (`content/<name>/`) that carries its own `layout.vue`
  and `style.css` — drop a folder in, give it a unique design, done
- Shared doc renderers with **per-site overrides + failsafe fallback**
- Client-side full-text search (static deployment, no search server)
- Just files, deployable to any static host

## Quick start
```bash
npm install
npm run dev        # one site folder in content/ -> auto, no args needed
npm run generate   # builds static site into .output/public
npx serve .output/public
```

## Site selection
Sites live as folders under `content/`. Selection is automatic:

| Folders in `content/` | Command | Result |
|---|---|---|
| 0 | `npm run dev` | Error: create a site folder |
| 1 | `npm run dev` | Renders that folder — no arg needed |
| 2+ | `npm run dev <name>` | Renders the named folder |
| 2+ | `npm run dev` (no name) | Error listing the folders |

Same for `npm run generate` / `npm run build`.

Make a new site:
```bash
cp -r content/myridia content/coolthing   # copy a site, rename it
# edit content/coolthing/{site.json,layout.vue,style.css,docs/}
npm run generate coolthing
```

## The site bag — `content/<name>/`
```
content/<name>/
  site.json              # shell data: title, slogan, logo, nav[], footer, home
  layout.vue             # THIS site's header/nav/footer markup (the design)
  style.css              # THIS site's colors, fonts, width (imported by layout.vue)
  docs/<type>/<slug>.json  # the docs
  components/            # optional: per-site renderer overrides (see below)
```
- `site.json` carries the shell data — `title`, `tagline`, `slogan`, `logo`,
  `nav[]` (`{label,url}[]`), `footer`, and an optional `home` block (hero tiles
  `{label,url}[]`, a `repos` grid `{name,url,logo}[]`, and manifesto `columns`
  `{heading?, paragraphs[]}[]`). The layout reads it via `useActiveSite()`.
- `layout.vue` is a plain Vue SFC with `<slot />` where the page renders. Pull in
  the look with `<style src="./style.css">`. Two sites = two different layouts.
- Navigation URLs in `site.json` are root-relative to the site (`/`,
  `/docs/<type>/<slug>`), since only that site is built at a time.

### Add a document
1. Add a JSON file: `content/<name>/docs/<type>/<slug>.json`
2. Rebuild: `npm run generate <name>`
Rendered at `/docs/<type>/<slug>`.

### Doc renderers
The engine ships default renderers (`thread` → `Thread.vue`, `post` →
`Post.vue`, `page` → `Page.vue`, unknown → `FallbackDoc.vue`, mapped in
`utils/renderers.ts`). A site
overrides any of them by adding its own file in the bag:
```
content/<name>/components/Post.vue     # used instead of the engine Post
```
Resolution order: **per-site `components/<Name>.vue` → engine default → FallbackDoc**.

### Doc types
- `thread` — top-level `content` string + optional `replies[]` (`Thread.vue`)
- `post` — `content` **or** structured `body[]`, plus `created_at`, `tags[]`,
  `summary` (`Post.vue`). Searchable.
- `page` — standing site pages (About/Contact/Manifesto); `content` **or**
  structured `body[]`, no date/tags (`Page.vue`).

## URLs
- `/` — landing page ("Welcome to the real world" manifesto + projects grid)
- `/docs/<type>/<slug>` — one doc
- `/search?q=<query>` — search (indexed per active site)

## Theme — who owns what
- **Site design** (header/nav/footer markup + colors/fonts) → the site's
  `layout.vue` + `style.css` inside `content/<name>/`
- **Site data** (title, slogan, nav labels, hero, footer text) → `site.json`
- **Engine default skin** (used by the shared renderers, failsafe) →
  `assets/css/main.css` + `tailwind.config.ts` (`myridia.green` `#88bb00`)
- **Engine components** (landing + doc renderers, overridable per site) →
  `components/SiteLanding.vue`, `Thread.vue`, `Post.vue`, `Page.vue`,
  `FallbackDoc.vue`

## Structure
```
.
├── app.vue                    # root: <SiteLayout><NuxtPage/></SiteLayout>
├── ask.sh                     # task runner (dev/generate/clean/list sites/...)
├── assets/css/main.css        # engine default skin (Tailwind entry + base)
├── components
│   ├── SiteLayout.vue         # resolves the active site's layout.vue
│   ├── DocRenderer.vue        # type -> renderer dispatcher (bag override first)
│   ├── SiteLanding.vue        # default landing (manifesto + projects grid)
│   ├── FallbackDoc.vue        # generic fallback for unknown types
│   ├── Thread.vue             # default thread renderer
│   ├── ThreadReply.vue        # default thread reply renderer
│   ├── Post.vue               # default notebook post renderer
│   └── Page.vue               # default basic page renderer
├── content
│   └── <name>/                # one folder per site (the "bag")
│       ├── site.json
│       ├── layout.vue
│       ├── style.css
│       ├── docs/<type>/<slug>.json
│       └── components/        # optional per-site renderer overrides
├── nuxt.config.ts             # runtimeConfig.site + prerender (scans the bag's docs)
├── pages
│   ├── index.vue              # landing (resolvable via per-site override)
│   ├── docs/[type]/[slug].vue # a doc
│   └── search.vue             # client-side full-text search
├── public                     # static assets (imgs, PWA icons)
├── scripts
│   ├── run.mjs                # site selection wrapper (dev/build/generate)
│   └── fetch-couchdb.mjs      # pull docs from CouchDB into a site's docs/
└── utils
    ├── renderers.ts           # doc type -> component name registry
    ├── search.ts              # build-time per-site index + searchDocs
    └── site.ts                # bag loader: sites, getSite, useActiveSite,
                               #   siteLayouts, siteComponents, useSiteComponent
```

## Stack
- Nuxt / Vue 3 (static generation via `nuxt generate`)
- Tailwind CSS (`@nuxtjs/tailwindcss`)
- `@vite-pwa/nuxt` PWA

## CouchDB pull (optional)
```bash
node scripts/fetch-couchdb.mjs -u <user> -p <pass>             # -> content/myridia/docs/
node scripts/fetch-couchdb.mjs -d <db> -s <site>               # -> a specific site's docs/
```
Fetched docs are written into `content/<site>/docs/<type>/`, then build as normal.