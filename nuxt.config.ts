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

  nitro: {
    prerender: {
      routes: ["/", ...buildDocRoutes()],
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

function buildDocRoutes() {
  const src = fileURLToPath(new URL("./content/docs/", import.meta.url));
  if (!existsSync(src)) return [];
  const routes = [];
  for (const type of readdirSync(src)) {
    const typeDir = join(src, type);
    if (!statSync(typeDir).isDirectory()) continue;
    for (const file of readdirSync(typeDir)) {
      if (!file.endsWith(".json")) continue;
      const slug = file.replace(/\.json$/, "");
      routes.push(`/docs/${type}/${slug}`);
    }
  }
  return routes;
}
