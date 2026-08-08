import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
describe("scaffold CLI", () => {
  it("prints usage/help without throwing", () => {
    const out = execFileSync("node", ["scaffold.mjs", "--help"], { encoding: "utf8" });
    expect(out).toMatch(/--sync/);
  });
});
