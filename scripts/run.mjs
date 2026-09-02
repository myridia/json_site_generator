#!/usr/bin/env node
import { spawn } from "node:child_process";

const cmd = process.argv[2];
const site = process.argv[3] || "";

const child = spawn("nuxt", [cmd], {
  stdio: "inherit",
  env: { ...process.env, NUXT_PUBLIC_SITE: site },
});

child.on("exit", (code) => process.exit(code ?? 1));