import rawSite from "~/content/site.json";

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

export const site: SiteConfig = rawSite as SiteConfig;

const docModules = import.meta.glob("~/content/docs/**/*.json", { eager: true });

function parseTypeSlug(path: string): { type: string; slug: string } | null {
  const m = path.match(/\/content\/docs\/([^/]+)\/(.+)\.json$/);
  return m ? { type: m[1], slug: m[2] } : null;
}

export type SiteDoc = {
  type: string;
  slug: string;
  doc: Record<string, any>;
  title: string;
};

export const docs: SiteDoc[] = Object.entries(docModules)
  .map(([path, mod]) => {
    const info = parseTypeSlug(path);
    if (!info) return null;
    const doc = mod.default as Record<string, any>;
    return { ...info, doc, title: doc.title || info.slug };
  })
  .filter(Boolean) as SiteDoc[];

export function getDoc(type: string, slug: string) {
  return docs.find((d) => d.type === type && d.slug === slug)?.doc || null;
}