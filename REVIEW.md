# REVIEW — react-app-generator

Documentation-pass review. Findings are observations for the owner; **no code was
changed**. Tags: **FACT / INFERENCE / PROPOSAL**.

## Contradictions & anomalies

1. **Duplicated nested `src/src/` tree (FACT, HIGH housekeeping impact)**
   119 tracked files live under `src/src/` mirroring `src/` (e.g. `src/src/App.tsx`,
   `src/src/domain/...`). This looks like an accidental copy. It inflates the repo,
   confuses tooling, and risks divergence. Owner should decide which tree is canonical
   and remove the other (out of scope for this docs mission).

2. **`package.json` name is `backoffice` (FACT)**
   The root `package.json` `"name": "backoffice"` and `version: "0.0.0"`, while the repo
   is `react-app-generator` and `template.yaml` meta name is `forge-react-template`.
   Inconsistent identity.

3. **`src/` is not linted by the root config (FACT)**
   `eslint.config.js` ignores `src/**`. The reference app therefore escapes the root
   ESLint gate (lint runs via `tools/lint/run-eslint.mjs .` but the app tree is
   excluded). Confirm this is intentional (demo code) or fix coverage.

4. **CI references tests that do not exist (FACT)**
   `test:coverage` is called with `--if-present` and silently skipped; there is no test
   script and 0 test files. The green "tests" impression is misleading.

5. **npm vs pnpm doctrine mismatch (FACT)**
   Repo uses npm (`package-lock.json`, `npm ci`, `.npmrc legacy-peer-deps`) while the
   managed CLAUDE.md standards block references a pnpm doctrine. Unreconciled (ADR-008).

6. **CLAUDE.md language vs its own rule (FACT)**
   "Language Rules" mandate English on disk, but the CLAUDE.md body (Role, Structure,
   Règles de code, Scaffolder) is largely in French. Minor; either relax the rule for
   docs or translate.

7. **Two `HalfDonutGauge` locations (FACT, minor)**
   Both `components/charts/HalfDonutGauge.tsx` and
   `components/charts/HalfDonutGauge/HalfDonutGauge.tsx` exist. Possible duplication —
   verify which is imported.

8. **Vendored `tools/lint/node_modules` (FACT)**
   Committed dependency tree; enlarges the repo and audit surface (see SECURITY, LOW).

## Documentation debt

- `template-docs/**` are chrysa doc stubs for *generated* projects, not this repo's own
  filled docs — correct by design, but easy to mistake for real specs.
- No filled `docs/architecture.md` etc. at repo level before this pass; these new root
  docs (`ARCHITECTURE.md`, `REQUIREMENTS.md`, …) address that.
- Backend/API contract for generated apps is **UNKNOWN** (only MSW mocks exist here).

## Strengths (FACT)

- Clean, well-documented layered architecture with per-folder `README.md`.
- Dependency-free, self-contained scaffolder.
- Solid CI/release automation (GitVersion, git-cliff, Sonar, pre-commit, dependabot).
- No secrets committed.

## Suggested priority (PROPOSAL)

1. Remove the `src/src/` duplicate. 2. Fix `package.json` name. 3. Add tests or drop the
CI test stage. 4. Clarify `src/` demo status + lint coverage. 5. Reconcile package-manager
doctrine.
