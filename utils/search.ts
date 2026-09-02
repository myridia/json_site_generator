import type { Site } from "~/utils/site";
import { sites } from "~/utils/site";

type IndexedDoc = {
  site: string;
  type: string;
  slug: string;
  title: string;
  text: string;
};

const index: IndexedDoc[] = sites.flatMap((s) =>
  s.docs.map((d) => {
    const text = JSON.stringify(d.doc).replace(/\\n/g, " ");
    return {
      site: s.name,
      type: d.type,
      slug: d.slug,
      title: d.title,
      text: `${d.title} ${d.doc.summary || ""} ${text}`.toLowerCase(),
    };
  })
);

function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function searchDocs(site: Site | null, query: string, limit = 50) {
  const terms = tokenize(query);
  if (!terms.length) return [];
  const scored = index
    .filter((doc) => !site || doc.site === site.name)
    .map((doc) => {
      const hits = terms.filter((t) => doc.text.includes(t)).length;
      return { doc, hits };
    })
    .filter((r) => r.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, limit)
    .map((r) => r.doc);
  return scored;
}