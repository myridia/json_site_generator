import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

const COUCHDB_URL = process.env.COUCHDB_URL || "http://127.0.0.1:5984";

function parseArgs() {
  const args = process.argv.slice(2);
  const read = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 && args[i + 1] ? args[i + 1] : undefined;
  };
  return {
    db: read("-d") || args[0],
    user: read("-u"),
    pass: read("-p"),
    type: read("-t") || "doc",
  };
}

function dbName(user) {
  const hex = [...user].map((c) => c.charCodeAt(0).toString(16).padStart(2, "0")).join("");
  return `userdb-${hex}`;
}

function authHeader(user, pass) {
  if (!user) return {};
  return { Authorization: "Basic " + Buffer.from(`${user}:${pass}`).toString("base64") };
}

async function main() {
  const opts = parseArgs();
  const db = opts.db || (opts.user ? dbName(opts.user) : undefined);
  if (!db) {
    console.error("Provide a database: -d <db> (or -u <user> for userdb)");
    process.exit(1);
  }
  if (!opts.user) console.warn("No -u user given; this DB may require auth.");

  const headers = authHeader(opts.user, opts.pass);
  const resp = await fetch(`${COUCHDB_URL}/${db}/_all_docs?include_docs=true`, { headers });
  if (!resp.ok) {
    console.error(`Fetch failed (${resp.status}) for ${db}: ${resp.statusText}`);
    process.exit(2);
  }

  const body = await resp.json();
  const OUT = new URL("../content/docs/", import.meta.url);
  let n = 0;
  for (const row of body.rows || []) {
    const doc = row.doc;
    if (!doc || doc._id.startsWith("_")) continue;
    const type = doc.type || opts.type;
    const slug = (doc._id).replace(/^.*:/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
    const file = join(OUT.pathname, type, `${slug}.json`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, JSON.stringify(doc, null, 2) + "\n", "utf8");
    n++;
  }
  console.log(`Pulled ${n} doc(s) from ${db} -> content/docs/`);
}

main();