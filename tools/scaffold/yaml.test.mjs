import { describe, expect, it } from "vitest";
import { parseYaml } from "./yaml.mjs";

describe("parseYaml", () => {
  it("parses nested maps, lists, and scalars used by template.yaml", () => {
    const out = parseYaml(
      ["meta:", "  name: forge", "  version: 1.0.0",
       "features:", "  - id: i18n", "    default: true"].join("\n"),
    );
    expect(out.meta.name).toBe("forge");
    expect(out.features[0]).toEqual({ id: "i18n", default: true });
  });

  it("parses inline lists", () => {
    expect(parseYaml("k: [fr, en]").k).toEqual(["fr", "en"]);
    expect(parseYaml("k: []").k).toEqual([]);
  });
});
