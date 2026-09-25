# REQUIREMENTS — react-app-generator

> Tags: **FACT / INFERENCE / UNKNOWN / PROPOSAL**. "IMPLEMENTED" is asserted only where
> verifiable in-repo (evidence pointer given). Absence of tests means "IMPLEMENTED"
> here = "code present", not "test-proven".

## Product requirements (REQ-PROD)

| ID | Requirement | Source | Status |
| --- | --- | --- | --- |
| REQ-PROD-001 | Provide a canonical React stack/structure for the ecosystem | CLAUDE.md (INFERENCE→FACT: role statement) | IMPLEMENTED (`src/`, `template.yaml`) |
| REQ-PROD-002 | Scaffold a new React project interactively (name, out dir, package manager, features, domains) | `scaffold.mjs` `main()` | IMPLEMENTED (FACT) |
| REQ-PROD-003 | Features are opt-in: i18n, theming (dark mode), MSW mock API | `template.yaml` features | IMPLEMENTED (FACT) |
| REQ-PROD-004 | Generated projects inherit the chrysa documentation structure | `scaffold.mjs:1156` cpSync of `template-docs/` | IMPLEMENTED (FACT) |
| REQ-PROD-005 | Ship a working reference dashboard (KPIs, map monitoring, domains) | `src/pages/*`, `src/features/*` | IMPLEMENTED (FACT) |
| REQ-PROD-006 | i18n ships FR + EN locales with a language switcher | `src/i18n/locales/{fr,en}`, `LanguageSwitcher` | IMPLEMENTED (FACT) |

## Technical requirements (REQ-TECH)

| ID | Requirement | Source | Status |
| --- | --- | --- | --- |
| REQ-TECH-001 | Stack: Vite 7, TypeScript 5 strict, React 19, React Router v7, React Query v5 | README + CLAUDE.md + `package.json` | IMPLEMENTED (FACT) |
| REQ-TECH-002 | Server state via React Query only; never `useEffect` for fetching | CLAUDE.md "Règles de code" | INFERENCE (rule stated; not enforced by lint on `src/`) |
| REQ-TECH-003 | `api/` is a pure connector layer, provider-agnostic (swappable for MSW/other) | CLAUDE.md, `src/api/` | IMPLEMENTED (FACT) |
| REQ-TECH-004 | Styling via SCSS Modules + CSS variables | README, `src/**/*.module.scss` | IMPLEMENTED (FACT) |
| REQ-TECH-005 | Scaffolder has zero runtime npm dependencies (own YAML parser) | `scaffold.mjs` imports only `node:*` | IMPLEMENTED (FACT) |
| REQ-TECH-006 | CI: version → lint → typecheck → pre-commit → build → Sonar | `.github/workflows/ci.yml` | IMPLEMENTED (FACT) |
| REQ-TECH-007 | Automatic SemVer via GitVersion; changelog via git-cliff | `GitVersion.yml`, `cliff.toml`, `release.yml` | IMPLEMENTED (FACT) |
| REQ-TECH-008 | English-only on disk (code, comments, docs, config) | CLAUDE.md "Language Rules" | PARTIAL — CLAUDE.md body itself is largely French (contradiction; see REVIEW) |
| REQ-TECH-009 | Test suite with coverage | CI references `npm run test:coverage` | NOT IMPLEMENTED — no test script in `package.json`, 0 test files (FACT) |

## Traceability / evidence

- Scaffolder generators: `scaffold.mjs` `gen*` functions (grep-verified list).
- Features manifest: `template.yaml` `features:` (i18n / theming / mock).
- CI stages: `.github/workflows/ci.yml` jobs `version`, `lint`, `pre-commit`,
  `build`, `sonar`.

## Gaps / UNKNOWN

- **UNKNOWN** — Intended real backend / API contract for generated apps.
- **UNKNOWN** — Whether the `src/` reference app is meant to be shipped, or is a demo
  only (it is excluded from root lint and typecheck config `tsconfig.app.json` scope —
  verify before relying on it as production code).
- **PROPOSAL** — Add a test runner (Vitest) to satisfy REQ-TECH-009, since CI already
  calls `test:coverage`.
