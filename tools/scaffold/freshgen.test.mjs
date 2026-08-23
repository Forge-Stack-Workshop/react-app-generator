import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

// Guards the WHOLE fresh-generation path: `node scaffold.mjs --out ... --features
// ...` runs the SAME shared core (freshGenCore) as the no-flag interactive path,
// so a green run here proves the interactive path emits a building project too.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

let outDir;
afterEach(() => {
  if (outDir && existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
});

describe("fresh generation core (via CLI)", () => {
  it("emits a complete, wired project skeleton", () => {
    const root = mkdtempSync(join(tmpdir(), "forge-freshgen-"));
    outDir = join(root, "demo");

    execFileSync(
      "node",
      [
        "scaffold.mjs",
        "--out",
        outDir,
        "--name",
        "demo",
        "--features",
        "i18n,theming,mock",
      ],
      { cwd: repoRoot, encoding: "utf8" },
    );

    for (const rel of [
      "index.html",
      "src/main.tsx",
      "src/App.tsx",
      "src/app/router.tsx",
      "package.json",
      "forge.config.yaml",
      "src/app/providers.generated.tsx",
    ]) {
      expect(existsSync(join(outDir, rel)), `missing ${rel}`).toBe(true);
    }
  });
});
