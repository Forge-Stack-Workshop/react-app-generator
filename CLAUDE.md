# CLAUDE.md — react-app-generator

## Role

Template React de référence pour l'écosystème chrysa / Forge-Stack-Workshop.
Ce repo est la **source de vérité** pour la structure et le stack de toutes les apps React de l'écosystème.


## Language Rules

- Language: English — all code, comments, documentation, instructions, and configuration files must be in English.
## Structure `src/`

```
src/
  api/          ← connecteur seul. 1 fichier/ressource. Types + fetch uniquement, pas de logique métier.
  components/   ← UI générique réutilisable. Pas de logique métier, pas d'appels API directs.
  domain/       ← types/interfaces domaine partagés à travers l'app.
  features/     ← tranches verticales auto-contenues (composants + logique propre à la feature).
  hooks/        ← hooks React personnalisés.
  i18n/         ← fichiers de traduction et configuration i18next.
  pages/        ← 1 fichier par route. Orchestre les features. Pas d'appels API directs.
  styles/       ← CSS/SCSS globaux, variables, reset.
  utils/        ← fonctions pures utilitaires (pas de React, pas d'effets).
```

## Stack

| Couche       | Outil                                         |
| ------------ | --------------------------------------------- |
| Bundler      | Vite 7                                        |
| Langage      | TypeScript 5 strict                           |
| UI           | React 19                                      |
| Routing      | React Router v7                               |
| Server state | TanStack React Query v5                       |
| HTTP         | native `fetch` (typed wrapper in `api/http/`) |
| Styles       | SCSS Modules + CSS variables                  |
| Linting      | ESLint 9 + typescript-eslint + Prettier       |
| Pre-commit   | pre-commit hooks                              |

## Règles de code

- Utiliser `useQuery`/`useMutation` (React Query) pour tous les appels serveur. **Jamais** `useEffect` pour du data fetching.
- `api/` = couche connecteur pur. Agnostique du provider (peut être remplacé par MSW ou un autre backend).
- `pages/` orchestre, ne fetch pas directement.
- `features/` = isolation verticale. Une feature n'importe pas depuis une autre feature.

## Scaffolder

```bash
node scaffold.mjs   # génère un nouveau projet depuis ce template
```

Le CLI demande : nom du projet, répertoire de sortie, package manager, features à activer.

## CI / Standards

- CI workflow : `.github/workflows/ci.yml`
- SonarCloud activé (voir badges README)
- pre-commit : `.pre-commit-config.yaml`
- Versioning automatique : GitVersion (`GitVersion.yml`)

## Issues ouvertes

- #22 : feat — intégrer les chrysa CI standards (github-actions composite actions)

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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
