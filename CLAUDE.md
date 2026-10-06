@AGENTS.md

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

<!-- chrysa:standards:start · managed by distribute-standards.sh · DO NOT EDIT -->
# chrysa — Transverse Standards

These conventions are identical across every chrysa repo. Repo-specific rules live in the
local `CLAUDE.md`; this file is the shared baseline imported by it.

## Normative annexes

This file is the **only** artifact inlined into consumer repos. The annexes below are
**equally normative** — they detail rules stated here in short form. They are not inlined;
read them at
`https://github.com/chrysa/shared-standards/blob/main/standards/annexes/`.
Where an annexe and this file disagree, **this file wins**.

| Annexe                    | Scope                                                          |
| ------------------------- | -------------------------------------------------------------- |
| `FRONTEND.md`             | TypeScript config & rules · React layering · frontend architecture · frontend tests |
| `ARCHITECTURE-DDD.md`     | project profiles · DDD levels · layers & aggregates · Python & C#/.NET structure |
| `AGENTIC-CAPABILITIES.md` | agent actions: manifests, risk R0–R5, sandboxing, audit trail   |
| `PROJECT-DECOUPLING.md`   | inter-project contracts, forbidden linkages, degradation        |
| `CONTAINERS-K3S.md`       | reference stage shape · container responsibility · k3s workload baseline |
| `DATA-MIGRATIONS.md`      | data ownership & classification · versioned schemas · safe migrations · rollback · retention/export |
| `OBSERVABILITY-OPS.md`    | probes · OpenTelemetry (replaceable backend) · alerts+runbooks · SLI/SLO · resource envelope · `/version` · production-ready gate |
| `API-CONTRACTS.md`        | machine-readable contract · versioning & deprecation · typed errors · cursor pagination · idempotency · contract tests · events/webhooks |
| `TESTING.md`              | common test levels and rules across languages                   |
| `CI-CD.md`                | pipeline architecture · action pinning · least privilege · cost · what the gate proves |
| `GOVERNANCE.md`           | rule identity, maturity ladder, enforcement rollout, sources of truth |

**Source of truth:** the canon lives in this repo. Notion is a governance and decision view
of the standards corpus, not its authority (`GOVERNANCE.md` GV-000). `chrysa/standards` is
deprecated and archived — nothing is added to it, nothing reads from it.

## Cross-cutting stack (settled ADRs — do not relitigate)

| Layer            | Decision                                                        |
|------------------|----------------------------------------------------------------|
| Python           | 3.14 target (CI matrix 3.12 + 3.14)                            |
| FastAPI          | >= 0.115 + Pydantic v2                                          |
| Frontend         | React 19 + TypeScript 7 + Vite 8                                |
| UI               | shadcn/ui + Tailwind CSS                                        |
| State            | TanStack Query + Zustand                                        |
| DB               | PostgreSQL 16 + Redis 7                                         |
| ORM              | SQLAlchemy 2.0 async + Alembic                                  |
| Auth             | Cluster SSO (OIDC) → external OAuth → local (bcrypt) · MFA-capable |
| i18n             | react-i18next + fastapi-babel · FR + EN from V1                 |
| Monorepo         | Turborepo + pnpm workspaces                                     |
| Versioning       | [GitVersion](https://gitversion.net/) (semantic auto — never bump manually) |
| Quality CI       | SonarCloud (0 hotspot · rating A)                               |
| Linting          | Ruff + Mypy (Python) · ESLint (TS)                             |
| Pre-commit       | detect-secrets + ruff + mypy + commitlint                      |
| Error handling   | withErrorHandling() → auto GitHub Issue on failure             |
| Hosting          | Kimsufi · Docker Compose (local) · Nginx · Certbot · Tailscale  |
| Monitoring       | Sentry + Uptime Kuma (self-hosted)                            |
| Agents           | Claude API (primary) · Ollama (fallback)                       |
| Orchestration    | LangGraph (stateful) · PydanticAI (structured outputs)         |
| Registry         | GHCR private `ghcr.io/chrysa/{repo}` — never public            |
| Docs             | MkDocs → GitHub Pages (`pages.yml`) · ADRs in `docs/adr/`       |
| Changelog        | [git-cliff](https://git-cliff.org/) (`cliff.toml`) · Keep a Changelog |

## Non-negotiable conventions

Follow the /non-negotiable-conventions skill.
## Quality gates

- Test coverage **>= 85%** by default. A repo may override upward, never below 80%.
- Lint warnings: **0**. Mypy clean. SonarCloud rating **A**, 0 security hotspot.
- Max function lines 50 · max file lines 500 · cyclomatic complexity heuristic <= 10.
- **Performance and cost budgets are declared per profile and enforced.** Frontend bundle,
  Docker image size, startup time, memory, CPU, latency, throughput, storage and log volume
  each carry a budget; AI paths additionally budget tokens, cost, latency, concurrency and
  cache. CI measures them and **blocks significant regressions** (info → warning → error); an
  overrun carries a justification, an impact measurement and a reduction plan — never a silent
  pass. Detail: annexe `CI-CD.md` CI-053.

## Design system

Follow the /design-system skill.
## Makefile targets

Follow the /makefile-targets skill.
## Container-runtime policy

A project runs **only in a container** unless its nature genuinely forbids it. Convenience, "easier
on the host", or "it's just a script" are **not** exemptions — when in doubt, classify `container`.
Every repo carries a `runtime:` field in `repos.yml`, machine-checked by `audit-docker-compliance.sh`:

- `container` — runs as a service. Provides Dockerfile(s) + `docker-compose*` + `HEALTHCHECK` +
  `docker-up`/`docker-down`/`docker-test` targets.
- `exempt:lib` — distributed/imported (library, plugin, pre-commit hook, GitHub Action, CLI). Runs
  in the consumer's environment; provides a `docker-test` target (CI runs the suite in a container).
- `exempt:config` — no executable runtime (config, knowledge base, deploy manifests). Nothing to run.
- `exempt:native` — bound to a host OS, device, cloud platform, or editor (desktop integration,
  hardware, Apps Script, VS Code extension, infra/Helm). Optional `Dockerfile.test` for CI.
- `pending` — pre-code scaffold; flips to `container` at first code.

## Release & changelog config (canonical)

- **Versioning** is GitVersion (`GitVersion.yml`, flat `mode: ContinuousDeployment`) — never bump
  manually. Legacy v5 schemas (`GitHubFlow`, no top-level `mode:`) are incompatible and must be
  **replaced**, not version-bumped.
- **Changelog** is generated by [git-cliff](https://git-cliff.org/) (`cliff.toml`), Keep a
  Changelog format, from Conventional Commits — a non-conventional message is silently
  absent from the changelog, which is why the commit convention is a commit-gate hook.
- `GitVersion.yml` and `cliff.toml` are **canonical files** with a single source of truth in
  shared-standards (repo root + byte-identical `templates/` copy). A `repo: local` pre-commit hook
  (`gitversion-canonical-drift`, `cliff-canonical-drift`) blocks drift; `audit-canonical-conformance.sh`
  audits the fleet.
- **Docs** live in `docs/` (MkDocs), deployed to GitHub Pages via `pages.yml`. `README.md` reflects
  the actual current state and is updated on each release.
- **Registry** — application images publish to **private GHCR** (`ghcr.io/chrysa/{repo}`, tags mirror
  the git tag + `:latest`); CI authenticates with the workflow `GITHUB_TOKEN` (or least-privilege
  `packages:write`), never a plaintext PAT. Distributable libraries publish to public PyPI via
  Trusted Publishing (OIDC), never a token in plaintext.

## GitHub Actions (reuse first · custom actions centralised · thin workflows)

Follow the /github-actions-reuse-first-custom-action skill.
## Pre-commit & git hooks (native, via pre-commit.com — never wrapped in make)

Follow the /pre-commit-git-hooks-native-via-pre-comm skill.
## Shared skills (load on demand from shared-standards/.claude/skills/)

- `testing-pytest` — pytest DDD + pytest-mock + constants (writing tests)
- `dockerfile-multistage` — 4-stage Python 3.14 containers (editing Dockerfile)
- `api-design` — REST standards + FastAPI patterns (designing endpoints)
- `async-patterns` — async FastAPI + SQLAlchemy async sessions (async code)
- `clean-architecture` — FastAPI module/layer structure (adding a feature)
- `error-handling` — FastAPI errors + Sentry + logging (handling errors)
- `contract-testing` — library contract / breaking-change tests (@chrysa/* releases)
- `agent-patterns` — LangGraph + PydanticAI + Claude API (building agents)
- `ui-ux` — UX/UI/ergonomics + WCAG 2.1 AA + dark mode + i18n (human-facing surfaces)
- `accessibility` — per-disability-category contract + testable DoD (any surface, incl. public micro-sites)

## Error handling pattern (all automations)

```text
try:    fn()
except: gh issue create --title "[chrysa] failure" --label "chrysa-error"
```

## Observability — Sentry → GitHub issues (norm)

Every status:dev repo ships a Sentry project, and **a new Sentry issue automatically opens a
GitHub issue** via Sentry's native GitHub integration. No relay, no PAT in the repo — the
integration owns the link, so a Sentry issue maps to exactly one GitHub issue (no duplicates).

Mechanism: a per-project Sentry **issue alert rule** with
condition `FirstSeenEventCondition` (a new issue is created) and action
`GitHubCreateTicketAction` targeting `chrysa/<repo>`, labels `sentry`, `bug`.
Provision it across all projects with
`shared-standards/scripts/sentry-github-issues.sh` (idempotent, `--dry-run` first).

Per-project activation checklist:

1. Org GitHub integration installed once in Sentry (Settings → Integrations → GitHub) with
   access to the chrysa repos.
2. The repo has a Sentry project whose slug matches the repo name.
3. The auto-issue alert rule exists (run the provisioning script, or add it in
   Alerts → Create Alert → Issues → action "Create a GitHub issue").
4. The GitHub repo has a `sentry` label (CI label sync provides it).

## Session lifecycle (primer + memory + hindsight)

A repo **may** carry a session lifecycle so an AI agent keeps context across sessions. The
substance is a set of **committed files**, not a required Make target — the convention below is
what matters; any `make`/slash-command wrappers are an **optional convenience** provided where a
repo has them, not a universal socle target every Makefile must expose.

- `primer.md` (committed) — current state, what to do NOW; read **before** `CLAUDE.md`.
- `.claude/memory/session.md` — volatile session notes, **not** committed (reset each session).
- `.claude/memory/decisions.md`, `known-issues.md`, `progress.md` (append-only history) — committed.
- **Session start** — surface the primer + git context + open PRs (a `prepare` wrapper where present).
- **Session end** — update `primer.md` + `progress.md`, clear `session.md` (a `hindsight` wrapper
  where present), optional Obsidian export.

> **Not a mandated Make target.** `memory-init` / `prepare` / `hindsight` are convenience
> wrappers, not part of the canonical Makefile socle contract (*Makefile targets*), and are not
> assumed to exist in every repo. A repo governs its session state through the committed files
> above; the wrappers and their scripts are added per repo when useful.

## Compliance targets

The fleet is held to two external compliance frameworks. Neither is a separate corpus — each
is operationalised by rules already in this canon; declaring the target names the obligation
those rules must satisfy, and certification is a governance program on top, not a code change.

- **GDPR / RGPD — by construction.** Every product that touches personal data records its
  lawful basis and purpose, minimises and time-bounds what it stores, keeps PII out of logs
  and test data, and supports export / rectification / erasure by a documented command. This
  is *per-person data implies a user account* and *portable personalisation data* applied to a
  legal obligation. Detail: annexe `GOVERNANCE.md` GV-040.
- **ISO/IEC 27001 — the security baseline.** Information security is a governed, documented
  ISMS, not ad-hoc practice. Access control, cryptography, logging and audit, operations and
  change control, supplier security, and incident management each map onto an existing canon
  rule (cluster SSO & session security, secrets handling, observability & audit trail, CI
  gates & protected `main`, project decoupling & supply-chain pinning, typed/contained errors),
  so conformance is reached by satisfying those — not a parallel checklist. The organizational
  artefacts ISO 27001 also demands (ISMS scope, risk assessment & treatment, Statement of
  Applicability, internal audit) are a versioned governance backlog under `docs/`. Detail:
  annexe `GOVERNANCE.md` GV-041.

## Governance — strategic pillars & ADR format

Follow the /governance-strategic-pillars-adr-format skill.
