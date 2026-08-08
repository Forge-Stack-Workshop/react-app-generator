import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, beforeEach } from "vitest";
import { sync } from "./sync.mjs";

// Drives the REAL feature catalog (templates/features) through sync() into a
// throwaway project, proving the i18n feature module is self-contained and
// wires itself in via its provider contribution.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const featuresDir = join(repoRoot, "templates", "features");

const tokens = { projectName: "app", apiBaseUrl: "/api", timeout: "8000" };

let projectDir;
beforeEach(() => {
  const root = mkdtempSync(join(tmpdir(), "forge-features-"));
  projectDir = join(root, "app");
  mkdirSync(join(projectDir, "src", "app"), { recursive: true });
  mkdirSync(join(projectDir, "src", "api", "http"), { recursive: true });
  writeFileSync(
    join(projectDir, "package.json"),
    JSON.stringify({ dependencies: {}, devDependencies: {} }, null, 2),
  );
});

describe("i18n feature module", () => {
  const config = {
    project: "app",
    packageManager: "npm",
    features: { i18n: { languages: ["fr", "en"] } },
  };

  it("copies the i18n source and new provider into the project", () => {
    const r = sync({ projectDir, featuresDir, config, tokens });
    expect(r.added).toContain("i18n");
    expect(existsSync(join(projectDir, "src/i18n/index.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/i18n/locales/en/common.json"))).toBe(true);
    expect(existsSync(join(projectDir, "src/i18n/locales/fr/common.json"))).toBe(true);
    expect(existsSync(join(projectDir, "src/features/i18n/I18nProvider.tsx"))).toBe(true);
    expect(existsSync(join(projectDir, "src/hooks/useLanguage.ts"))).toBe(true);
    expect(
      existsSync(join(projectDir, "src/components/languages/LanguageSwitcher.tsx")),
    ).toBe(true);
  });

  it("adds the i18n runtime dependencies to package.json", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf8"));
    expect(pkg.dependencies.i18next).toBe("^26.3.6");
    expect(pkg.dependencies["react-i18next"]).toBe("^17.0.11");
    expect(pkg.dependencies["i18next-browser-languagedetector"]).toBe("^8.2.1");
  });

  it("copies locale JSON raw, preserving i18next {{var}} interpolation", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const en = readFileSync(
      join(projectDir, "src/i18n/locales/en/common.json"),
      "utf8",
    );
    // JSON is copied byte-for-byte, so i18next's own {{total}} interpolation
    // survives untouched — it must NOT collide with the scaffold token renderer.
    expect(en).toContain("{{total}}");
  });

  it("wires I18nProvider into the generated providers aggregator", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const providers = readFileSync(
      join(projectDir, "src/app/providers.generated.tsx"),
      "utf8",
    );
    expect(providers).toContain("I18nProvider");
    expect(providers).toContain("./features/i18n/I18nProvider");
  });
});
