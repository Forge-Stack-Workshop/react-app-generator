# ROADMAP — react-app-generator

> Only items with in-repo evidence are listed. No speculative roadmap invented.
> Tags: **FACT / INFERENCE / PROPOSAL**.

## Tracked / in-flight (FACT)

- **Issue #22** — feat: integrate chrysa CI standards (github-actions composite
  actions). Referenced in CLAUDE.md "Issues ouvertes". Partially realised: CI already
  calls `chrysa/github-actions/gitversion` and `sonar-scan-node`.
- **Managed standards distribution** — CLAUDE.md standards block is maintained by
  `distribute-standards.sh`; ongoing, external to this repo.
- **Empty `TODO` file** (FACT) — present but 0 bytes; no items.

## Recent direction (INFERENCE from `git log`)

- Heavy dependabot cadence keeping React 19 / Vite 8 / eslint 10 / typescript-eslint
  current.
- Lint-toolchain isolation (`c8c521d`) and `.npmrc legacy-peer-deps` (`f88843f`) to keep
  installs/CI green under bleeding-edge majors.
- Pre-commit detection hooks activated (`css-outside-stylesheet`, `f74b505`).

## Proposed (PROPOSAL — not committed anywhere)

1. Add a real test suite + `test:coverage` script so the CI test stage becomes a gate
   (see TESTING / REQ-TECH-009).
2. Resolve the duplicated `src/src/` tree and the `backoffice` package name (see REVIEW).
3. Reconcile npm-vs-pnpm doctrine (ADR-008).
4. Decide the status of the `src/` reference app: ship-and-lint it, or move it to an
   `examples/` folder clearly marked as a demo (it is currently ignored by root ESLint).
