import { describe, expect, it } from "vitest";

import { clamp, formatNumber } from "./formatters";

describe("formatNumber", () => {
  it("adds thousands separators (en-US)", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });

  it("respects the given locale (fr-FR groups thousands, no comma)", () => {
    const out = formatNumber(1234, "fr-FR");
    expect(out).not.toContain(",");
    expect(out.replace(/\D/g, "")).toBe("1234");
  });
});

describe("clamp", () => {
  it("returns the value when inside the range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it("clamps below min and above max", () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
});
