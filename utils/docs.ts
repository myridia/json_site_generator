const modules = import.meta.glob("~/content/docs/**/*.json", { eager: true });

function parseTypeSlug(path) {
  const m = path.match(/\/content\/docs\/([^/]+)\/(.+)\.json$/);
  return m ? { type: m[1], slug: m[2] } : null;
}

export const allDocs = Object.entries(modules)
  .map(([path, mod]) => {
    const info = parseTypeSlug(path);
    if (!info) return null;
    const doc = mod.default;
    return { ...info, doc, title: doc.title || info.slug };
  })
  .filter(Boolean);

export function getDoc(type, slug) {
  return allDocs.find((d) => d.type === type && d.slug === slug)?.doc || null;
}
