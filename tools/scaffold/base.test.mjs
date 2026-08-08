import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
const BASE = join(import.meta.dirname, "..", "..", "templates", "base");
describe("templates/base", () => {
  it("ships the hand-written skeleton", () => {
    for (const f of ["index.html", "src/main.tsx", "src/App.tsx", "src/app/router.tsx"]) {
      expect(existsSync(join(BASE, f))).toBe(true);
    }
  });
});
