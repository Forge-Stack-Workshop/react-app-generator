# GLOSSARY — react-app-generator

| Term | Meaning (in this repo) |
| --- | --- |
| Scaffolder | `scaffold.mjs`, the interactive Node CLI that generates a new project from `template.yaml`. |
| Template manifest | `template.yaml` — declares base deps, opt-in features, domains, conventions. |
| Feature (opt-in) | A toggleable capability in the manifest: `i18n`, `theming`, `mock`. |
| Domain | A business entity module (`domain/<entity>`) with `types.ts`, `queries.ts`, `mapper.ts`, `index.ts`. Sample domains: `shuttles`, `users`, `territories`. |
| Feature slice | A self-contained vertical UI unit under `features/` (e.g. `kpis`, `monitoring/map`). Does not import from another feature. |
| `api/http` | Pure transport layer: typed `fetch` wrapper + interceptors, no business logic. |
| `api/mock` | MSW handlers + static fixtures serving `/api/*` in the browser. |
| MSW | Mock Service Worker — intercepts network requests; enabled by the `mock` feature. |
| React Query | TanStack Query v5 — the only server-state mechanism (`useQuery`/`useMutation`). |
| SCSS Module | Component-scoped stylesheet (`*.module.scss`) + shared partials in `styles/`. |
| template-docs | The chrysa documentation skeleton copied into every generated project. |
| Reference app / backoffice | The working dashboard sample under `src/` (package name is `backoffice`). |
| GitVersion | Tool computing automatic SemVer under GitFlow (`GitVersion.yml`). |
| git-cliff | Changelog generator configured by `cliff.toml`. |
| chrysa standards block | The `distribute-standards.sh`-managed section of `CLAUDE.md`. |
| GitNexus | Code-intelligence index referenced in `CLAUDE.md` / `AGENTS.md`. |
