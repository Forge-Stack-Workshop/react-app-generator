import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { parseYaml } from "./yaml.mjs";

export function readConfig(path) {
  if (!existsSync(path)) throw new Error(`forge.config.yaml not found at ${path}`);
  const c = parseYaml(readFileSync(path, "utf8"));
  return { project: c.project, packageManager: c.packageManager, features: c.features ?? {} };
}

export function enabledFeatureIds(config) {
  return Object.entries(config.features ?? {})
    .filter(([, v]) => v === true || (v && typeof v === "object"))
    .map(([k]) => k)
    .sort();
}

export function validateConfig(config, availableIds) {
  const unknown = enabledFeatureIds(config).filter((id) => !availableIds.includes(id));
  if (unknown.length) {
    throw new Error(
      `Unknown feature(s) in config: ${unknown.join(", ")}. Valid: ${availableIds.join(", ")}`,
    );
  }
}

export function writeConfig(path, config) {
  const lines = [`project: ${config.project}`, `packageManager: ${config.packageManager}`, "features:"];
  for (const id of Object.keys(config.features).sort()) {
    const v = config.features[id];
    if (v && typeof v === "object") {
      lines.push(`  ${id}:`);
      for (const [ok, ov] of Object.entries(v)) {
        lines.push(`    ${ok}: ${Array.isArray(ov) ? `[${ov.join(", ")}]` : ov}`);
      }
    } else {
      lines.push(`  ${id}: ${v ? "true" : "false"}`);
    }
  }
  writeFileSync(path, lines.join("\n") + "\n");
}
