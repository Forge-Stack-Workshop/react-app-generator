import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { hashContent, readState, writeState } from "./state.mjs";

describe("state", () => {
  it("hashes deterministically", () => {
    expect(hashContent("x")).toBe(hashContent("x"));
    expect(hashContent("x")).not.toBe(hashContent("y"));
  });
  it("round-trips and defaults empty", () => {
    const d = mkdtempSync(join(tmpdir(), "forge-"));
    expect(readState(d)).toEqual({ features: {} });
    writeState(d, { features: { auth: { files: { "a.ts": "h" }, deps: ["zod@^3"], devDeps: [] } } });
    expect(readState(d).features.auth.deps).toEqual(["zod@^3"]);
  });
});
