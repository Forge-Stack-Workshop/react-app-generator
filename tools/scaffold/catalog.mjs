import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseYaml } from "./yaml.mjs";

const EMPTY_CONTRIB = { routes: [], nav: [], providers: [], http: [] };

export function loadCatalog(featuresDir) {
  if (!existsSync(featuresDir)) return [];
  return readdirSync(featuresDir)
    .filter((name) => statSync(join(featuresDir, name)).isDirectory())
    .map((name) => {
      const manifestPath = join(featuresDir, name, "feature.yaml");
      const m = existsSync(manifestPath)
        ? parseYaml(readFileSync(manifestPath, "utf8"))
        : {};
      return {
        id: m.id ?? name,
        name: m.name ?? name,
        description: m.description ?? "",
        default: m.default ?? false,
        deps: m.deps ?? [],
        devDeps: m.devDeps ?? [],
        options: m.options ?? {},
        contributes: { ...EMPTY_CONTRIB, ...(m.contributes ?? {}) },
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}
