import { createIndex, close } from "pagefind";
import { readdirSync, readFileSync, existsSync, statSync, cpSync, rmSync } from "node:fs";
import { join } from "node:path";

const SITE = (process.env.NUXT_PUBLIC_SITE || "").trim();

function activeSiteName() {
  if (SITE) return SITE;
  const dirs = readdirSync("content", { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("."))
    .map((d) => d.name);
  if (dirs.length === 1) return dirs[0];
  console.error("[pagefind] specify site: NUXT_PUBLIC_SITE=<name> (or lone folder under content/)");
  return "";
}

function paragraphs(doc) {
  const out = [];
  const push = (v) => {
    if (typeof v === "string" && v.trim()) out.push(v.trim());
  };
  push(doc.summary);
  if (Array.isArray(doc.tags)) for (const t of doc.tags) push(t);
  if (doc.content) push(doc.content);
  if (Array.isArray(doc.body)) {
    for (const block of doc.body) {
      push(block?.heading);
      if (Array.isArray(block?.paragraphs)) for (const p of block.paragraphs) push(p);
    }
  }
  const walkReplies = (replies) => {
    if (!Array.isArray(replies)) return;
    for (const r of replies) {
      push(r?.content);
      if (Array.isArray(r?.replies)) walkReplies(r.replies);
    }
  };
  walkReplies(doc.replies);
  return out;
}

function docContentText(doc) {
  return [
    ...(doc.title ? [doc.title] : []),
    ...paragraphs(doc),
  ]
    .filter(Boolean)
    .join("\n");
}

function listDocs(site) {
  const root = join("content", site, "docs");
  if (!existsSync(root)) return [];
  const docs = [];
  for (const type of readdirSync(root)) {
    const typeDir = join(root, type);
    if (!statSync(typeDir).isDirectory()) continue;
    for (const file of readdirSync(typeDir)) {
      if (!file.endsWith(".json")) continue;
      const slug = file.replace(/\.json$/, "");
      const raw = readFileSync(join(typeDir, file), "utf8");
      let doc;
      try {
        doc = JSON.parse(raw);
      } catch {
        console.error(`[pagefind] skip unparseable ${type}/${slug}`);
        continue;
      }
      docs.push({ type, slug, doc });
    }
  }
  return docs;
}

function metaFor(doc, type) {
  const meta = {
    title: doc.title || doc._id || "",
    type: type,
  };
  if (Array.isArray(doc.tags) && doc.tags.length) meta.tags = doc.tags.join(", ");
  if (doc.created_at) meta.created_at = doc.created_at;
  return meta;
}

async function main() {
  const site = activeSiteName();
  if (!site) process.exit(1);

  const docs = listDocs(site);
  if (!docs.length) {
    console.error(`[pagefind] no docs under content/${site}/docs/`);
    process.exit(1);
  }

  const { index } = await createIndex({
    forceLanguage: "en",
    includeCharacters: "._-",
    writePlayground: false,
  });
  if (!index) {
    console.error("[pagefind] could not create index");
    process.exit(1);
  }

  for (const { type, slug, doc } of docs) {
    const url = `/docs/${type}/${slug}`;
    const res = await index.addCustomRecord({
      url,
      content: docContentText(doc),
      language: "en",
      meta: metaFor(doc, type),
      sort: doc.created_at ? { created_at: doc.created_at } : undefined,
      filters: {
        type: [type],
        ...(Array.isArray(doc.tags) && doc.tags.length ? { tags: doc.tags } : {}),
      },
    });
    for (const e of res.errors) console.error(`[pagefind] ${url}: ${e}`);
  }

  const out = await index.writeFiles({ outputPath: "public/pagefind" });
  for (const e of out.errors) console.error(`[pagefind] write: ${e}`);
  await index.deleteIndex();
  await close();

  const outputDir = join(".output", "public", "pagefind");
  if (existsSync(join(".output", "public"))) {
    rmSync(outputDir, { recursive: true, force: true });
    cpSync("public/pagefind", outputDir, { recursive: true });
    console.log(`[pagefind] mirrored index -> ${outputDir}`);
  }

  console.log(`[pagefind] indexed ${docs.length} doc(s) for "${site}" -> public/pagefind/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
