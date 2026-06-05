# Forge-Stack React Template

[![CI](https://github.com/Forge-Stack-Workshop/react-app-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/Forge-Stack-Workshop/react-app-generator/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/Forge-Stack-Workshop/react-app-generator?sort=semver&label=release)](https://github.com/Forge-Stack-Workshop/react-app-generator/releases/latest)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Forge-Stack-Workshop_react-app-generator&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Forge-Stack-Workshop_react-app-generator)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Forge-Stack-Workshop_react-app-generator&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Forge-Stack-Workshop_react-app-generator)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Forge-Stack-Workshop_react-app-generator&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Forge-Stack-Workshop_react-app-generator)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Forge-Stack-Workshop_react-app-generator&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Forge-Stack-Workshop_react-app-generator)
[![pre-commit](https://img.shields.io/badge/pre--commit-enabled-brightgreen?logo=pre-commit)](https://github.com/pre-commit/pre-commit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A production-ready React starter built with **Vite**, **TypeScript**, **SCSS Modules** and **React Query**. Features are opt-in and selected interactively via the scaffolder.

---

## Usage

### Generate a new project

```bash
node scaffold.mjs
```

The CLI will ask for a project name, output directory, package manager, features to enable, and domain modules to scaffold.

### Use the template directly

```bash
npm install
npm run dev
```

---

## Tech stack

| Layer        | Tool                           |
| ------------ | ------------------------------ |
| Bundler      | Vite 7                         |
| Language     | TypeScript 5 (strict)          |
| UI           | React 19                       |
| Routing      | React Router v7                |
| Server state | TanStack React Query v5        |
| HTTP client  | native `fetch` (typed wrapper) |
| Styling      | SCSS Modules + CSS variables   |
| Icons        | Lucide React                   |
| Linting      | ESLint 9 + typescript-eslint   |

---

## Optional features

Selected interactively during scaffolding. Each feature adds its own dependencies and generated files.

| Feature      | Default | Adds                                                         |
| ------------ | ------- | ------------------------------------------------------------ |
| **i18n**     | ✓       | `i18next`, `react-i18next`, `LanguageSwitcher`, locale files |
| **Theming**  | ✓       | CSS variables for dark mode, `useTheme` hook, Header toggle  |
| **Mock API** | ✓       | MSW v2 — intercepts `/api/*` requests in the browser         |

---

## Project structure

```
src/
├── api/
│   ├── http/         # native fetch typed wrapper + interceptors
│   └── mock/         # MSW handlers + fixture data  [feature: mock]
├── assets/           # Static files (SVGs, images, flag icons)
├── components/
│   ├── cards/        # KpiCard
│   ├── filters/      # SearchBar
│   ├── languages/    # LanguageSwitcher              [feature: i18n]
│   ├── layouts/      # Layout, Header, Sidebar
│   ├── loaders/      # GlobalLoader (Suspense fallback)
│   ├── skeletons/    # Skeleton placeholders
│   └── ui/           # Atomic primitives (Skeleton…)
├── domain/
│   └── [entity]/     # types.ts · queries.ts · mapper.ts · index.ts
├── features/
│   └── [entity]/     # Business UI components per domain
├── hooks/
│   ├── useTheme.ts    #                              [feature: theming]
│   └── useLanguage.ts #                              [feature: i18n]
├── i18n/             # i18next config + locale JSON  [feature: i18n]
├── pages/            # One page per route (lazy-loaded)
├── styles/           # _reset · _variables · _theme · _mixins
└── utils/            # Pure helper functions
```

---

## Architecture layers

```
pages → features → domain (React Query) → api/http → backend
              ↑
          components (generic UI)
```

- **`api/http`** — transport only, no business logic
- **`domain`** — types, React Query hooks, mappers, computed values
- **`features`** — business UI consuming domain data
- **`components`** — generic, domain-agnostic UI building blocks
- **`pages`** — route shells, compose features and components

---

## Scripts

```bash
npm run dev      # Dev server with HMR
npm run build    # Type-check + production build
npm run lint     # ESLint
npm run preview  # Preview the production build
```

---

## Scaffolder manifest

[`template.yaml`](./template.yaml) is the single source of truth for:

- base dependencies
- available features and their optional dependencies
- pre-declared domain modules
- code conventions

## Documentation map

This repo follows the chrysa standardized documentation structure, and **every
generated app inherits it** (the scaffolder copies these dirs into each new project):

- `docs/` — product, architecture, security, deployment, observability (stubs)
- `ai/`, `prompts/` — AI assets & agent prompts
- `schemas/` — JSON Schema data contracts
- `workflows/` — end-to-end flow docs
- `decisions/`, `postmortems/` — decision records & incident postmortems
- `examples/` — reference “perfect” implementations (React/TS)
- `tests/` — test scenario catalogues

Files marked `status: stub` are placeholders to fill in.
