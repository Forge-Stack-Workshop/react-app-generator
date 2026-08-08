import { cpSync, mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, beforeEach } from "vitest";
import { sync } from "./sync.mjs";

function scaffoldFeature(dir, id, files, manifest = {}) {
  const base = join(dir, id, "files");
  for (const [rel, content] of Object.entries(files)) {
    const full = join(base, rel);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, content);
  }
  writeFileSync(join(dir, id, "feature.yaml"),
    `id: ${id}\nname: ${id}\n` + (manifest.yaml ?? ""));
}

let project, featuresDir;
beforeEach(() => {
  const root = mkdtempSync(join(tmpdir(), "forge-e2e-"));
  project = join(root, "app");
  featuresDir = join(root, "features");
  mkdirSync(project, { recursive: true });
  writeFileSync(join(project, "package.json"),
    JSON.stringify({ dependencies: { react: "^19.2.8" }, devDependencies: {} }, null, 2));
  mkdirSync(join(project, "src", "app"), { recursive: true });
  mkdirSync(join(project, "src", "api", "http"), { recursive: true });
  scaffoldFeature(featuresDir, "widget", { "src/features/widget/Widget.tsx": "export const Widget = () => null;\n" });
});

describe("sync add/remove", () => {
  const tokens = { projectName: "app", apiBaseUrl: "/api", timeout: "8000" };

  it("adds a feature's owned files and aggregators", () => {
    const r = sync({ projectDir: project, featuresDir,
      config: { project: "app", packageManager: "npm", features: { widget: true } }, tokens });
    expect(existsSync(join(project, "src/features/widget/Widget.tsx"))).toBe(true);
    expect(existsSync(join(project, "src/app/routes.generated.tsx"))).toBe(true);
    expect(r.added).toContain("widget");
  });

  it("removes a feature's owned files when disabled", () => {
    sync({ projectDir: project, featuresDir,
      config: { project: "app", packageManager: "npm", features: { widget: true } }, tokens });
    const r = sync({ projectDir: project, featuresDir,
      config: { project: "app", packageManager: "npm", features: { widget: false } }, tokens });
    expect(existsSync(join(project, "src/features/widget/Widget.tsx"))).toBe(false);
    expect(r.removed).toContain("widget");
  });

  it("is idempotent on repeated identical sync", () => {
    const cfg = { project: "app", packageManager: "npm", features: { widget: true } };
    sync({ projectDir: project, featuresDir, config: cfg, tokens });
    const before = readFileSync(join(project, "src/app/routes.generated.tsx"), "utf8");
    const r = sync({ projectDir: project, featuresDir, config: cfg, tokens });
    const after = readFileSync(join(project, "src/app/routes.generated.tsx"), "utf8");
    expect(after).toBe(before);
    expect(r.added).toEqual([]);
  });

  it("refuses to delete a hand-edited owned file without force", () => {
    sync({ projectDir: project, featuresDir,
      config: { project: "app", packageManager: "npm", features: { widget: true } }, tokens });
    writeFileSync(join(project, "src/features/widget/Widget.tsx"), "// edited\n");
    const r = sync({ projectDir: project, featuresDir,
      config: { project: "app", packageManager: "npm", features: { widget: false } }, tokens });
    expect(existsSync(join(project, "src/features/widget/Widget.tsx"))).toBe(true);
    expect(r.warnings.join()).toMatch(/edited/i);
  });
});
