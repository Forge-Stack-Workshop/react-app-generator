import { describe, expect, it } from "vitest";
import { buildAggregators } from "./aggregate.mjs";

const feat = {
  id: "auth",
  contributes: {
    routes: [{ path: "/login", import: "./features/auth/LoginPage", component: "LoginPage" }],
    nav: [{ label: "Login", to: "/login" }],
    providers: [{ import: "./features/auth/AuthProvider", component: "AuthProvider" }],
    http: [],
  },
};

describe("buildAggregators", () => {
  it("emits the four aggregators with a do-not-edit banner", () => {
    const out = buildAggregators([feat]);
    expect(Object.keys(out).sort()).toEqual([
      "src/api/http/hooks.generated.ts",
      "src/app/nav.generated.ts",
      "src/app/providers.generated.tsx",
      "src/app/routes.generated.tsx",
    ]);
    for (const content of Object.values(out)) {
      expect(content.startsWith("// AUTO-GENERATED")).toBe(true);
    }
    expect(out["src/app/routes.generated.tsx"]).toContain("LoginPage");
    expect(out["src/app/providers.generated.tsx"]).toContain("AuthProvider");
  });
  it("is inert for no features", () => {
    const out = buildAggregators([]);
    expect(out["src/app/routes.generated.tsx"]).toContain("export const featureRoutes");
  });
});
