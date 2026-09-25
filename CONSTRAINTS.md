# CONSTRAINTS — react-app-generator

> Tags: **FACT / INFERENCE / UNKNOWN / PROPOSAL**.

## Technical constraints

- **FACT** — Scaffolder must run on plain Node with no install: `scaffold.mjs` imports
  only `node:*` built-ins and parses `template.yaml` with an in-file minimal parser.
  Constraint noted in-file: complex YAML (anchors, multiline) is unsupported — "install
  js-yaml instead".
- **FACT** — `.npmrc` sets `legacy-peer-deps=true`. **INFERENCE**: needed to install the
  reference app's deps under React 19 / bleeding-edge peer ranges (see commit
  `f88843f ci(npm): add .npmrc legacy-peer-deps=true`).
- **FACT** — Root `eslint.config.js` **ignores `src/**`**, `template-docs/**`,
  `dist`, and the MSW worker. The reference app is therefore **not** covered by the
  root ESLint config.
- **FACT** — Lint is invoked through `tools/lint/run-eslint.mjs` with a separate
  `tools/lint/eslint.config.mjs`, whose `node_modules` is committed to the repo
  (isolated lint toolchain). Origin: commit `c8c521d fix(lint): isolate eslint hook
  from TS7 to unblock typescript-eslint`. **INFERENCE**: this isolates ESLint from the
  app's TypeScript version to avoid typescript-eslint compatibility breakage.
- **FACT** — Node version in CI is `lts/*`; `npm ci` used (lockfile authoritative).

## Process / governance constraints

- **FACT** — GitFlow via GitVersion (`GitVersion.yml` workflow `GitFlow/v1`,
  `next-version: 0.1.0`); default branch here is `develop`.
- **FACT** — pre-commit enforced locally and in CI (`.pre-commit-config.yaml`,
  `pre-commit/action` in CI with `SKIP: no-commit-to-branch`).
- **FACT** — CLAUDE.md carries a `distribute-standards.sh`-managed block
  (`<!-- chrysa:standards:start ... DO NOT EDIT -->`) — the standards annexes are
  centrally distributed, not locally editable.
- **FACT (per CLAUDE.md)** — Package manager doctrine references pnpm/`pnpm-lock.yaml`
  in the managed standards block, **yet this repo commits `package-lock.json`** and CI
  runs `npm ci`. Flagged as a contradiction in REVIEW.

## Compliance / policy constraints (from managed CLAUDE.md standards)

- **FACT (stated)** — Container-runtime policy, GAFAM-independence exit strategy,
  Sentry→GitHub observability norm, and compliance targets are declared in the managed
  standards block. **UNKNOWN** — how much applies to a browser-only template repo with
  no server/containers here.

## Constraints that are absent / not applicable

- **FACT** — No Dockerfile / compose in this repo (browser template).
- **FACT** — No runtime secrets, `.env`, or credentials committed (see SECURITY).
