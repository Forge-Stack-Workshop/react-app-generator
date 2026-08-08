import { describe, expect, it } from "vitest";
import { reconcileDeps } from "./deps.mjs";

const base = { dependencies: { react: "^19.2.8" }, devDependencies: {} };

describe("reconcileDeps", () => {
  it("adds enabled feature deps", () => {
    const out = reconcileDeps(structuredClone(base),
      [{ id: "forms", deps: ["zod@^3.23.8"], devDeps: [] }], { features: {} });
    expect(out.dependencies.zod).toBe("^3.23.8");
    expect(out.dependencies.react).toBe("^19.2.8");
  });
  it("removes a dep owned only by a now-disabled feature", () => {
    const prev = { features: { forms: { deps: ["zod@^3.23.8"], devDeps: [], files: {} } } };
    const pkg = { dependencies: { react: "^19.2.8", zod: "^3.23.8" }, devDependencies: {} };
    const out = reconcileDeps(pkg, [], prev);
    expect(out.dependencies.zod).toBeUndefined();
    expect(out.dependencies.react).toBe("^19.2.8");
  });
  it("keeps a dep still required by another enabled feature", () => {
    const prev = { features: { forms: { deps: ["zod@^3.23.8"], devDeps: [], files: {} } } };
    const pkg = { dependencies: { zod: "^3.23.8" }, devDependencies: {} };
    const out = reconcileDeps(pkg, [{ id: "auth", deps: ["zod@^3.23.8"], devDeps: [] }], prev);
    expect(out.dependencies.zod).toBe("^3.23.8");
  });
});
