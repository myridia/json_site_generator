#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readdirSync } from "node:fs";

const cmd = process.argv[2];
const arg = process.argv[3] || "";

const folders = readdirSync("content", { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith("."))
  .map((e) => e.name);

let site = "";
if (folders.length === 0) {
  console.error("ERROR: no site folder found under content/.");
  console.error('Create one, e.g. content/myridia/ with site.json, layout.vue and docs/.');
  process.exit(1);
} else if (folders.length === 1) {
  site = folders[0];
  console.log(`Single site folder: ${site}`);
} else {
  if (!arg) {
    console.error("ERROR: multiple site folders found. Pass one:");
    for (const f of folders) console.error(`  npm run ${cmd} ${f}`);
    process.exit(1);
  }
  if (!folders.includes(arg)) {
    console.error(`ERROR: no site folder named "${arg}". Available:`);
    for (const f of folders) console.error(`  ${f}`);
    process.exit(1);
  }
  site = arg;
}

console.log(`Building site: ${site}`);
const child = spawn("nuxt", [cmd], {
  stdio: "inherit",
  env: { ...process.env, NUXT_PUBLIC_SITE: site },
});
child.on("exit", (code) => process.exit(code ?? 1));