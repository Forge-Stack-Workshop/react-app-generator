import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

export function renderTokens(content, tokens) {
  const out = content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in tokens)) throw new Error(`Unknown token: {{${key}}}`);
    return tokens[key];
  });
  return out;
}

export function listFiles(dir) {
  if (!existsSync(dir)) return [];
  const walk = (d) =>
    readdirSync(d).flatMap((name) => {
      const full = join(d, name);
      return statSync(full).isDirectory() ? walk(full) : [full];
    });
  return walk(dir)
    .map((f) => relative(dir, f).split(sep).join("/"))
    .sort();
}
