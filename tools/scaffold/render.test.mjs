import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { renderTokens, listFiles } from "./render.mjs";

describe("renderTokens", () => {
  it("substitutes known tokens", () => {
    expect(renderTokens("hi {{projectName}}", { projectName: "app" })).toBe("hi app");
  });
  it("throws on an unresolved token", () => {
    expect(() => renderTokens("{{nope}}", {})).toThrow(/Unknown token: \{\{nope\}\}/);
  });
});

describe("listFiles", () => {
  it("returns sorted recursive relative paths", () => {
    const d = mkdtempSync(join(tmpdir(), "forge-"));
    mkdirSync(join(d, "a"));
    writeFileSync(join(d, "a", "b.ts"), "x");
    writeFileSync(join(d, "top.ts"), "y");
    expect(listFiles(d)).toEqual(["a/b.ts", "top.ts"]);
  });
  it("returns [] for a missing dir", () => {
    expect(listFiles(join(tmpdir(), "does-not-exist-forge"))).toEqual([]);
  });
});
