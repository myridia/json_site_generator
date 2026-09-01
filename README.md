<img src="json_site_generator.svg" alt="json_site_generator" width="120">

# json_site_generator
Reusable multi-site static site generator that renders one static, crawlable page
per JSON document — Vue + PWA enabled, with a shared site shell that adapts to
each site's own theme, JSON docs, and renderer logic.

## Features
- **Multi-site**: one engine, many independent sites. Each site = a folder under
  `content/sites/<site>/` with its own `site.json` (theme/nav/footer), its own
  `docs/`, and its own renderers registered in `utils/renderers.ts`.
- One static HTML page per JSON document (SSG, pre-rendered server-side)
- Crawler-friendly: full content in the HTML, no client-side rendering required
- Shared site shell (header/nav/footer) applied to every page, driven by the active site
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

### Add a document (to the myridia site)
1. Add a JSON file: `content/sites/myridia/docs/<type>/<slug>.json`
2. Ensure a renderer exists for `<type>` (registered in `utils/renderers.ts`), or it renders as fallback
3. Rebuild: `npm run generate`

Rendered at `/s/myridia/docs/<type>/<slug>`.

### Add a new site
1. Create `content/sites/<site>/site.json` (theme shell) + `content/sites/<site>/docs/`
2. Register that site's renderers in `utils/renderers.ts`
3. Rebuild: `npm run generate`

Rendered at `/s/<site>` and `/s/<site>/docs/<type>/<slug>`.

## Where does what go?

Your two inputs map to:

- **Your JSON docs** → one folder per site under `content/sites/`:
  ```
  content/sites/myridia/
    site.json                # this site's shell/theme config
    docs/<type>/<slug>.json  # e.g. docs/thread/example-thread.json
  ```

- **Theme / layout** → two layers:
  1. **The shell look** (title, colors, nav, footer, slogan, logo) is **data** —
     set in that site's `site.json`:
     ```jsonc
     {
       "title": "Myridia",
       "tagline": "...",
       "slogan": "...",
       "logo": "/imgs/logo.png",
       "nav": [ { "label": "Home", "url": "/s/myridia" } ],
       "footer": "..."
     }
     ```
  2. **The component logic / per-type layout** → Vue components in `components/`,
     and each doc `type` is mapped to its renderer in `utils/renderers.ts`:

     ```ts
     // utils/renderers.ts
     const registries: Record<string, Registry> = {
       myridia: { thread: Thread },          // myridia renders `thread` docs with Thread.vue
       // "next-project": { blog: BlogPost }, // add your next site here
     };
     ```
     - Outer key (`myridia`) = a site in `content/sites/`
     - Inner key (`thread`) = a doc `type` in that site's `docs/<type>/`
     - Value (`Thread`) = the Vue component that renders that type

**To add a new themed project later (this is the whole point):**
1. `mkdir content/sites/<name>/docs/<type>`
2. drop your JSON files in there
3. write its `<name>/site.json`
4. add one entry in `utils/renderers.ts` mapping your doc types → renderer components
5. rebuild — no engine code changes needed

### Pull docs from CouchDB (optional)
```bash
node scripts/fetch-couchdb.mjs -u <user> -p <pass> [-s <site>]   # pulls userdb-<hex> into that site (default myridia)
node scripts/fetch-couchdb.mjs -d <db> [-s <site>]               # pulls a named db into that site
```
Fetched docs are written into `content/sites/<site>/docs/`, then build as normal.

## URL scheme
- `/` — all sites listing
- `/s/<site>` — a site's landing page
- `/s/<site>/docs/<type>/<slug>` — one doc

## Structure
```
.
├── AGENTS.md
├── LICENSE
├── README.md
├── app.vue                    # root app (NuxtLayout + NuxtPage)
├── assets/css/main.css        # Tailwind entry
├── components
│   ├── DocRenderer.vue        # per-site type -> renderer dispatcher
│   ├── FallbackDoc.vue        # generic fallback for unknown types
│   ├── Thread.vue             # thread renderer (tibellus thread schema)
│   └── ThreadReply.vue        # thread reply renderer
├── content/sites
│   └── myridia
│       ├── site.json          # that site's shell config (title, nav, footer)
│       └── docs/<type>/<slug>.json   # that site's JSON docs
├── json_site_generator.svg
├── layouts/default.vue        # shared shell (header/nav/footer), site-driven
├── nuxt.config.ts             # PWA + prerender routes (all sites)
├── package.json
├── package-lock.json
├── pages
│   ├── index.vue              # all-sites listing
│   └── s
│       ├── [site]/index.vue   # one site's landing
│       └── [site]/docs/[type]/[slug].vue   # per-doc page
├── public                     # static assets (imgs, PWA icons)
├── scripts/fetch-couchdb.mjs  # pull docs from CouchDB into a site
└── utils
    ├── renderers.ts           # per-site renderer registry (resolveRenderer)
    └── sites.ts               # import.meta.glob loader (sites, getSite, getSiteDoc)
```

## Stack
- Nuxt / Vue 3
- Tailwind CSS
- @vite-pwa/nuxt
