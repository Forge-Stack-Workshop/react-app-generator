#!/usr/bin/env node
// Runs ESLint from the isolated lint toolchain (tools/lint), whose TypeScript is
// pinned to <6.1 — a version typescript-eslint officially supports. The project
// itself builds on TypeScript 7, which typescript-eslint cannot parse yet, so
// linting against the project's own node_modules crashes at load time
// ("Cannot read properties of undefined (reading 'Cjs')"). Delegating to this
// self-contained toolchain keeps ESLint working without downgrading the build.
//
// Used by both `npm run lint` (arg: ".") and the pre-commit `eslint` hook
// (args: the staged .ts/.tsx files). Runs from the repo root so config globs and
// ignore patterns resolve exactly as they do for the root eslint.config.js.
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, "..", "..");
const eslintBin = join(here, "node_modules", "eslint", "bin", "eslint.js");
const isWindows = process.platform === "win32";

if (!existsSync(eslintBin)) {
  const npm = isWindows ? "npm.cmd" : "npm";
  const install = spawnSync(npm, ["ci", "--no-audit", "--no-fund"], {
    cwd: here,
    stdio: "inherit",
    shell: isWindows,
  });
  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }
}

const result = spawnSync(
  process.execPath,
  [
    eslintBin,
    "--config",
    join(here, "eslint.config.mjs"),
    "--no-warn-ignored",
    ...process.argv.slice(2),
  ],
  { cwd: repoRoot, stdio: "inherit" },
);

process.exit(result.status ?? 1);
