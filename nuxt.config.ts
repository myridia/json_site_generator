import { readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-01",
  devtools: { enabled: true },

  modules: ["@vite-pwa/nuxt", "@nuxtjs/tailwindcss"],

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
    },
  },

  runtimeConfig: {
    public: {
      site: process.env.NUXT_PUBLIC_SITE || "",
    },
  },

  nitro: {
    prerender: {
      routes: ["/", "/search", ...buildSiteRoutes()],
    },
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "json_site_generator",
      short_name: "JSON Site Gen",
      description: "Static pages generated from JSON documents",
      theme_color: "#1a1a2e",
      background_color: "#1a1a2e",
      display: "standalone",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
    },
  },
});

function activeSiteName(): string {
  const env = (process.env.NUXT_PUBLIC_SITE || "").trim();
  if (env) return env;
  const dirs = readdirSync("content", { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name);
  if (dirs.length === 1) return dirs[0];
  if (dirs.length === 0) {
    console.error("[nuxt] no site folder found under content/ (create content/<name>/ with site.json, layout.vue, docs/)");
  } else {
    console.error(`[nuxt] multiple site folders (${dirs.join(", ")}) — run "npm run build <name>" / "npm run generate <name>"`);
  }
  return "";
}

function buildSiteRoutes() {
  const name = activeSiteName();
  if (!name) return [];
  const src = fileURLToPath(new URL(`./content/${name}/docs/`, import.meta.url));
  if (!existsSync(src)) return [];
  const routes = [];
  for (const type of readdirSync(src)) {
    const typeDir = join(src, type);
    if (!statSync(typeDir).isDirectory()) continue;
    for (const file of readdirSync(typeDir)) {
      if (!file.endsWith(".json")) continue;
      routes.push(`/docs/${type}/${file.replace(/\.json$/, "")}`);
    }
  }
  return routes;
}