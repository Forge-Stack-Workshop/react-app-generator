#!/usr/bin/env node
// scaffold.mjs — Forge-Stack React Template scaffolder
// Usage: node scaffold.mjs
// Reads template.yaml, prompts interactively, generates the project.

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  cpSync,
} from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

// ── YAML parser (no external deps) ──────────────────────────────────────────
// Minimal subset parser: handles the structure used in template.yaml.
// For complex YAML (anchors, multiline, etc.) install js-yaml instead.
function parseYaml(text) {
  const lines = text.split("\n");
  const root = {};
  const stack = [{ indent: -1, obj: root }];

  for (let raw of lines) {
    const line = raw.replace(/\s*#.*$/, ""); // strip inline comments
    if (!line.trim()) continue;

    const indent = line.search(/\S/);
    const content = line.trim();

    // Pop stack to current indent level
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    const parent = stack[stack.length - 1].obj;

    if (content.startsWith("- ")) {
      // List item
      const value = content.slice(2).trim();
      const key = stack[stack.length - 1].listKey;
      if (key && Array.isArray(parent[key])) {
        // Nested object item (key: value in list)
        if (value.includes(": ")) {
          const [k, v] = value.split(/:\s+/, 2);
          const item = {};
          parent[key].push(item);
          stack.push({ indent, obj: item });
          item[k.trim()] = parseValue(v.trim());
        } else {
          parent[key].push(parseValue(value));
        }
      } else {
        // Bare list under a key
        const listParent = stack[stack.length - 2]?.obj ?? root;
        const lk = stack[stack.length - 1].listKey;
        if (lk) {
          if (!Array.isArray(listParent[lk])) listParent[lk] = [];
          if (value.includes(": ")) {
            const [k, v] = value.split(/:\s+/, 2);
            const item = {};
            listParent[lk].push(item);
            stack.push({ indent, obj: item });
            item[k.trim()] = parseValue(v.trim());
          } else {
            listParent[lk].push(parseValue(value));
          }
        }
      }
      continue;
    }

    if (content.includes(":")) {
      const colonIdx = content.indexOf(":");
      const key = content.slice(0, colonIdx).trim();
      const rest = content.slice(colonIdx + 1).trim();

      if (rest === "" || rest === "|" || rest === ">") {
        // Object or block — prepare container
        const child = {};
        if (Array.isArray(parent)) {
          parent.push(child);
        } else {
          parent[key] = child;
        }
        stack.push({ indent, obj: child, listKey: key });
      } else if (rest === "[]") {
        parent[key] = [];
        stack.push({ indent, obj: parent, listKey: key });
      } else {
        parent[key] = parseValue(rest);
        stack.push({ indent, obj: parent, listKey: key });
      }
    }
  }

  return root;
}

function parseValue(v) {
  if (v === "true") return true;
  if (v === "false") return false;
  if (v === "null" || v === "~") return null;
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v);
  return v.replace(/^["']|["']$/g, "");
}

// ── Colours ──────────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

const bold = (s) => `${c.bold}${s}${c.reset}`;
const dim = (s) => `${c.dim}${s}${c.reset}`;
const cyan = (s) => `${c.cyan}${s}${c.reset}`;
const green = (s) => `${c.green}${s}${c.reset}`;
const yellow = (s) => `${c.yellow}${s}${c.reset}`;
const red = (s) => `${c.red}${s}${c.reset}`;
const blue = (s) => `${c.blue}${s}${c.reset}`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));

function mkdir(p) {
  if (!existsSync(p)) mkdirSync(p, { recursive: true });
}

function write(p, content) {
  mkdir(dirname(p));
  writeFileSync(p, content, "utf8");
}

function ask(rl, question) {
  return rl.question(`  ${cyan("?")} ${bold(question)} `);
}

async function confirm(rl, question, defaultVal = true) {
  const hint = defaultVal ? dim("[Y/n]") : dim("[y/N]");
  const ans = await ask(rl, `${question} ${hint}: `);
  if (!ans.trim()) return defaultVal;
  return ans.trim().toLowerCase().startsWith("y");
}

async function select(rl, question, choices) {
  console.log(`\n  ${cyan("?")} ${bold(question)}`);
  choices.forEach((c, i) =>
    console.log(`  ${dim(`${i + 1}.`)} ${c.label ?? c}`),
  );
  const ans = await ask(rl, `Enter number (default 1): `);
  const idx = parseInt(ans.trim(), 10);
  if (isNaN(idx) || idx < 1 || idx > choices.length) return choices[0];
  return choices[idx - 1];
}

async function multiSelect(rl, question, choices) {
  console.log(
    `\n  ${cyan("?")} ${bold(question)} ${dim("(comma-separated numbers, Enter = all defaults)")}`,
  );
  choices.forEach((c, i) => {
    const def = c.default !== false ? green("✓") : dim("○");
    console.log(
      `  ${def} ${dim(`${i + 1}.`)} ${bold(c.name ?? c.id)} ${dim("—")} ${c.description ?? ""}`,
    );
  });
  const ans = await ask(rl, `Selection: `);
  if (!ans.trim()) return choices.filter((c) => c.default !== false);
  return ans
    .split(",")
    .map((s) => parseInt(s.trim(), 10) - 1)
    .filter((i) => i >= 0 && i < choices.length)
    .map((i) => choices[i]);
}

// ── Banner ────────────────────────────────────────────────────────────────────
function printBanner(meta) {
  console.log(`
${c.cyan}╔══════════════════════════════════════════════════╗
║        ${bold("Forge-Stack React Scaffolder")}          ║
║  ${dim(`v${meta.version} — ${meta.description}`)}
╚══════════════════════════════════════════════════╝${c.reset}
`);
}

// ── File generators ───────────────────────────────────────────────────────────

function genPackageJson(config) {
  const deps = { ...config.baseDeps };
  const devDeps = { ...config.baseDevDeps };

  for (const feat of config.features) {
    for (const d of feat.deps ?? []) {
      const [name, ver] = splitPackage(d);
      deps[name] = ver;
    }
    for (const d of feat.devDeps ?? []) {
      const [name, ver] = splitPackage(d);
      devDeps[name] = ver;
    }
  }

  const pkg = {
    name: config.projectName,
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc -b && vite build",
      lint: "eslint .",
      preview: "vite preview",
    },
    dependencies: Object.fromEntries(Object.entries(deps).sort()),
    devDependencies: Object.fromEntries(Object.entries(devDeps).sort()),
  };

  if (config.features.some((f) => f.id === "mock")) {
    pkg.msw = { workerDirectory: ["public"] };
  }

  return JSON.stringify(pkg, null, 2);
}

function splitPackage(spec) {
  // "@scope/pkg@version" or "pkg@version"
  const match = spec.match(/^(@?[^@]+)@(.+)$/);
  if (match) return [match[1], match[2]];
  return [spec, "latest"];
}

function genViteConfig(config) {
  return `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});
`;
}

function genTsConfigApp() {
  return JSON.stringify(
    {
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
        target: "ES2022",
        useDefineForClassFields: true,
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        module: "ESNext",
        types: ["vite/client"],
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        verbatimModuleSyntax: true,
        moduleDetection: "force",
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        erasableSyntaxOnly: true,
        noFallthroughCasesInSwitch: true,
        noUncheckedSideEffectImports: true,
      },
      include: ["src"],
    },
    null,
    2,
  );
}

function genTsConfigNode() {
  return JSON.stringify(
    {
      compilerOptions: {
        tsBuildInfoFile: "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
        target: "ES2022",
        lib: ["ES2022"],
        module: "ESNext",
        moduleResolution: "bundler",
        skipLibCheck: true,
        noEmit: true,
        strict: true,
      },
      include: ["vite.config.ts"],
    },
    null,
    2,
  );
}

function genTsConfig() {
  return JSON.stringify(
    {
      files: [],
      references: [
        { path: "./tsconfig.app.json" },
        { path: "./tsconfig.node.json" },
      ],
    },
    null,
    2,
  );
}

function genEslintConfig() {
  return `import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
`;
}

function genIndexHtml(config) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

function genMainTsx(config) {
  const hasMock = config.features.some((f) => f.id === "mock");
  const hasI18n = config.features.some((f) => f.id === "i18n");

  const imports = [
    `import { StrictMode } from "react";`,
    `import { createRoot } from "react-dom/client";`,
    `import "./styles/index.scss";`,
    hasI18n ? `import "./i18n";` : null,
    `import App from "./App";`,
    `import { QueryClient, QueryClientProvider } from "@tanstack/react-query";`,
  ]
    .filter(Boolean)
    .join("\n");

  const mockBlock = hasMock
    ? `\nif (import.meta.env.DEV) {
  const { worker } = await import("./api/mock/server");
  worker.start();
}\n`
    : "";

  return `${imports}

const root = document.getElementById("root")!;
const queryClient = new QueryClient();
${mockBlock}
createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
`;
}

function genAppTsx(config) {
  const pages = [
    { name: "Home", path: "/" },
    ...config.domains.map((d) => ({
      name: d.page ?? capitalize(d.id),
      path: `/${d.id}`,
    })),
    { name: "NotFound", path: "*" },
  ];

  const lazyImports = pages
    .map((p) => `const ${p.name} = lazy(() => import("./pages/${p.name}"));`)
    .join("\n");

  const routes = pages
    .map((p) => {
      if (p.path === "*")
        return `            <Route path="*" element={<NotFound />} />`;
      return `            <Route path="${p.path}" element={<${p.name} />} />`;
    })
    .join("\n");

  return `import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalLoader from "./components/loaders/GlobalLoader";
import Layout from "./components/layouts/Layout";

${lazyImports}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<GlobalLoader />}>
        <Routes>
          <Route element={<Layout />}>
${routes}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
`;
}

function genStyles(config) {
  const hasTheme = config.features.some((f) => f.id === "theming");

  const indexScss = `@use "./mixins" as *;
@import "./reset";
${hasTheme ? '@import "./theme";' : ""}
@import "./variables";

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: var(--bg);
  color: var(--text);
}

::selection {
  background: var(--primary);
  color: white;
}
`;

  const reset = `html, body, #root {
  margin: 0;
  padding: 0;
  height: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
`;

  const variables = `:root {
  /* spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* typography */
  --font-xs: 0.7rem;
  --font-sm: 0.8rem;
  --font-md: 1rem;
  --font-lg: 1.25rem;
  --font-xl: 1.5rem;

  /* transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;

  /* borders */
  --border-light: 1px solid var(--border);
}
`;

  const theme = hasTheme
    ? `:root {
  --bg: #f4f6f8;
  --bg-secondary: #ffffff;
  --header-bg: #ffffff;
  --text: #1a1a2e;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --primary: #4f46e5;
  --primary-hover: #4338ca;
  --surface-hover: #f9fafb;
  --skeleton-base: #e5e7eb;
  --skeleton-highlight: #f3f4f6;
}

html.dark {
  --bg: #0f1117;
  --bg-secondary: #1a1d27;
  --header-bg: #1a1d27;
  --text: #f3f4f6;
  --text-muted: #9ca3af;
  --border: #374151;
  --primary: #6366f1;
  --primary-hover: #818cf8;
  --surface-hover: #1f2937;
  --skeleton-base: #374151;
  --skeleton-highlight: #4b5563;
}
`
    : "";

  const mixins = `@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}

@mixin flex-center-y {
  display: flex;
  align-items: center;
}

@mixin card {
  background: var(--bg-secondary);
  border: var(--border-light);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}

@mixin text-muted {
  color: var(--text-muted);
  font-size: var(--font-sm);
}

@mixin smooth {
  transition: all var(--transition-normal);
}
`;

  return { indexScss, reset, variables, theme, mixins };
}

function genI18nIndex(languages) {
  const imports = languages
    .map((l) => `import ${l.id} from "./locales/${l.id}/common.json";`)
    .join("\n");
  const resources = languages
    .map((l) => `      ${l.id}: { common: ${l.id} },`)
    .join("\n");

  return `import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
${imports}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "${languages[0]?.id ?? "en"}",
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: { escapeValue: false },
    resources: {
${resources}
    },
  });
`;
}

function genCommonJson(langId) {
  const base = {
    loading: "Loading...",
    not_found: "Page not found",
    go_home: "Go back home",
    error: "An error occurred",
    retry: "Retry",
    theme: {
      toggle: langId === "fr" ? "Changer le thème" : "Toggle theme",
    },
    nav: {
      home: langId === "fr" ? "Accueil" : "Home",
    },
  };
  return JSON.stringify(base, null, 2);
}

function genHttpClient() {
  return `// Lightweight fetch wrapper — no external dependency
// Replace BASE_URL or read it from import.meta.env as needed
const BASE_URL = "/api";
const TIMEOUT = 8000;

type RequestOptions = RequestInit & { timeout?: number };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = TIMEOUT, ...init } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(BASE_URL + path, {
      ...init,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (!res.ok) throw new Error(\`HTTP \${res.status} — \${res.statusText}\`);
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(id);
  }
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "GET", ...options }),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body), ...options }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body), ...options }),
  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body), ...options }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...options }),
};
`;
}

function genInterceptors() {
  return `// Add cross-cutting concerns here: auth token injection, error logging, etc.
// This module is imported by client.ts if you need to centralise side-effects
// outside of the http wrapper (e.g. refreshing tokens, analytics).

export function onRequest(path: string, init: RequestInit): RequestInit {
  // Example: attach auth header
  // const token = localStorage.getItem("token");
  // if (token) init.headers = { ...init.headers, Authorization: \`Bearer \${token}\` };
  return init;
}

export function onError(error: unknown): never {
  console.error("API error:", error);
  throw error;
}
`;
}

function genMockServer(domains, hasBugReport = false) {
  const lines = domains.map(
    (d) => `import { ${d.id}Handlers } from "./handlers/${d.id}.handlers";`,
  );
  const spreads = domains.map((d) => `...${d.id}Handlers`);
  if (hasBugReport) {
    lines.push(
      `import { bugReportHandlers } from "./handlers/bug-report.handlers";`,
    );
    spreads.push("...bugReportHandlers");
  }
  const imports = lines.join("\n");
  const spread = spreads.join(", ");

  return `import { setupWorker } from "msw/browser";
${imports}

export const worker = setupWorker(${spread});
`;
}

function genBugReportMockHandler() {
  return `import { http, HttpResponse, delay } from "msw";

export const bugReportHandlers = [
  http.post("*/v1/reports", async () => {
    await delay(300);
    return HttpResponse.json(
      {
        issue_number: 123,
        issue_url: "https://github.com/chrysa/example-app/issues/123",
        deduplicated: false,
      },
      { status: 201 },
    );
  }),
];
`;
}

function genMockHandler(domain) {
  return `import { http, HttpResponse, delay } from "msw";

export const ${domain.id}Handlers = [
  http.get("/api/${domain.id}", async () => {
    await delay(500);
    return HttpResponse.json([
      // Add mock data for ${domain.name ?? domain.id} here
    ]);
  }),
];
`;
}

// ── Bug-report feature (vertical slice under src/features/bug-report/) ─────────
function genBugReportTypes() {
  return `export type Severity = "Critical" | "High" | "Medium" | "Low";

export interface EnvironmentInfo {
  url: string;
  user_agent: string;
  app_version: string;
  console_tail: string[];
}

export interface BugReportInput {
  title: string;
  description: string;
  severity: Severity;
  steps: string;
  expected: string;
  actual: string;
  reporter?: string;
}

export interface BugReportResponse {
  issue_number: number;
  issue_url: string;
  deduplicated: boolean;
}
`;
}

function genBugReportCapture() {
  return `import type { EnvironmentInfo } from "./types";

const MAX_LINES = 50;
const buffer: string[] = [];
let installed = false;

function push(line: string): void {
  buffer.push(line);
  if (buffer.length > MAX_LINES) buffer.shift();
}

/** Start capturing console errors + uncaught errors into a ring buffer. */
export function installConsoleCapture(): void {
  if (installed) return;
  installed = true;

  const original = console.error.bind(console);
  console.error = (...args: unknown[]) => {
    push(args.map((a) => String(a)).join(" "));
    original(...args);
  };

  window.addEventListener("error", (e) => {
    push(\`\${e.message} @ \${e.filename}:\${e.lineno}\`);
  });
  window.addEventListener("unhandledrejection", (e) => {
    push(\`Unhandled rejection: \${String(e.reason)}\`);
  });
}

export function captureEnvironment(): EnvironmentInfo {
  return {
    url: window.location.href,
    user_agent: navigator.userAgent,
    app_version: import.meta.env.VITE_APP_VERSION ?? "dev",
    console_tail: [...buffer],
  };
}
`;
}

function genBugReportApi() {
  return `import { captureEnvironment } from "./captureEnvironment";
import type { BugReportInput, BugReportResponse } from "./types";

const GATEWAY_URL = import.meta.env.VITE_FEEDBACK_GATEWAY_URL ?? "";
const APP_KEY = import.meta.env.VITE_FEEDBACK_APP_KEY ?? "";

export async function submitBugReport(
  input: BugReportInput,
): Promise<BugReportResponse> {
  const res = await fetch(\`\${GATEWAY_URL}/v1/reports\`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Feedback-Key": APP_KEY,
    },
    body: JSON.stringify({
      ...input,
      environment: captureEnvironment(),
      website: "",
    }),
  });
  if (!res.ok) {
    throw new Error(\`Bug report failed: \${res.status}\`);
  }
  return res.json() as Promise<BugReportResponse>;
}
`;
}

function genBugReportHook() {
  return `import { useMutation } from "@tanstack/react-query";
import { submitBugReport } from "./api";
import type { BugReportInput } from "./types";

export function useReportBug() {
  return useMutation({
    mutationFn: (input: BugReportInput) => submitBugReport(input),
  });
}
`;
}

function genBugReportModal() {
  return `import { useState } from "react";
import { useReportBug } from "./useReportBug";
import type { Severity } from "./types";
import styles from "./BugReport.module.scss";

const SEVERITIES: Severity[] = ["Critical", "High", "Medium", "Low"];

interface Props {
  onClose: () => void;
}

export default function ReportBugModal({ onClose }: Props) {
  const report = useReportBug();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<Severity>("Medium");
  const [steps, setSteps] = useState("");
  const [expected, setExpected] = useState("");
  const [actual, setActual] = useState("");
  const [reporter, setReporter] = useState("");
  const [website, setWebsite] = useState(""); // honeypot

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (website) return; // bot
    report.mutate({
      title,
      description,
      severity,
      steps,
      expected,
      actual,
      reporter: reporter || undefined,
    });
  }

  if (report.isSuccess) {
    const url = report.data.issue_url;
    return (
      <div className={styles.backdrop} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <h2>Thanks!</h2>
          <p>
            Tracked as issue #{report.data.issue_number}.{" "}
            {url ? (
              <a href={url} target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            ) : null}
          </p>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2>Report a bug</h2>
        <label>
          Title
          <input
            required
            minLength={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Severity
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Severity)}
          >
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Steps to reproduce
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)} />
        </label>
        <label>
          Expected
          <input value={expected} onChange={(e) => setExpected(e.target.value)} />
        </label>
        <label>
          Actual
          <input value={actual} onChange={(e) => setActual(e.target.value)} />
        </label>
        <label>
          Your email (optional)
          <input
            type="email"
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
          />
        </label>
        <input
          className={styles.honeypot}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
        {report.isError ? (
          <p className={styles.error}>Could not send report. Try again.</p>
        ) : null}
        <div className={styles.actions}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={report.isPending}>
            {report.isPending ? "Sending…" : "Send report"}
          </button>
        </div>
      </form>
    </div>
  );
}
`;
}

function genBugReportButton() {
  return `import { useEffect, useState } from "react";
import ReportBugModal from "./ReportBugModal";
import { installConsoleCapture } from "./captureEnvironment";
import styles from "./BugReport.module.scss";

export default function ReportBugButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    installConsoleCapture();
  }, []);

  return (
    <>
      <button
        type="button"
        className={styles.fab}
        onClick={() => setOpen(true)}
        aria-label="Report a bug"
        title="Report a bug"
      >
        🐞
      </button>
      {open ? <ReportBugModal onClose={() => setOpen(false)} /> : null}
    </>
  );
}
`;
}

function genBugReportIndex() {
  return `export { default as ReportBugButton } from "./ReportBugButton";
export { useReportBug } from "./useReportBug";
export type { BugReportInput, BugReportResponse, Severity } from "./types";
`;
}

function genBugReportEnvExample() {
  return `# In-app bug report -> feedback-gateway
# URL of the central feedback-gateway service.
VITE_FEEDBACK_GATEWAY_URL=http://localhost:8000
# Opaque per-app key registered in the gateway's APP_REPO_MAP.
VITE_FEEDBACK_APP_KEY=replace-with-your-app-key
# Shown in the issue body to help reproduce.
VITE_APP_VERSION=dev
`;
}

function genBugReportScss() {
  return `.fab {
  position: fixed;
  right: var(--space-lg, 16px);
  bottom: var(--space-lg, 16px);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  font-size: 22px;
  cursor: pointer;
  background: var(--header-bg, #1f2937);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal {
  background: var(--header-bg, #fff);
  color: inherit;
  padding: var(--space-lg, 24px);
  border-radius: 8px;
  width: min(480px, 92vw);
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.875rem;
}

.modal input,
.modal textarea,
.modal select {
  padding: 8px;
  border: 1px solid rgba(127, 127, 127, 0.4);
  border-radius: 4px;
  font: inherit;
}

.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
}
`;
}

function genDomainTypes(domain) {
  const typeName = capitalize(domain.id);
  return `// ${domain.name ?? capitalize(domain.id)} domain types

export interface ${typeName} {
  id: string;
  name: string;
  // TODO: add fields
}

export type ${typeName}Status = "active" | "inactive";
`;
}

function genDomainQueries(domain) {
  const typeName = capitalize(domain.id);
  return `import { useQuery } from "@tanstack/react-query";
import type { ${typeName} } from "./types";

export function use${typeName}sQuery() {
  return useQuery<${typeName}[]>({
    queryKey: ["${domain.id}"],
    queryFn: async () => {
      const res = await fetch("/api/${domain.id}");
      if (!res.ok) throw new Error("Failed to fetch ${domain.id}");
      return res.json();
    },
  });
}
`;
}

function genDomainMapper(domain) {
  const typeName = capitalize(domain.id);
  return `import type { ${typeName} } from "./types";

// Map raw API response to domain model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function map${typeName}(raw: any): ${typeName} {
  return {
    id: String(raw.id),
    name: String(raw.name),
  };
}
`;
}

function genDomainIndex(domain) {
  return `export * from "./types";
export * from "./queries";
`;
}

function genPageTsx(name, hasScss = true) {
  const cssImport = hasScss
    ? `import styles from "./${name}.module.scss";\n`
    : "";
  return `${cssImport}
export default function ${name}() {
  return (
    <div${hasScss ? ` className={styles.page}` : ""}>
      <h1>${name}</h1>
    </div>
  );
}
`;
}

function genPageScss(name) {
  return `.page {
  padding: var(--space-lg);
}
`;
}

function genNotFound() {
  return `import { Link } from "react-router-dom";
import styles from "./NotFound.module.scss";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}
`;
}

function genLayoutTsx(config) {
  const hasBugReport = config.features.some((f) => f.id === "bug-report");

  const bugImport = hasBugReport
    ? `import { ReportBugButton } from "../../features/bug-report";\n`
    : "";
  const bugWidget = hasBugReport ? `\n      <ReportBugButton />` : "";

  return `import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
${bugImport}import styles from "./Layout.module.scss";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>${bugWidget}
    </div>
  );
}
`;
}

function genLayoutScss() {
  return `.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
}
`;
}

function genHeaderTsx(config) {
  const hasTheme = config.features.some((f) => f.id === "theming");
  const hasI18n = config.features.some((f) => f.id === "i18n");

  const themeImport = hasTheme
    ? `import { useTheme } from "../../hooks/useTheme";\n`
    : "";
  const i18nImport = hasI18n
    ? `import LanguageSwitcher from "../languages/LanguageSwitcher";\n`
    : "";

  const themeHook = hasTheme
    ? `\n  const { theme, setTheme } = useTheme();`
    : "";
  const themeButton = hasTheme
    ? `\n        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>`
    : "";
  const i18nWidget = hasI18n ? `\n        <LanguageSwitcher />` : "";

  return `${themeImport}${i18nImport}import styles from "./Header.module.scss";

export default function Header() {${themeHook}

  return (
    <header className={styles.header}>
      <div className={styles.logo}>${config.projectName}</div>
      <div className={styles.actions}>${themeButton}${i18nWidget}
      </div>
    </header>
  );
}
`;
}

function genHeaderScss() {
  return `.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--space-lg);
  background: var(--header-bg);
  border-bottom: var(--border-light);
}

.logo {
  font-weight: 700;
  font-size: var(--font-lg);
}

.actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
`;
}

function genSidebarTsx(config) {
  const links = [
    { path: "/", label: "Home" },
    ...config.domains.map((d) => ({
      path: `/${d.id}`,
      label: d.name ?? capitalize(d.id),
    })),
  ];

  const navLinks = links
    .map((l) => `        <NavLink to="${l.path}">${l.label}</NavLink>`)
    .join("\n");

  return `import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.scss";

export default function Sidebar() {
  return (
    <nav className={styles.sidebar}>
${navLinks}
    </nav>
  );
}
`;
}

function genSidebarScss() {
  return `.sidebar {
  width: 200px;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: var(--bg-secondary);
  border-right: var(--border-light);

  a {
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: var(--text);
    font-size: var(--font-sm);
    transition: background var(--transition-fast);

    &:hover {
      background: var(--surface-hover);
    }

    &.active {
      background: var(--primary);
      color: white;
    }
  }
}
`;
}

function genGlobalLoader() {
  return `import styles from "./GlobalLoader.module.scss";

export default function GlobalLoader() {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner} />
    </div>
  );
}
`;
}

function genGlobalLoaderScss() {
  return `.overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  z-index: 9999;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
`;
}

function genUseTheme() {
  return `import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">(
    () => (localStorage.getItem("theme") as "light" | "dark") ?? "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
`;
}

function genUseLanguage(languages) {
  const langMap = languages
    .map(
      (l) =>
        `  ${l.id}: { label: "${l.name}", flag: "${l.flag ?? l.id + ".svg"}" },`,
    )
    .join("\n");

  return `import { useTranslation } from "react-i18next";

export function useLanguage() {
  const { i18n } = useTranslation();
  const languages = {
${langMap}
  };
  const current = i18n.language || "${languages[0]?.id ?? "en"}";
  return { current, languages, change: (lng: string) => i18n.changeLanguage(lng) };
}
`;
}

function genLanguageSwitcher() {
  return `import { useLanguage } from "../../hooks/useLanguage";
import styles from "./LanguageSwitcher.module.scss";

export default function LanguageSwitcher() {
  const { current, languages, change } = useLanguage();

  return (
    <div className={styles.switcher}>
      {Object.entries(languages)
        .filter(([id]) => id !== current)
        .map(([id, lang]) => (
          <button key={id} onClick={() => change(id)} className={styles.btn}>
            {lang.label}
          </button>
        ))}
    </div>
  );
}
`;
}

function genLanguageSwitcherScss() {
  return `.switcher {
  display: flex;
  gap: var(--space-xs);
}

.btn {
  font-size: var(--font-xs);
  padding: 2px 8px;
  border: var(--border-light);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  transition: background var(--transition-fast);

  &:hover {
    background: var(--surface-hover);
  }
}
`;
}

// ── Capitalize helper ─────────────────────────────────────────────────────────
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Summary printer ───────────────────────────────────────────────────────────
function printSummary(config) {
  console.log(`\n${bold("Configuration summary:")}`);
  console.log(`  ${dim("Project:")}  ${cyan(config.projectName)}`);
  console.log(`  ${dim("Output:")}   ${cyan(config.outputDir)}`);
  console.log(`  ${dim("Features:")}`);
  for (const f of config.features) {
    console.log(`    ${green("✓")} ${f.name}`);
  }
  if (config.domains.length) {
    console.log(`  ${dim("Domains:")}`);
    for (const d of config.domains) {
      console.log(`    ${blue("◆")} ${d.name ?? d.id} → ${dim(`/${d.id}`)}`);
    }
  }
  console.log();
}

// ── Main generator ────────────────────────────────────────────────────────────
function generate(config) {
  const out = config.outputDir;
  mkdir(out);

  const src = join(out, "src");

  // Root config files
  write(join(out, "package.json"), genPackageJson(config));
  write(join(out, "vite.config.ts"), genViteConfig(config));
  write(join(out, "tsconfig.json"), genTsConfig());
  write(join(out, "tsconfig.app.json"), genTsConfigApp());
  write(join(out, "tsconfig.node.json"), genTsConfigNode());
  write(join(out, "eslint.config.js"), genEslintConfig());
  write(join(out, "index.html"), genIndexHtml(config));
  write(join(out, "README.md"), genProjectReadme(config));

  // src/
  write(join(src, "main.tsx"), genMainTsx(config));
  write(join(src, "App.tsx"), genAppTsx(config));
  write(join(src, "App.css"), "");
  write(join(src, "index.css"), "");

  // styles/
  const styles = genStyles(config);
  write(join(src, "styles/index.scss"), styles.indexScss);
  write(join(src, "styles/_reset.scss"), styles.reset);
  write(join(src, "styles/_variables.scss"), styles.variables);
  write(join(src, "styles/_mixins.scss"), styles.mixins);
  write(join(src, "styles/_globals.scss"), styles.indexScss);
  if (config.features.some((f) => f.id === "theming")) {
    write(join(src, "styles/_theme.scss"), styles.theme);
  }

  // api/http/
  write(join(src, "api/http/client.ts"), genHttpClient());
  write(join(src, "api/http/interceptors.ts"), genInterceptors());

  const hasBugReport = config.features.some((f) => f.id === "bug-report");

  // api/mock/
  if (config.features.some((f) => f.id === "mock")) {
    write(
      join(src, "api/mock/server.ts"),
      genMockServer(config.domains, hasBugReport),
    );
    for (const d of config.domains) {
      write(
        join(src, `api/mock/handlers/${d.id}.handlers.ts`),
        genMockHandler(d),
      );
    }
    if (hasBugReport) {
      write(
        join(src, "api/mock/handlers/bug-report.handlers.ts"),
        genBugReportMockHandler(),
      );
    }
    // public/mockServiceWorker.js needs to be initialized via `npx msw init`
    mkdir(join(out, "public"));
  }

  // features/bug-report/ — in-app bug reporting -> feedback-gateway -> GitHub
  if (hasBugReport) {
    const bug = join(src, "features/bug-report");
    write(join(bug, "types.ts"), genBugReportTypes());
    write(join(bug, "captureEnvironment.ts"), genBugReportCapture());
    write(join(bug, "api.ts"), genBugReportApi());
    write(join(bug, "useReportBug.ts"), genBugReportHook());
    write(join(bug, "ReportBugModal.tsx"), genBugReportModal());
    write(join(bug, "ReportBugButton.tsx"), genBugReportButton());
    write(join(bug, "BugReport.module.scss"), genBugReportScss());
    write(join(bug, "index.ts"), genBugReportIndex());
    write(join(out, ".env.example"), genBugReportEnvExample());
  }

  // domain/
  for (const d of config.domains) {
    write(join(src, `domain/${d.id}/types.ts`), genDomainTypes(d));
    write(join(src, `domain/${d.id}/queries.ts`), genDomainQueries(d));
    write(join(src, `domain/${d.id}/mapper.ts`), genDomainMapper(d));
    write(join(src, `domain/${d.id}/index.ts`), genDomainIndex(d));
  }

  // features/
  for (const d of config.domains) {
    write(join(src, `features/${d.id}/.gitkeep`), "");
  }

  // pages/
  write(join(src, "pages/Home.tsx"), genPageTsx("Home"));
  write(join(src, "pages/Home.module.scss"), genPageScss("Home"));
  write(join(src, "pages/NotFound.tsx"), genNotFound());
  write(join(src, "pages/NotFound.module.scss"), genPageScss("NotFound"));
  for (const d of config.domains) {
    const name = d.page ?? capitalize(d.id);
    write(join(src, `pages/${name}.tsx`), genPageTsx(name));
    write(join(src, `pages/${name}.module.scss`), genPageScss(name));
  }

  // components/layouts/
  write(join(src, "components/layouts/Layout.tsx"), genLayoutTsx(config));
  write(join(src, "components/layouts/Layout.module.scss"), genLayoutScss());
  write(join(src, "components/layouts/Header.tsx"), genHeaderTsx(config));
  write(join(src, "components/layouts/Header.module.scss"), genHeaderScss());
  write(join(src, "components/layouts/Sidebar.tsx"), genSidebarTsx(config));
  write(join(src, "components/layouts/Sidebar.module.scss"), genSidebarScss());

  // components/loaders/
  write(join(src, "components/loaders/GlobalLoader.tsx"), genGlobalLoader());
  write(
    join(src, "components/loaders/GlobalLoader.module.scss"),
    genGlobalLoaderScss(),
  );

  // components/ui/ — placeholder
  write(
    join(src, "components/ui/Skeleton.tsx"),
    `import styles from "./Skeleton.module.scss";\n\ninterface Props { width?: string; height?: string; radius?: string; }\n\nexport default function Skeleton({ width = "100%", height = "16px", radius }: Props) {\n  return <div className={styles.skeleton} style={{ width, height, borderRadius: radius }} />;\n}\n`,
  );
  write(
    join(src, "components/ui/Skeleton.module.scss"),
    `.skeleton {\n  background: var(--skeleton-base);\n  animation: shimmer 1.5s infinite;\n}\n\n@keyframes shimmer {\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0.5; }\n}\n`,
  );

  // hooks/
  if (config.features.some((f) => f.id === "theming")) {
    write(join(src, "hooks/useTheme.ts"), genUseTheme());
  }

  const i18nFeat = config.features.find((f) => f.id === "i18n");
  if (i18nFeat) {
    const langs = i18nFeat.options?.languages ?? [
      { id: "en", name: "English" },
    ];
    write(join(src, "hooks/useLanguage.ts"), genUseLanguage(langs));
    write(join(src, "i18n/index.ts"), genI18nIndex(langs));
    for (const l of langs) {
      write(join(src, `i18n/locales/${l.id}/common.json`), genCommonJson(l.id));
    }
    write(
      join(src, "components/languages/LanguageSwitcher.tsx"),
      genLanguageSwitcher(),
    );
    write(
      join(src, "components/languages/LanguageSwitcher.module.scss"),
      genLanguageSwitcherScss(),
    );
  }

  // utils/
  write(join(src, "utils/.gitkeep"), "");

  // assets/
  write(join(src, "assets/.gitkeep"), "");
}

function genProjectReadme(config) {
  const featuresList = config.features.map((f) => `- **${f.name}**`).join("\n");
  const domainsList = config.domains.length
    ? config.domains.map((d) => `- \`${d.id}\` → \`/${d.id}\``).join("\n")
    : "_No domains configured_";

  return `# ${config.projectName}

Generated with **Forge-Stack React Scaffolder**.

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

${featuresList}

## Domains

${domainsList}

## Scripts

| Command | Description |
|---|---|
| \`npm run dev\` | Start dev server |
| \`npm run build\` | Production build |
| \`npm run lint\` | Lint check |
| \`npm run preview\` | Preview build |
`;
}

// ── Prompts ───────────────────────────────────────────────────────────────────
async function promptDomains(rl) {
  const domains = [];
  console.log(
    `\n  ${cyan("?")} ${bold("Define your domain modules")} ${dim("(empty name to stop)")}`,
  );

  while (true) {
    const id = (await ask(rl, `Domain id (e.g. products): `))
      .trim()
      .toLowerCase();
    if (!id) break;
    if (!/^[a-z][a-z0-9_-]*$/.test(id)) {
      console.log(
        `  ${yellow("⚠")} Invalid id — use lowercase letters, numbers, hyphens only.`,
      );
      continue;
    }
    const name =
      (await ask(rl, `Display name (e.g. Products): `)).trim() ||
      capitalize(id);
    const route = `/${id}`;
    const page = capitalize(id);
    domains.push({ id, name, route, page });
    console.log(`  ${green("✓")} Domain ${cyan(id)} added`);
  }
  return domains;
}

// ── Entry point ───────────────────────────────────────────────────────────────
async function main() {
  // Load manifest
  const manifestPath = join(__dir, "template.yaml");
  if (!existsSync(manifestPath)) {
    console.error(red(`✗ template.yaml not found at ${manifestPath}`));
    process.exit(1);
  }
  const manifest = parseYaml(readFileSync(manifestPath, "utf8"));

  const rl = createInterface({ input, output });

  printBanner(manifest.meta ?? { version: "1.0.0", description: "" });

  // 1. Project name
  const projectName =
    (await ask(rl, `Project name ${dim("(default: my-app)")}: `)).trim() ||
    "my-app";

  if (!/^[a-z][a-z0-9_-]*$/.test(projectName)) {
    console.log(
      yellow("⚠  Project name should be lowercase with hyphens. Continuing..."),
    );
  }

  // 2. Output directory
  const defaultOut = resolve(process.cwd(), projectName);
  const outAnswer = (
    await ask(rl, `Output directory ${dim(`(default: ${defaultOut})`)}: `)
  ).trim();
  const outputDir = outAnswer ? resolve(process.cwd(), outAnswer) : defaultOut;

  if (existsSync(outputDir)) {
    const overwrite = await confirm(
      rl,
      `${yellow("⚠")} Directory already exists. Overwrite?`,
      false,
    );
    if (!overwrite) {
      console.log(dim("Aborted."));
      rl.close();
      process.exit(0);
    }
  }

  // 3. Package manager
  const pmChoice = await select(rl, "Package manager", [
    { label: "npm" },
    { label: "pnpm" },
    { label: "yarn" },
    { label: "bun" },
  ]);
  const pm = pmChoice.label;

  // 4. Features
  const availableFeatures = manifest.features ?? [];
  const selectedFeatures = await multiSelect(
    rl,
    "Select features to enable",
    availableFeatures,
  );

  // 5. Domains
  const domains = await promptDomains(rl);

  // 6. Confirm
  const config = {
    projectName,
    outputDir,
    pm,
    features: selectedFeatures,
    domains,
    baseDeps: Object.fromEntries(
      (manifest.dependencies ?? []).map((d) => splitPackage(d)),
    ),
    baseDevDeps: Object.fromEntries(
      (manifest.devDependencies ?? []).map((d) => splitPackage(d)),
    ),
  };

  printSummary(config);
  const go = await confirm(rl, "Generate project?", true);
  rl.close();

  if (!go) {
    console.log(dim("Aborted."));
    process.exit(0);
  }

  // 7. Generate files
  console.log(`\n${bold("Generating project...")} `);
  generate(config);
  console.log(green("✓") + " Files written");

  // 8. Install MSW worker if mock enabled
  if (selectedFeatures.some((f) => f.id === "mock")) {
    console.log(`${bold("Initializing MSW Service Worker...")}`);
    try {
      execSync(
        `${pm === "npm" ? "npx" : pm + " exec"} msw init public/ --save`,
        {
          cwd: outputDir,
          stdio: "inherit",
        },
      );
    } catch {
      console.log(
        yellow(
          "⚠  Could not auto-init MSW. Run manually: npx msw init public/ --save",
        ),
      );
    }
  }

  // 9. Install deps
  const install = await (async () => {
    const rl2 = createInterface({ input, output });
    const ans = await confirm(
      rl2,
      `Install dependencies with ${bold(pm)}?`,
      true,
    );
    rl2.close();
    return ans;
  })();

  if (install) {
    console.log(`\n${bold(`Running ${pm} install...`)}`);
    try {
      execSync(`${pm} install`, { cwd: outputDir, stdio: "inherit" });
      console.log(green("✓") + " Dependencies installed");
    } catch {
      console.log(red("✗") + " Install failed. Run it manually.");
    }
  }

  // 10. Done
  console.log(`
${green("✓")} ${bold("Project ready!")}

  ${dim("cd")} ${cyan(outputDir)}
  ${dim("npm run dev")}
`);
}

main().catch((err) => {
  console.error(red("✗ Fatal error:"), err.message);
  process.exit(1);
});
