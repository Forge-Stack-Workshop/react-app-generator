import { describe, expect, it } from "vitest";
import { buildAggregators } from "./aggregate.mjs";

// `contributes.*.import` is written RELATIVE TO `src/`, WITHOUT a leading
// `./` — aggregate.mjs is responsible for prefixing it correctly relative to
// each generated aggregator file's own directory.
const feat = {
  id: "auth",
  contributes: {
    routes: [{ path: "/login", import: "features/auth/LoginPage", component: "LoginPage" }],
    nav: [{ label: "Login", to: "/login" }],
    providers: [{ import: "features/auth/AuthProvider", component: "AuthProvider" }],
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

  it("prefixes feature imports relative to each aggregator's own directory", () => {
    // src/app/*.generated.tsx live one level under src/, so a `features/...`
    // import must be emitted as `../features/...` to actually resolve.
    const out = buildAggregators([feat]);
    expect(out["src/app/routes.generated.tsx"]).toContain(
      'from "../features/auth/LoginPage"',
    );
    expect(out["src/app/providers.generated.tsx"]).toContain(
      'from "../features/auth/AuthProvider"',
    );
  });

  it("prefixes http handler imports relative to src/api/http/", () => {
    // src/api/http/hooks.generated.ts lives two levels under src/, so a
    // `features/...` import must be emitted as `../../features/...`.
    const featWithHttp = {
      id: "auth",
      contributes: {
        routes: [],
        nav: [],
        providers: [],
        http: [{ responseErrorHandler: "features/auth/onUnauthorized" }],
      },
    };
    const out = buildAggregators([featWithHttp]);
    expect(out["src/api/http/hooks.generated.ts"]).toContain(
      'from "../../features/auth/onUnauthorized"',
    );
  });
  it("is inert for no features", () => {
    const out = buildAggregators([]);
    expect(out["src/app/routes.generated.tsx"]).toContain("export const featureRoutes");
  });
});
