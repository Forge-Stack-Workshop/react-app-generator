import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const statePath = (projectDir) => join(projectDir, ".forge", "state.json");

export function hashContent(text) {
  return createHash("sha256").update(text).digest("hex");
}

export function readState(projectDir) {
  const p = statePath(projectDir);
  if (!existsSync(p)) return { features: {} };
  return JSON.parse(readFileSync(p, "utf8"));
}

export function writeState(projectDir, state) {
  const p = statePath(projectDir);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(state, null, 2) + "\n");
}
