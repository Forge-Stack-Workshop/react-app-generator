#!/usr/bin/env node
/**
 * Lint-on-edit — PostToolUse hook (file writes).
 *
 * After Claude writes/edits a .ts or .tsx file, runs the repo's ESLint
 * wrapper (tools/lint/run-eslint.mjs) against that file. Non-blocking —
 * prints results to stderr, always exits 0.
 *
 * Hook type: PostToolUse — target: Write, Edit, MultiEdit
 */

"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  let event = {};
  try {
    event = JSON.parse(raw);
  } catch {
    process.exit(0);
  }

  const toolName = event?.tool_name ?? "";
  if (!["Write", "Edit", "MultiEdit"].includes(toolName)) {
    process.exit(0);
  }

  const filePath =
    event?.tool_input?.file_path ?? event?.tool_input?.path ?? "";

  if (!filePath || !/\.(ts|tsx)$/.test(filePath)) {
    process.exit(0);
  }

  const repoRoot = path.join(__dirname, "..", "..");
  const result = spawnSync(
    "node",
    ["tools/lint/run-eslint.mjs", filePath],
    { cwd: repoRoot, encoding: "utf8" },
  );

  if (result.status !== 0) {
    process.stderr.write(
      `[lint-on-edit] ESLint findings in ${path.basename(filePath)}:\n`,
    );
    process.stderr.write(result.stdout || "");
    process.stderr.write(result.stderr || "");
  }

  process.exit(0);
});
