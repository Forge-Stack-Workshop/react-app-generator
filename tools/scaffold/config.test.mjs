import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { writeConfig, readConfig, enabledFeatureIds, validateConfig } from "./config.mjs";

const cfg = {
  project: "app",
  packageManager: "pnpm",
  features: { theming: true, mock: false, i18n: { languages: ["fr", "en"] } },
};

describe("config round-trip", () => {
  it("writes then reads back equivalently", () => {
    const p = join(mkdtempSync(join(tmpdir(), "forge-")), "forge.config.yaml");
    writeConfig(p, cfg);
    const back = readConfig(p);
    expect(back.project).toBe("app");
    expect(enabledFeatureIds(back)).toEqual(["i18n", "theming"]);
    expect(back.features.i18n.languages).toEqual(["fr", "en"]);
  });
  it("readConfig throws when missing", () => {
    expect(() => readConfig("/no/such/forge.config.yaml")).toThrow(/not found/);
  });
});

describe("validateConfig", () => {
  it("throws on an unknown enabled feature", () => {
    expect(() => validateConfig(cfg, ["theming"])).toThrow(/Unknown feature/);
  });
  it("passes when all enabled ids are known", () => {
    expect(() => validateConfig(cfg, ["theming", "i18n", "mock"])).not.toThrow();
  });
});
