# base

**Role.** The always-emitted, hand-written application skeleton. The sync engine
copies every file under `templates/base/**` verbatim (after `{{token}}` substitution)
into every generated project, regardless of which features are enabled.

## Structure

| Path                            | Purpose                                                             |
| ------------------------------- | ------------------------------------------------------------------ |
| `index.html`                    | Vite entry HTML. `{{projectName}}` fills the `<title>`.            |
| `src/main.tsx`                  | Mounts React, wraps `<App />` in `QueryClientProvider` + `FeatureProviders`. |
| `src/App.tsx`                   | Renders the router via `RouterProvider`.                           |
| `src/app/router.tsx`            | Hand-written router; spreads `featureRoutes` from `routes.generated`. |
| `src/app/BaseLayout.tsx`        | Minimal feature-agnostic shell exposing an `<Outlet />`.           |
| `src/app/NotFound.tsx`          | Base 404 route element.                                            |
| `src/styles/**`                 | Global SCSS: reset, base CSS-variable palette, mixins.            |
| `src/api/http/client.ts`        | Typed `fetch` wrapper; runs `responseErrorHandlers` from `hooks.generated`. |
| `src/api/http/interceptors.ts`  | Request/error hook stubs.                                          |

## Should contain

- Feature-agnostic skeleton files needed by every generated app.
- References to the four sync-time aggregators (`routes.generated`,
  `nav.generated`, `providers.generated`, `hooks.generated`) — these files do
  **not** exist inside `templates/base`; they are produced at sync time.

## Should NOT contain

- Feature-specific code (i18n, theming, mock server, demo pages/features) — that
  belongs under `templates/features/<feature>/` instead.
- The `*.generated.*` aggregator files — they are emitted by the sync engine.

## Rules

- Tokenize project-specific literals with `{{projectName}}`, `{{apiBaseUrl}}`,
  `{{timeout}}`. Only tokens the sync engine provides may appear.
- This tree does **not** typecheck in isolation — the `*.generated` imports are
  absent until a project is synced. Full compilation is validated on a synced project.
- React 19 + React Router v7 (data router) + React Query v5 + SCSS modules.
