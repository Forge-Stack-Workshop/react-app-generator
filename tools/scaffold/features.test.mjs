import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, beforeEach } from "vitest";
import { sync } from "./sync.mjs";

// Drives the REAL feature catalog (templates/features) through sync() into a
// throwaway project, proving the i18n feature module is self-contained and
// wires itself in via its provider contribution.
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const featuresDir = join(repoRoot, "templates", "features");

const tokens = { projectName: "app", apiBaseUrl: "/api", timeout: "8000" };

let projectDir;
beforeEach(() => {
  const root = mkdtempSync(join(tmpdir(), "forge-features-"));
  projectDir = join(root, "app");
  mkdirSync(join(projectDir, "src", "app"), { recursive: true });
  mkdirSync(join(projectDir, "src", "api", "http"), { recursive: true });
  writeFileSync(
    join(projectDir, "package.json"),
    JSON.stringify({ dependencies: {}, devDependencies: {} }, null, 2),
  );
});

describe("i18n feature module", () => {
  const config = {
    project: "app",
    packageManager: "npm",
    features: { i18n: { languages: ["fr", "en"] } },
  };

  it("copies the i18n source and new provider into the project", () => {
    const r = sync({ projectDir, featuresDir, config, tokens });
    expect(r.added).toContain("i18n");
    expect(existsSync(join(projectDir, "src/i18n/index.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/i18n/locales/en/common.json"))).toBe(true);
    expect(existsSync(join(projectDir, "src/i18n/locales/fr/common.json"))).toBe(true);
    expect(existsSync(join(projectDir, "src/features/i18n/I18nProvider.tsx"))).toBe(true);
    expect(existsSync(join(projectDir, "src/hooks/useLanguage.ts"))).toBe(true);
    expect(
      existsSync(join(projectDir, "src/components/languages/LanguageSwitcher.tsx")),
    ).toBe(true);
  });

  it("adds the i18n runtime dependencies to package.json", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf8"));
    expect(pkg.dependencies.i18next).toBe("^26.3.6");
    expect(pkg.dependencies["react-i18next"]).toBe("^17.0.11");
    expect(pkg.dependencies["i18next-browser-languagedetector"]).toBe("^8.2.1");
  });

  it("copies locale JSON raw, preserving i18next {{var}} interpolation", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const en = readFileSync(
      join(projectDir, "src/i18n/locales/en/common.json"),
      "utf8",
    );
    // JSON is copied byte-for-byte, so i18next's own {{total}} interpolation
    // survives untouched — it must NOT collide with the scaffold token renderer.
    expect(en).toContain("{{total}}");
  });

  it("wires I18nProvider into the generated providers aggregator at a path that actually resolves", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const providers = readFileSync(
      join(projectDir, "src/app/providers.generated.tsx"),
      "utf8",
    );
    expect(providers).toContain("I18nProvider");
    // providers.generated.tsx lives at src/app/, so the import must climb out
    // with `../` to reach src/features/i18n/I18nProvider.tsx.
    expect(providers).toContain('from "../features/i18n/I18nProvider"');
    expect(
      existsSync(join(projectDir, "src/features/i18n/I18nProvider.tsx")),
    ).toBe(true);
  });
});

describe("theming feature module", () => {
  const config = {
    project: "app",
    packageManager: "npm",
    features: { theming: true },
  };

  it("copies the theming source and new provider into the project", () => {
    const r = sync({ projectDir, featuresDir, config, tokens });
    expect(r.added).toContain("theming");
    expect(existsSync(join(projectDir, "src/hooks/useTheme.ts"))).toBe(true);
    expect(
      existsSync(join(projectDir, "src/features/theming/ThemeProvider.tsx")),
    ).toBe(true);
    expect(
      existsSync(join(projectDir, "src/features/theming/ThemeToggle.tsx")),
    ).toBe(true);
    expect(existsSync(join(projectDir, "src/styles/_theme.scss"))).toBe(true);
  });

  it("wires ThemeProvider into the generated providers aggregator at a path that actually resolves", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const providers = readFileSync(
      join(projectDir, "src/app/providers.generated.tsx"),
      "utf8",
    );
    expect(providers).toContain("ThemeProvider");
    // providers.generated.tsx lives at src/app/, so the import must climb out
    // with `../` to reach src/features/theming/ThemeProvider.tsx.
    expect(providers).toContain('from "../features/theming/ThemeProvider"');
    expect(
      existsSync(join(projectDir, "src/features/theming/ThemeProvider.tsx")),
    ).toBe(true);
  });

  it("adds no new dependencies to package.json", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf8"));
    expect(pkg.dependencies).toEqual({});
    expect(pkg.devDependencies).toEqual({});
  });
});

describe("mock feature module", () => {
  const config = {
    project: "app",
    packageManager: "npm",
    features: { mock: true },
  };

  it("copies the MSW infrastructure and provider into the project", () => {
    const r = sync({ projectDir, featuresDir, config, tokens });
    expect(r.added).toContain("mock");
    expect(existsSync(join(projectDir, "src/api/mock/browser.ts"))).toBe(true);
    expect(
      existsSync(join(projectDir, "src/features/mock/MSWProvider.tsx")),
    ).toBe(true);
    expect(existsSync(join(projectDir, "public/mockServiceWorker.js"))).toBe(true);
  });

  it("adds the msw devDependency to package.json", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf8"));
    expect(pkg.devDependencies.msw).toBe("^2.15.0");
  });

  it("wires MSWProvider into the generated providers aggregator at a path that actually resolves", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const providers = readFileSync(
      join(projectDir, "src/app/providers.generated.tsx"),
      "utf8",
    );
    expect(providers).toContain("MSWProvider");
    // providers.generated.tsx lives at src/app/, so the import must climb out
    // with `../` to reach src/features/mock/MSWProvider.tsx.
    expect(providers).toContain('from "../features/mock/MSWProvider"');
  });

  it("token-renders the example handler's apiBaseUrl", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const handler = readFileSync(
      join(projectDir, "src/api/mock/handlers/example.handlers.ts"),
      "utf8",
    );
    expect(handler).toContain("/api/example");
  });
});

describe("auth feature module", () => {
  const config = {
    project: "app",
    packageManager: "npm",
    features: { auth: true },
  };

  it("copies the auth source files into the project", () => {
    const r = sync({ projectDir, featuresDir, config, tokens });
    expect(r.added).toContain("auth");
    expect(
      existsSync(join(projectDir, "src/features/auth/AuthProvider.tsx")),
    ).toBe(true);
    expect(existsSync(join(projectDir, "src/features/auth/useAuth.ts"))).toBe(true);
    expect(
      existsSync(join(projectDir, "src/features/auth/LoginPage.tsx")),
    ).toBe(true);
    expect(
      existsSync(join(projectDir, "src/features/auth/ProtectedRoute.tsx")),
    ).toBe(true);
    expect(
      existsSync(join(projectDir, "src/features/auth/onUnauthorized.ts")),
    ).toBe(true);
  });

  it("wires the LoginPage route into the routes aggregator at a resolving path", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const routes = readFileSync(
      join(projectDir, "src/app/routes.generated.tsx"),
      "utf8",
    );
    expect(routes).toContain("LoginPage");
    // routes.generated.tsx lives at src/app/, so the import must climb out with
    // `../` to reach src/features/auth/LoginPage.tsx.
    expect(routes).toContain('from "../features/auth/LoginPage"');
  });

  it("wires AuthProvider into the providers aggregator at a resolving path", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const providers = readFileSync(
      join(projectDir, "src/app/providers.generated.tsx"),
      "utf8",
    );
    expect(providers).toContain("AuthProvider");
    expect(providers).toContain('from "../features/auth/AuthProvider"');
  });

  it("wires onUnauthorized into the http hooks aggregator", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const hooks = readFileSync(
      join(projectDir, "src/api/http/hooks.generated.ts"),
      "utf8",
    );
    // hooks.generated.ts lives at src/api/http/, so the import must climb out
    // with `../../` to reach src/features/auth/onUnauthorized.ts.
    expect(hooks).toContain('from "../../features/auth/onUnauthorized"');
    expect(hooks).toContain("onUnauthorized");
    expect(hooks).toContain("responseErrorHandlers = [h0]");
  });

  it("adds no new dependencies to package.json", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf8"));
    expect(pkg.dependencies).toEqual({});
    expect(pkg.devDependencies).toEqual({});
  });
});

describe("dataTable feature module", () => {
  const config = {
    project: "app",
    packageManager: "npm",
    features: { dataTable: true },
  };

  it("copies the DataTable component source into the project", () => {
    const r = sync({ projectDir, featuresDir, config, tokens });
    expect(r.added).toContain("dataTable");
    expect(
      existsSync(join(projectDir, "src/components/table/DataTable.tsx")),
    ).toBe(true);
    expect(
      existsSync(join(projectDir, "src/components/table/useTableState.ts")),
    ).toBe(true);
    expect(
      existsSync(join(projectDir, "src/components/table/DataTable.module.scss")),
    ).toBe(true);
  });

  it("adds no new dependencies to package.json", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf8"));
    expect(pkg.dependencies).toEqual({});
    expect(pkg.devDependencies).toEqual({});
  });

  it("is inert for the generated aggregators (contributes is empty)", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const routes = readFileSync(
      join(projectDir, "src/app/routes.generated.tsx"),
      "utf8",
    );
    const providers = readFileSync(
      join(projectDir, "src/app/providers.generated.tsx"),
      "utf8",
    );
    expect(routes).not.toContain("dataTable");
    expect(routes).not.toContain("DataTable");
    expect(providers).not.toContain("dataTable");
    expect(providers).not.toContain("DataTable");
  });
});

describe("notifications feature module", () => {
  const config = {
    project: "app",
    packageManager: "npm",
    features: { notifications: true },
  };

  it("copies the notifications source and error pages into the project", () => {
    const r = sync({ projectDir, featuresDir, config, tokens });
    expect(r.added).toContain("notifications");
    expect(
      existsSync(join(projectDir, "src/features/notifications/ErrorBoundary.tsx")),
    ).toBe(true);
    expect(
      existsSync(join(projectDir, "src/features/notifications/ToastProvider.tsx")),
    ).toBe(true);
    expect(
      existsSync(join(projectDir, "src/features/notifications/useToast.ts")),
    ).toBe(true);
    expect(existsSync(join(projectDir, "src/pages/Forbidden.tsx"))).toBe(true);
    expect(existsSync(join(projectDir, "src/pages/ServerError.tsx"))).toBe(true);
  });

  it("wires ErrorBoundary and ToastProvider into the providers aggregator, ErrorBoundary outermost", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const providers = readFileSync(
      join(projectDir, "src/app/providers.generated.tsx"),
      "utf8",
    );
    expect(providers).toContain("ErrorBoundary");
    expect(providers).toContain("ToastProvider");
    expect(providers).toContain('from "../features/notifications/ErrorBoundary"');
    expect(providers).toContain('from "../features/notifications/ToastProvider"');
    // ErrorBoundary must nest OUTSIDE ToastProvider: its opening tag comes
    // first in the generated JSX so it catches errors thrown by ToastProvider
    // and the rest of the app.
    const errorBoundaryOpenIdx = providers.indexOf("<ErrorBoundary");
    const toastProviderOpenIdx = providers.indexOf("<ToastProvider");
    expect(errorBoundaryOpenIdx).toBeGreaterThan(-1);
    expect(toastProviderOpenIdx).toBeGreaterThan(-1);
    expect(errorBoundaryOpenIdx).toBeLessThan(toastProviderOpenIdx);
  });

  it("wires Forbidden and ServerError routes into the routes aggregator at resolving paths", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const routes = readFileSync(
      join(projectDir, "src/app/routes.generated.tsx"),
      "utf8",
    );
    expect(routes).toContain("Forbidden");
    expect(routes).toContain("ServerError");
    expect(routes).toContain('from "../pages/Forbidden"');
    expect(routes).toContain('from "../pages/ServerError"');
  });

  it("adds no new dependencies to package.json", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const pkg = JSON.parse(
      readFileSync(join(projectDir, "package.json"), "utf8"),
    );
    expect(pkg.dependencies).toEqual({});
    expect(pkg.devDependencies).toEqual({});
  });
});

describe("forms feature module", () => {
  const config = {
    project: "app",
    packageManager: "npm",
    features: { forms: true },
  };

  it("copies the react-hook-form + zod source into the project", () => {
    const r = sync({ projectDir, featuresDir, config, tokens });
    expect(r.added).toContain("forms");
    expect(existsSync(join(projectDir, "src/components/form/Form.tsx"))).toBe(
      true,
    );
    expect(existsSync(join(projectDir, "src/components/form/Field.tsx"))).toBe(
      true,
    );
    expect(
      existsSync(join(projectDir, "src/components/form/useZodForm.ts")),
    ).toBe(true);
  });

  it("adds the react-hook-form, zod and @hookform/resolvers dependencies to package.json", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const pkg = JSON.parse(
      readFileSync(join(projectDir, "package.json"), "utf8"),
    );
    expect(pkg.dependencies["react-hook-form"]).toBe("^7.53.0");
    expect(pkg.dependencies.zod).toBe("^3.23.8");
    expect(pkg.dependencies["@hookform/resolvers"]).toBe("^3.9.0");
  });

  it("is inert for the generated aggregators (contributes is empty)", () => {
    sync({ projectDir, featuresDir, config, tokens });
    const routes = readFileSync(
      join(projectDir, "src/app/routes.generated.tsx"),
      "utf8",
    );
    const providers = readFileSync(
      join(projectDir, "src/app/providers.generated.tsx"),
      "utf8",
    );
    expect(routes).not.toContain("Form");
    expect(routes).not.toContain("Field");
    expect(providers).not.toContain("Form");
    expect(providers).not.toContain("Field");
  });
});
