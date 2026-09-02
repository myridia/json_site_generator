import type { Component } from "vue";
import SiteLanding from "~/components/SiteLanding.vue";
import FallbackDoc from "~/components/FallbackDoc.vue";
import Thread from "~/components/Thread.vue";
import Post from "~/components/Post.vue";

type SiteHome = {
  hero?: { label: string; url: string }[];
  columns?: { heading?: string; paragraphs: string[] }[];
  repos?: { name: string; url: string; logo?: string }[];
};

type SiteConfig = {
  title: string;
  tagline?: string;
  slogan?: string;
  logo?: string;
  nav: { label: string; url: string }[];
  footer: string;
  home?: SiteHome;
};

const siteConfigs = import.meta.glob("~/content/*/site.json", { eager: true }) as Record<string, any>;
const docModules = import.meta.glob("~/content/*/docs/**/*.json", { eager: true }) as Record<string, any>;
export const siteLayouts = import.meta.glob("~/content/*/layout.vue", { eager: true }) as Record<string, any>;
export const siteComponents = import.meta.glob("~/content/*/components/*.vue", { eager: true }) as Record<string, any>;

function siteFromPath(path: string): string | null {
  const m = path.match(/\/content\/([^/]+)\//);
  return m ? m[1] : null;
}

export type SiteDoc = {
  type: string;
  slug: string;
  title: string;
  doc: Record<string, any>;
};

export type Site = {
  name: string;
  config: SiteConfig;
  docs: SiteDoc[];
};

export const sites: Site[] = Object.keys(siteConfigs)
  .map((path) => {
    const name = siteFromPath(path);
    if (!name) return null;
    const docs: SiteDoc[] = Object.keys(docModules)
      .filter((p) => siteFromPath(p) === name)
      .map((p) => {
        const m = p.match(/\/content\/[^/]+\/docs\/([^/]+)\/(.+)\.json$/);
        if (!m) return null;
        const [, type, slug] = m;
        const doc = (docModules[p]?.default ?? docModules[p]) as Record<string, any>;
        return { type, slug, title: doc?.title || slug, doc };
      })
      .filter((d): d is SiteDoc => Boolean(d));
    return { name, config: siteConfigs[path]?.default, docs };
  })
  .filter((s): s is Site => Boolean(s));

export function getSite(name: string | null | undefined): Site | null {
  return sites.find((s) => s.name === name) ?? null;
}

export function getSiteDoc(site: Site, type: string, slug: string): Record<string, any> | null {
  return site.docs.find((d) => d.type === type && d.slug === slug)?.doc ?? null;
}

export function useActiveSite() {
  const config = useRuntimeConfig();
  return computed<Site | null>(() => {
    const name = (config.public as Record<string, string | undefined>)?.site || "";
    return getSite(name);
  });
}

const engineComponents: Record<string, Component> = {
  SiteLanding,
  FallbackDoc,
  Thread,
  Post,
};

export function useSiteComponent(name: string) {
  const activeSite = useActiveSite();
  return computed<Component | null>(() => {
    const site = activeSite.value;
    if (site) {
      const override = siteComponents[`/content/${site.name}/components/${name}.vue`];
      if (override?.default) return override.default as Component;
    }
    return engineComponents[name] ?? null;
  });
}