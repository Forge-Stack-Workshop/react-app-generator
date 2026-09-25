# TESTING — react-app-generator

> Tags: **FACT / INFERENCE / UNKNOWN / PROPOSAL**. Commands below are transcribed from
> `package.json`, `Makefile`, and CI; they were **not executed** during documentation
> (docs-only mission).

## Current state (FACT)

- **No automated test suite exists.** `package.json` has **no `test` / `test:ci` /
  `test:coverage` script**, and there are **0 test/spec files** tracked
  (`*.test.*`, `*.spec.*`, `__tests__`, no Vitest/Jest config).
- CI's build job runs `npm run test:coverage --if-present || echo "No test:coverage
  script — skipping"` (`.github/workflows/ci.yml`) — so the absence is tolerated, not
  failed.
- `Makefile` `test`, `test-ci`, `test-cov` targets all fall back to
  `echo "No ... script configured"` when the npm script is missing (FACT).

## What CI actually verifies (FACT)

| Stage | Command | Gate |
| --- | --- | --- |
| Lint | ESLint via `tools/lint/run-eslint.mjs .` | Yes |
| Typecheck | `tsc` (typecheck step) | Yes |
| Pre-commit | `pre-commit/action` (`SKIP: no-commit-to-branch`) | Yes |
| Build | `tsc -b && vite build` | Yes |
| Quality gate | Sonar scan (`chrysa/github-actions/sonar-scan-node`) | Yes (SonarCloud) |
| Tests | `test:coverage --if-present` | No (skipped, no script) |

## How to run locally (transcribed, unverified here)

```bash
npm ci            # or: make install-ci
npm run lint      # ESLint
npm run build     # tsc -b && vite build  (also the typecheck path)
npm run dev       # vite dev server
make ci           # install-ci → lint → typecheck → build
```

## Gaps & proposals

- **PROPOSAL** — Add Vitest + React Testing Library and a `test:coverage` script so the
  CI stage becomes a real gate (satisfies REQ-TECH-009). Priority targets: domain
  mappers (`src/domain/*/mapper.ts`), metric computations
  (`computeTerritoryState`, `useUsersMetrics`), and the `api/http` wrapper.
- **PROPOSAL** — Add a smoke test that runs `node scaffold.mjs` non-interactively (or a
  unit test of `parseYaml` / `gen*` functions) to protect the scaffolder itself, which
  is currently untested.
- **UNKNOWN** — Whether E2E (`template-docs/tests/e2e-scenarios.md` is a stub inherited
  by generated apps, not a suite for this repo).
