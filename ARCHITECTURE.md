# Architecture

## Purpose

Forge-Stack React Template / `react-app-generator` — a production-ready React
starter that doubles as an interactive project generator. `scaffold.mjs` reads
`template.yaml`, prompts for a project name, output directory, package manager,
opt-in features and domain modules, then generates a new project. The `src/`
tree is itself a working reference app (a "backoffice" with Monitoring,
Territories and Shuttles pages) that the scaffolder can emit and adapt. The
repo also ships a standardized documentation structure (`template-docs/`) that
is copied into every generated app.

## Stack

- **Runtime/build:** Node (ESM, `"type": "module"`), Vite, TypeScript.
- **UI:** React 19, `react-router-dom` v7, SCSS Modules (`sass-embedded`).
- **Server state:** `@tanstack/react-query` v5 (no global store — server state only).
- **Mock API:** MSW v2 (intercepts `/api/*` in the browser during dev).
- **i18n:** `i18next` + `react-i18next` + browser language detector (en / fr).
- **Maps & charts:** `leaflet` / `react-leaflet`, `echarts`/`echarts-for-react`,
  `@nivo/line`, `react-minimal-pie-chart`.
- **Icons:** `lucide-react`, `react-icons`.
- **Lint:** ESLint (flat config) run via `tools/lint/run-eslint.mjs`.

Note: `package.json` (the working template) and `template.yaml` (scaffolder
manifest) list overlapping but differently-pinned dependency versions
(e.g. Vite `^8.2.0` vs `^7.3.1`, TS `~7.0.2` vs `~5.9.3`); the manifest is the
source of truth for what a freshly generated project receives.

## Layout

- `scaffold.mjs` — interactive scaffolder (includes a minimal built-in YAML parser).
- `template.yaml` — single source of truth for base deps, opt-in features, domains, conventions.
- `src/` — working reference React app:
  - `main.tsx`, `App.tsx` — entry and router.
  - `pages/` — Monitoring, Territories, Shuttles, NotFound.
  - `features/` — `kpis/` (Missions, Territories, Shuttles, Users, side panel), `monitoring/map`.
  - `domain/` — `users`, `territories`, `shuttles`.
  - `api/` — `http/` client and `mock/` (MSW handlers/server).
  - `components/` — ui, layouts, charts, cards, filters, loaders, skeletons, languages.
  - `hooks/`, `utils/`, `styles/`, `i18n/` (`locales/en`, `locales/fr`), `assets/`.
- `tools/lint/` — ESLint runner and its own config/deps.
- `template-docs/` — chrysa doc structure (ai, decisions, docs, examples, postmortems, prompts, schemas, tests, workflows) inherited by generated apps.
- Config: `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `cliff.toml`, `GitVersion.yml`, `.pre-commit-config.yaml`, `.github/`.

Note: a nested `src/src/` directory exists in the tree (appears to duplicate the app root).

## Entrypoints

- **App:** `index.html` → `src/main.tsx` (mounts React, starts MSW worker in dev, wraps `App` in `QueryClientProvider`) → `src/App.tsx` (`BrowserRouter` + lazy-loaded routes).
- **Generator:** `node scaffold.mjs`.

## Data / external deps

- No backend in this repo. HTTP calls target `/api/*` and are served by MSW mock
  handlers in the browser during development (`src/api/mock/`, `worker.start()` in dev).
- `template.yaml` conventions declare an API timeout of 8000ms.
- External network use is limited to map tiles (Leaflet) and CDN badges in the README.
- No secrets found in the files read.

## Build & test

Scripts (`package.json`), also wrapped by the `Makefile`:

```bash
npm install
npm run dev        # Vite dev server with HMR        (make dev)
npm run build      # tsc -b && vite build             (make build)
npm run lint       # node tools/lint/run-eslint.mjs . (make lint)
npm run preview    # preview production build         (make preview)
node scaffold.mjs  # generate a new project from template.yaml
```

Makefile also exposes `typecheck`, `format` (Prettier), `pre-commit-install`,
`pre-commit-run`, and `ci` (install-ci → lint → typecheck → build).

**Tests:** N/A — no test runner or `test` script is configured in `package.json`
(the Makefile `test`/`test-cov` targets fall back to "No test script configured").
A `coverage/` directory is present in the repo.
