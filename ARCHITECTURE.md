# ARCHITECTURE — react-app-generator

> Status: generated documentation. Claims are tagged **FACT** (verifiable in-repo),
> **INFERENCE** (reasoned from evidence), **UNKNOWN**, or **PROPOSAL**. Do not promote
> a lower tag to FACT.

## 1. Purpose

**FACT** — This repository is the canonical React **template + scaffolder** for the
chrysa / Forge-Stack-Workshop ecosystem. `CLAUDE.md` states it is the "source de vérité
pour la structure et le stack de toutes les apps React de l'écosystème".

Two things live here:

1. **A scaffolder** — `scaffold.mjs` (~1489 lines, FACT), an interactive Node CLI that
   reads `template.yaml` and generates a new React project. It has **no external runtime
   dependencies** and ships its own minimal YAML parser (FACT: `parseYaml` at
   `scaffold.mjs:22`).
2. **A reference application** under `src/` — a working dashboard/"backoffice" sample
   (KPI cards, Leaflet map monitoring, shuttles/users/territories domains). This doubles
   as the living example of the target structure. **INFERENCE**: the `src/` app is a
   demonstration surface, not the scaffolder's own runtime.

## 2. Component map (FACT)

| Component | Path | Role |
| --- | --- | --- |
| Scaffolder CLI | `scaffold.mjs` | Prompts, then emits files via `gen*()` string builders |
| Template manifest | `template.yaml` | Single source of truth: base deps, features, domains, conventions |
| Doc template set | `template-docs/` | chrysa doc structure copied into each generated project |
| Reference app | `src/` | Working React 19 + Vite sample dashboard |
| Lint runner | `tools/lint/run-eslint.mjs` + `tools/lint/eslint.config.mjs` | Isolated ESLint (see CONSTRAINTS) |
| Root ESLint | `eslint.config.js` | Ignores `src/**`, `template-docs/**` (FACT) |
| CI | `.github/workflows/ci.yml` | version → lint/typecheck → pre-commit → build → sonar |
| Release | `.github/workflows/release.yml` | GitVersion + git-cliff changelog |
| Build entry | `index.html`, `vite.config.ts`, `tsconfig*.json` | Vite/TS build of the reference app |

## 3. Scaffolder flow (FACT, from `scaffold.mjs` `main()` at ~1341)

1. Print banner from `template.yaml` `meta`.
2. Prompt: project name, output directory, package manager, features (multi-select),
   domains.
3. Build a `config` object (features, domains, base deps/devDeps split via
   `splitPackage`).
4. `printSummary` then confirm.
5. `generate(config)` writes files through per-artifact generators
   (`genPackageJson`, `genViteConfig`, `genTsConfig*`, `genEslintConfig`,
   `genMainTsx`, `genAppTsx`, `genStyles`, `genI18nIndex`, `genMockServer`,
   `genDomain*`, `genPageTsx`, layout/header/sidebar, `useTheme`/`useLanguage`, …).
6. Copy `template-docs/<dir>` into the output via `cpSync` (`scaffold.mjs:1156`).
7. If `mock` feature selected → `npx msw init public/ --save`.
8. Optionally run `<pm> install`.

## 4. Reference-app architecture (FACT, README + `src/`)

Layered, one-directional dependency flow:

```
pages → features → domain (React Query) → api/http → backend
              ↑
          components (generic UI)
```

- `api/http` — transport only (typed `fetch` wrapper); `api/mock` — MSW handlers +
  fixtures (`kpi`, `shuttles`, `territories`, `users`).
- `domain/<entity>` — `types.ts`, `queries.ts` (React Query hooks), `mapper.ts`,
  `index.ts`, plus metric hooks (`useShuttleMetrics`, `useUsersMetrics`,
  `useTerritoryStatus`, `computeTerritoryState`).
- `features/` — vertical slices: `kpis/*`, `monitoring/map/*` (Leaflet).
- `components/` — generic UI: cards, charts (`HalfDonutGauge`, `HorizontalBar`,
  `MiniDonut`), filters, layouts, loaders, skeletons, `ui/`.
- `pages/` — `Monitoring`, `Shuttles`, `Territories`, `NotFound` (lazy-loaded, FACT
  `genAppTsx`).
- `styles/` — SCSS partials (`_reset`, `_variables`, `_theme`, `_mixins`, `_globals`).
- `i18n/` — i18next config + `fr`/`en` locales.

## 5. Data & integrations

- **FACT** — No backend in this repo. Data is served by **MSW mock handlers** against
  `/api/*` routes; fixtures are static TS data files under `src/api/mock/data/`.
- **FACT** — Map rendering uses **Leaflet / react-leaflet**; charts use `echarts`,
  `@nivo/line`, `react-minimal-pie-chart` (per `package.json` of the reference app).
- **UNKNOWN** — Real backend contract; `api/http` is a placeholder transport.

## 6. Build & deploy

- **FACT** — Build: `npm run build` = `tsc -b && vite build`. Dev: `vite`. Preview:
  `vite preview`.
- **UNKNOWN** — Deployment target/hosting for the reference app. `template-docs/docs/
  deployment.md` is a stub inherited by generated projects, not a deploy spec for this
  repo.

## 7. Known structural anomalies

See `REVIEW.md` and `CONSTRAINTS.md`. Most significant: a **duplicated nested
`src/src/` tree** (119 tracked files, FACT) and a **package.json named `backoffice`**
rather than the template name (FACT).
