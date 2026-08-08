# CLAUDE.md — react-app-generator

## Role

Reference React template for the chrysa / Forge-Stack-Workshop ecosystem.
This repo is the **source of truth** for the structure and stack of every React app in the ecosystem.


## Language Rules

- Language: English — all code, comments, documentation, instructions, and configuration files must be in English.

## Structure `src/`

```
src/
  api/          ← connector only. 1 file per resource. Types + fetch only, no business logic.
  components/   ← generic reusable UI. No business logic, no direct API calls.
  domain/       ← domain types/interfaces shared across the app.
  features/     ← self-contained vertical slices (components + feature-specific logic).
  hooks/        ← custom React hooks.
  i18n/         ← translation files and i18next configuration.
  pages/        ← 1 file per route. Orchestrates features. No direct API calls.
  styles/       ← global CSS/SCSS, variables, reset.
  utils/        ← pure utility functions (no React, no side effects).
```

## Stack

| Layer        | Tool                                          |
| ------------ | --------------------------------------------- |
| Bundler      | Vite 8                                         |
| Language     | TypeScript 7 strict                            |
| UI           | React 19                                       |
| Routing      | React Router v7                                |
| Server state | TanStack React Query v5                        |
| HTTP         | native `fetch` (typed wrapper in `api/http/`) |
| Styles       | SCSS Modules + CSS variables                  |
| Linting      | ESLint 10 + typescript-eslint + Prettier      |
| Pre-commit   | pre-commit hooks                              |

> Version note: `template.yaml` is the source of truth for what generated apps install;
> the reference app's `package.json` mirrors those majors. Keep the two in sync when bumping.

## Code rules

- Use `useQuery`/`useMutation` (React Query) for all server calls. **Never** `useEffect` for data fetching.
- `api/` = pure connector layer. Provider-agnostic (can be swapped for MSW or another backend).
- `pages/` orchestrates, does not fetch directly.
- `features/` = vertical isolation. A feature never imports from another feature.

## Scaffolder

```bash
node scaffold.mjs   # generates a new project from this template
```

The CLI prompts for: project name, output directory, package manager, features to enable.

## Feature modules

Optional functionality (i18n, theming, mock API, auth, dataTable, notifications, forms) lives
as self-contained modules under `templates/features/<id>/`, each with a `feature.yaml` manifest
and a `files/**` tree. `template.yaml` is the manifest source of truth for the base app's
dependencies and their versions (mirrored per-feature in each `feature.yaml`). Selection for a
generated project is driven by that project's `forge.config.yaml`; running
`node scaffold.mjs --sync` reads it and syncs the enabled features in place (copying/removing
files, regenerating the `*.generated.*` aggregators, reconciling `package.json`). See
[`docs/features.md`](docs/features.md) for the full catalog and the add-a-feature recipe.

## CI / Standards

- CI workflow: `.github/workflows/ci.yml`
- SonarCloud enabled (see README badges)
- pre-commit: `.pre-commit-config.yaml`
- Automatic versioning: GitVersion (`GitVersion.yml`)

## Open issues

- #22: feat — integrate the chrysa CI standards (github-actions composite actions)

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **react-app-generator** (1097 symbols, 1614 relationships, 30 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/react-app-generator/context` | Codebase overview, check index freshness |
| `gitnexus://repo/react-app-generator/clusters` | All functional areas |
| `gitnexus://repo/react-app-generator/processes` | All execution flows |
| `gitnexus://repo/react-app-generator/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
