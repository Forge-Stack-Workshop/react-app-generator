import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadCatalog } from "./catalog.mjs";

const FIXTURES = join(import.meta.dirname, "__fixtures__", "features");

describe("loadCatalog", () => {
  it("loads a feature manifest with contributes defaults", () => {
    const [f] = loadCatalog(FIXTURES);
    expect(f.id).toBe("demo");
    expect(f.deps).toEqual(["zod@^3.23.8"]);
    expect(f.contributes.routes).toHaveLength(1);
    expect(f.contributes.nav).toEqual([]);
  });
});
