<img src="json_site_generator.svg" alt="json_site_generator" width="120">

# json_site_generator
Static site generator that renders one static, crawlable page per JSON document —
Vue 3 (Nuxt) + Tailwind + PWA, with a shared site shell applied to every page.

## Features
- One static HTML file per JSON document (SSG, pre-rendered server-side)
- Crawler-friendly: full content in the HTML, no client-side rendering required
- Shared site shell (header/nav/footer/PWA) applied to every page
- Per-doc-type renderers: each doc `type` has a Vue component that fits its JSON
- Client-side full-text search (static deployment, no search server)
- Easy storage: just files, deployable to any static host

## Quick start
```bash
npm install
npm run dev        # live dev with HMR
npm run generate   # builds static site into .output/public
npx serve .output/public
```

## Content
```
content/
  site.json              # the site shell config (title, nav, footer, home)
  docs/<type>/<slug>.json   # the docs; each type gets a renderer
```

`site.json` carries the shell look — title, tagline, slogan, logo, `nav[]`,
`footer`, and an optional `home` block (hero tiles `{label,url}[]`, a `repos`
grid `{name,url,logo}[]`, and manifesto `columns` `{heading?, paragraphs[]}[]`).

### Add a document
1. Add a JSON file: `content/docs/<type>/<slug>.json`
2. Ensure a renderer exists for `<type>` (registered in `utils/renderers.ts`),
   or it renders as a fallback
3. Rebuild: `npm run generate`

Rendered at `/docs/<type>/<slug>`.

### Doc types
- `thread` — top-level `content` string + optional `replies[]` (`Thread.vue`)
- `post` — `content` **or** structured `body[]`, plus `created_at`, `tags[]`,
  `summary` (`Post.vue`). Posts are surfaced as "Recent from the Notebook" on the
  landing page and are searchable.

## Theme — where does what go?
- **Shell data** → `content/site.json`
- **Shell markup** (header, nav, search, footer, width/padding) → `layouts/default.vue`
- **Colors + fonts** → `tailwind.config.ts` (`myridia.green` `#88bb00`, `ink`,
  `muted`, `bg`; `font-heading` = times serif, `font-body` = arial)
- **Base styles** (body/headings/links) → `assets/css/main.css`
- **Landing layout** → `components/SiteLanding.vue`
- **Doc renderers** → one component per type, mapped in `utils/renderers.ts`:
  ```ts
  const renderers: Record<string, Component> = {
    thread: Thread,
    post: Post,
  };
  ```

### Pull docs from CouchDB (optional)
```bash
node scripts/fetch-couchdb.mjs -u <user> -p <pass>   # pulls userdb-<hex>
node scripts/fetch-couchdb.mjs -d <db>               # pulls a named db
```
Fetched docs are written into `content/docs/<type>/`, then build as normal.

## URL scheme
- `/` — landing page (hero/repos/manifesto + "Recent from the Notebook")
- `/docs/<type>/<slug>` — one doc
- `/search?q=<query>` — search

## Structure
```
.
├── AGENTS.md
├── LICENSE
├── README.md
├── app.vue                    # root app (NuxtLayout + NuxtPage)
├── ask.sh                     # task runner (dev/generate/clean/...)
├── assets/css/main.css        # Tailwind entry + base styles
├── components
│   ├── DocRenderer.vue        # type -> renderer dispatcher
│   ├── FallbackDoc.vue        # generic fallback for unknown types
│   ├── SiteLanding.vue        # landing page (hero/repos/manifesto/recent)
│   ├── Thread.vue             # thread renderer (tibellus thread schema)
│   ├── ThreadReply.vue        # thread reply renderer
│   └── Post.vue               # notebook post renderer
├── content
│   ├── site.json              # shell config (title, nav, footer, home)
│   └── docs/<type>/<slug>.json          # the docs
├── json_site_generator.svg
├── layouts/default.vue        # shared shell (header/nav/footer)
├── nuxt.config.ts             # PWA + prerender routes (scans content/docs)
├── package.json
├── package-lock.json
├── pages
│   ├── index.vue              # landing page
│   ├── docs/[type]/[slug].vue # a doc
│   └── search.vue             # client-side full-text search
├── public                     # static assets (imgs, PWA icons)
├── scripts/fetch-couchdb.mjs  # pull docs from CouchDB into content/docs
└── utils
    ├── renderers.ts           # doc-type -> component registry (resolveRenderer)
    ├── search.ts              # build-time index + searchDocs
    └── site.ts                # content/site.json + import.meta.glob docs loader
```

## Stack
- Nuxt / Vue 3
- Tailwind CSS
- @vite-pwa/nuxt