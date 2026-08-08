import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { renderTokens, listFiles } from "./render.mjs";

// NB: ".json" is intentionally excluded — scaffold tokens ({{token}}) never
// appear in JSON data, and i18next locale JSON uses the same {{var}} syntax for
// runtime interpolation. JSON is copied raw to avoid that collision. See
// sync.mjs for the matching rationale.
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".scss",
  ".css",
  ".md",
  ".html",
  ".txt",
  ".yaml",
  ".yml",
]);

function isTextFile(path) {
  const dot = path.lastIndexOf(".");
  if (dot < 0) return false;
  return TEXT_EXTENSIONS.has(path.slice(dot).toLowerCase());
}

// Copies templates/base/** into a generated project, rendering {{token}}
// placeholders in text files. Never clobbers an existing file unless
// force is true — base files are a starting skeleton, not a reconciled
// feature (no ownership tracking, no deletion on re-run).
export function copyBase({ projectDir, baseDir, tokens, force = false }) {
  const written = [];
  const skipped = [];

  for (const rel of listFiles(baseDir)) {
    const srcFile = join(baseDir, rel);
    const destFile = join(projectDir, rel);

    if (existsSync(destFile) && !force) {
      skipped.push(rel);
      continue;
    }

    mkdirSync(dirname(destFile), { recursive: true });
    if (isTextFile(srcFile)) {
      const rendered = renderTokens(readFileSync(srcFile, "utf8"), tokens);
      writeFileSync(destFile, rendered);
    } else {
      cpSync(srcFile, destFile);
    }
    written.push(rel);
  }

  return { written: written.sort(), skipped: skipped.sort() };
}
