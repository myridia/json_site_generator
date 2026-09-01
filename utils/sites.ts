const siteModules = import.meta.glob("~/content/sites/**/site.json", { eager: true });
const docModules = import.meta.glob("~/content/sites/**/docs/**/*.json", { eager: true });

function parseSite(path: string): string | null {
  const m = path.match(/\/content\/sites\/([^/]+)\/site\.json$/);
  return m ? m[1] : null;
}

function parseTypeSlug(path: string): { site: string; type: string; slug: string } | null {
  const m = path.match(/\/content\/sites\/([^/]+)\/docs\/([^/]+)\/(.+)\.json$/);
  return m ? { site: m[1], type: m[2], slug: m[3] } : null;
}

type SiteHome = {
  hero?: { label: string; url: string }[];
  columns?: { heading?: string; paragraphs: string[] }[];
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

type SiteDoc = {
  site: string;
  type: string;
  slug: string;
  doc: Record<string, any>;
  title: string;
};

export const sites: { name: string; config: SiteConfig; docs: SiteDoc[] }[] =
  Object.entries(siteModules)
    .map(([path, mod]) => {
      const name = parseSite(path);
      if (!name) return null;
      const config = mod.default as SiteConfig;
      const docs = Object.entries(docModules)
        .map(([docPath, docMod]) => {
          const info = parseTypeSlug(docPath);
          if (!info || info.site !== name) return null;
          const doc = docMod.default as Record<string, any>;
          return { ...info, doc, title: doc.title || info.slug };
        })
        .filter(Boolean) as SiteDoc[];
      return { name, config, docs };
    })
    .filter(Boolean) as { name: string; config: SiteConfig; docs: SiteDoc[] }[];

export function getSite(name: string) {
  return sites.find((s) => s.name === name) || null;
}

export const defaultSiteName = "myridia";

export function getDefaultSite() {
  return getSite(defaultSiteName);
}

export function getSiteDoc(site: string, type: string, slug: string) {
  return getSite(site)?.docs.find((d) => d.type === type && d.slug === slug)?.doc || null;
}