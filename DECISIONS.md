# DECISIONS — react-app-generator

Architecture Decision Records (ADR). Where rationale is not recorded in-repo it is
tagged **UNKNOWN** and not invented.

## ADR-001 — Dependency-free scaffolder with in-file YAML parser
- **Status**: Accepted (FACT — implemented in `scaffold.mjs`).
- **Decision**: `scaffold.mjs` uses only Node built-ins and a minimal hand-written YAML
  parser instead of `js-yaml`.
- **Consequence**: Runs with zero `npm install`; but complex YAML is unsupported (noted
  in-file). **Rationale**: INFERENCE (portability / no bootstrap install).

## ADR-002 — `template.yaml` as single source of truth
- **Status**: Accepted (FACT — README §"Scaffolder manifest").
- **Decision**: Base deps, opt-in features (i18n/theming/mock), domains, and conventions
  are declared in `template.yaml` and consumed by the scaffolder.

## ADR-003 — React Query for all server state; no `useEffect` fetching
- **Status**: Accepted (FACT — CLAUDE.md "Règles de code").
- **Decision**: `useQuery`/`useMutation` only; no global store (server state only).
- **Consequence**: `api/` stays a pure connector layer, swappable (MSW / real backend).

## ADR-004 — MSW mock API instead of a bundled backend
- **Status**: Accepted (FACT — `mock` feature, `src/api/mock/`).
- **Decision**: The reference app serves data via Mock Service Worker over `/api/*`.
- **Rationale**: INFERENCE — lets the template run standalone without a server.

## ADR-005 — Isolated lint toolchain under `tools/lint/`
- **Status**: Accepted (FACT — commit `c8c521d`, `tools/lint/eslint.config.mjs` with
  committed `node_modules`).
- **Decision**: Run ESLint through `tools/lint/run-eslint.mjs` isolated from the app's
  TypeScript, and ignore `src/**` in the root `eslint.config.js`.
- **Consequence**: Unblocks typescript-eslint under TS7, **but the `src/` reference app
  is not linted by the root config** (trade-off, flagged in REVIEW).

## ADR-006 — GitFlow + GitVersion + git-cliff
- **Status**: Accepted (FACT — `GitVersion.yml`, `cliff.toml`, `release.yml`).
- **Decision**: Automatic SemVer (GitFlow/v1, next 0.1.0) and generated changelog.

## ADR-007 — Centralised chrysa CI/standards via reusable actions
- **Status**: Accepted / in-progress (FACT — CI uses `chrysa/github-actions/*`; issue
  #22 tracks the standards integration per CLAUDE.md).
- **Decision**: Thin workflows delegating to centralised composite actions
  (`gitversion`, `sonar-scan-node`).

## ADR-008 — Package manager: npm here vs pnpm doctrine
- **Status**: UNKNOWN / contradictory.
- **Observation (FACT)**: repo commits `package-lock.json` and CI runs `npm ci` with
  `.npmrc legacy-peer-deps=true`; the managed standards block in CLAUDE.md references a
  pnpm doctrine. No ADR reconciles this. See REVIEW / CONSTRAINTS.
