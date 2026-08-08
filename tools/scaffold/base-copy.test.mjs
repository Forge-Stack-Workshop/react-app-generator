import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  existsSync,
  readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, beforeEach } from "vitest";
import { copyBase } from "./base.mjs";

let root, projectDir, baseDir;

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), "forge-base-copy-"));
  projectDir = join(root, "app");
  baseDir = join(root, "base");
  mkdirSync(projectDir, { recursive: true });
  mkdirSync(join(baseDir, "src"), { recursive: true });
  writeFileSync(
    join(baseDir, "index.html"),
    "<title>{{projectName}}</title>\n",
  );
  writeFileSync(join(baseDir, "src", "main.tsx"), "// {{projectName}}\n");
});

const tokens = { projectName: "app", apiBaseUrl: "/api", timeout: "8000" };

describe("copyBase", () => {
  it("copies and renders base files into the project", () => {
    const result = copyBase({ projectDir, baseDir, tokens });

    expect(readFileSync(join(projectDir, "index.html"), "utf8")).toBe(
      "<title>app</title>\n",
    );
    expect(readFileSync(join(projectDir, "src", "main.tsx"), "utf8")).toBe(
      "// app\n",
    );
    expect(result.written).toContain("index.html");
    expect(result.written).toContain("src/main.tsx");
  });

  it("skips existing files unless force is true", () => {
    writeFileSync(join(projectDir, "index.html"), "<title>CUSTOM</title>\n");

    const skipResult = copyBase({ projectDir, baseDir, tokens });
    expect(readFileSync(join(projectDir, "index.html"), "utf8")).toBe(
      "<title>CUSTOM</title>\n",
    );
    expect(skipResult.skipped).toContain("index.html");
    expect(skipResult.written).not.toContain("index.html");

    const forceResult = copyBase({
      projectDir,
      baseDir,
      tokens,
      force: true,
    });
    expect(readFileSync(join(projectDir, "index.html"), "utf8")).toBe(
      "<title>app</title>\n",
    );
    expect(forceResult.written).toContain("index.html");
    expect(forceResult.skipped).not.toContain("index.html");
  });

  it("throws when a base file contains an unknown token", () => {
    writeFileSync(join(baseDir, "src", "main.tsx"), "// {{nope}}\n");
    expect(() => copyBase({ projectDir, baseDir, tokens })).toThrow();
  });
});
