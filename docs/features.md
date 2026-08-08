# Feature modules

This document describes the config-driven feature-module engine: what a
feature is, the shipped catalog, how to select features, the CLI commands
that generate or sync a project, how the aggregators wire features into the
base app, and how to add a new feature.

## 1. Overview

A **feature** is a self-contained folder under `templates/features/<id>/`
made of exactly two things:

- `feature.yaml` — the feature's manifest: id, name, description, default
  enabled state, runtime/dev dependencies, options, and what it
  **contributes** (routes, nav entries, providers, HTTP hooks).
- `files/**` — the files the feature copies into a generated project,
  mirroring the target `src/` layout (e.g. `files/features/auth/LoginPage.tsx`
  is copied to `src/features/auth/LoginPage.tsx`).

Feature selection is driven by `forge.config.yaml`, a small YAML file that
lives at the root of a **generated** project (not in this repo). It lists
which feature ids are enabled, and optionally their per-feature options.

Running a sync (fresh generation or `--sync`) reads that config, then:

1. Copies the always-emitted `templates/base/**` skeleton (see
   [`templates/README.md`](../templates/README.md)).
2. Copies the `files/**` tree of every **enabled** feature into the project.
3. Regenerates the four aggregator files (`*.generated.*`) from the
   `contributes` sections of the enabled features.
4. Reconciles `package.json` `dependencies`/`devDependencies` — adding what
   enabled features need, removing what only disabled features needed.
5. Persists `.forge/state.json`, which tracks which features are applied and
   a content hash per file, so a later sync can tell an untouched file from
   a hand-edited one.

Only the **enabled** feature folders are ever copied — disabling a feature
in `forge.config.yaml` and re-running `--sync` removes its files (see
[§7](#7-in-place-addremove-semantics)).

## 2. The feature catalog

Seven features ship today. Source: each `templates/features/<id>/feature.yaml`.

| id | description | default | deps | devDeps | contributes |
| --- | --- | --- | --- | --- | --- |
| `i18n` | i18next, browser language detection, LanguageSwitcher component | `true` | `i18next`, `react-i18next`, `i18next-browser-languagedetector` | — | providers |
| `theming` | CSS variables for dark mode, `useTheme` hook, Header toggle | `true` | — | — | providers |
| `mock` | Mock Service Worker — intercepts `/api/*` requests in the browser | `true` | — | `msw` | providers |
| `auth` | Login page, token storage, protected routes, `useAuth`, 401 handling | `false` | — | — | routes, providers, http |
| `dataTable` | Sortable, client-paginated generic table wired for any row type | `false` | — | — | *(none)* |
| `notifications` | Toast notifications, a global error boundary, and 403/500 error pages | `false` | — | — | providers, routes |
| `forms` | react-hook-form + zod typed forms with a Form wrapper and Field components | `false` | `react-hook-form`, `zod`, `@hookform/resolvers` | — | *(none)* |

Exact version ranges live in each feature's `feature.yaml` and are mirrored
in `template.yaml`'s `features:` list, which the interactive CLI
(`node scaffold.mjs` with no flags) reads to build its prompt. Keep the two
in sync when adding a feature or bumping a dependency version.

## 3. `forge.config.yaml` format

A generated project's `forge.config.yaml` looks like this:

```yaml
project: my-app
packageManager: pnpm
features:
  i18n:
    languages: [fr, en]
  theming: true
  mock: true
  auth: false
  dataTable: false
  notifications: false
  forms: false
```

- `project` — the project name (used for tokens like the page `<title>`).
- `packageManager` — printed back in the "install" reminder after a sync.
- `features` — a map of feature id to either:
  - `true` / `false` — enable or disable the feature with its default
    options, or
  - an object — enable the feature and override its `options` (e.g. `i18n`'s
    `languages` list). Any key not overridden falls back to the feature's
    `feature.yaml` `options` defaults.

A feature id that is `false`, omitted, or absent from the map is disabled.

## 4. CLI usage

```text
node scaffold.mjs                 Interactive project generation
node scaffold.mjs --out DIR --name NAME --features a,b,c
                                   Non-interactive fresh generation of a
                                   complete, installable project
node scaffold.mjs --sync          Sync features into an existing project
                                   (reads forge.config.yaml)
```

Options:

- `--help` — show the help text and exit.
- `--out <dir>` — target project directory (fresh-gen: created; `--sync`:
  defaults to the current working directory).
- `--name <name>` — project name for fresh generation (default: `my-app`).
- `--features <a,b,c>` — comma-separated feature ids to enable for fresh
  generation, e.g. `i18n,theming,mock,auth,dataTable,notifications,forms`.
- `--sync` — non-interactive: read `forge.config.yaml` and sync enabled
  features into the project (add/remove files, reconcile deps).
- `--force` — overwrite locally-edited files instead of warning and
  skipping them.

### Fresh generation

```bash
node scaffold.mjs --out ../my-app --name my-app --features i18n,theming,mock,auth
cd ../my-app
pnpm install
```

This creates the target directory, writes the root config files
(`package.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`), a
`forge.config.yaml` reflecting the requested features, then copies the base
skeleton and the enabled features into it.

### Adding or removing a feature in place

1. Edit `forge.config.yaml` in the generated project — flip a feature to
   `true`/`false`, or add/adjust its options.
2. Run the sync from inside (or pointing `--out` at) that project:

   ```bash
   node scaffold.mjs --sync --out ../my-app
   ```

3. Run `<packageManager> install` (the command prints the exact reminder,
   e.g. `pnpm install`) — enabling or disabling a feature changes
   `package.json` dependencies.

## 5. How the aggregators wire features into the base app

Each feature's `feature.yaml` may declare a `contributes` section with up to
four kinds:

- `routes` — `{ path, import, component }` entries.
- `nav` — `{ label, to }` entries.
- `providers` — `{ import, component }` entries, wrapped around the app in
  declaration order.
- `http` — `{ responseErrorHandler: <import> }` entries.

At sync time, `tools/scaffold/aggregate.mjs` collects these from every
**enabled** feature (sorted by feature id for determinism) and writes four
files into the generated project:

| Generated file | Built from `contributes.` |
| --- | --- |
| `src/app/routes.generated.tsx` | `routes` |
| `src/app/nav.generated.ts` | `nav` |
| `src/app/providers.generated.tsx` | `providers` |
| `src/api/http/hooks.generated.ts` | `http` |

`templates/base/**` (`src/app/router.tsx`, `src/main.tsx`,
`src/api/http/client.ts`, …) imports from these four generated files.

**These `*.generated.*` files are tool-owned.** They are rewritten on every
sync and carry an `AUTO-GENERATED by scaffold.mjs — do not edit` banner — do
not hand-edit them; any change would be silently overwritten on the next
`--sync`.

## 6. Add-a-feature recipe

No engine change is needed to add a plain feature — the sync engine reads
the on-disk catalog (`templates/features/*`) dynamically.

1. Create `templates/features/<id>/feature.yaml`:

   ```yaml
   id: <id>
   name: Human-readable name
   description: One-line description
   default: false
   deps:
     - some-package@^1.2.3
   devDeps: []
   options: {}
   contributes:
     providers:
       - import: features/<id>/Widget
         component: Widget
   ```

2. Create `templates/features/<id>/files/**`, mirroring the target `src/`
   layout the same way the other features do (e.g.
   `files/features/<id>/Widget.tsx`, `files/hooks/use<Thing>.ts`).

3. **Import-path convention:** every `contributes.*.import` path is written
   relative to `src/`, with **no leading `./`** — e.g.
   `features/<id>/Widget`, not `./features/<id>/Widget` or
   `src/features/<id>/Widget`. The aggregator re-bases it for whichever
   directory the generated file actually lives in.

4. Provider and route components must use a **named export** matching the
   `component:` value in `feature.yaml` (the aggregator imports
   `{ ComponentName }`, aliased to avoid collisions between features).

5. An HTTP handler file (for `contributes.http`) must export a function
   whose name matches the file's basename — the aggregator imports it by
   that name (e.g. `features/auth/onUnauthorized.ts` exports
   `onUnauthorized`).

6. Add a case to `tools/scaffold/features.test.mjs` exercising the new
   feature through the real `sync()` function against the real
   `templates/features` catalog (see the existing `describe("i18n feature
   module", …)` block for the shape: enable the feature via a config
   object, assert the expected files exist, assert dependencies land in
   `package.json`, and — if it contributes anything — assert the aggregator
   output contains the expected import/wiring).

That's it — no changes to `tools/scaffold/*.mjs` are required for a feature
that only contributes files, providers, routes, or an HTTP handler.

## 7. In-place add/remove semantics

Per-project state lives in `.forge/state.json` (created on first sync) and
tracks, per applied feature id, the list of files it wrote and a SHA-256
hash of each file's rendered content.

- **Enabled, not yet applied** → the feature's `files/**` are copied in
  (text files token-rendered, see below), its deps/devDeps are added to
  `package.json`, and it is recorded in `.forge/state.json`.
- **Applied, no longer enabled** → its owned files are deleted, **unless**
  the current on-disk content no longer matches the recorded hash (i.e. a
  human edited the file after it was generated). In that case the file is
  left alone and a warning is printed (`"<id>/<path> was edited; not
  deleting (use --force)"`). Pass `--force` to delete it anyway.
- Dependencies that are no longer required by any enabled feature are
  removed from `package.json`; a dependency still required by another
  enabled feature is kept.
- **`.json` files are always copied raw — never token-rendered.** This is
  deliberate: i18next locale files use the same double-brace syntax
  (`{{count}}`, `{{total}}`, …) for their own runtime interpolation, and
  rendering them at scaffold time would collide with and corrupt that
  syntax. Every other recognized text file extension (`.ts`, `.tsx`,
  `.scss`, `.md`, `.html`, `.css`, `.txt`, `.yaml`, `.yml`) gets
  `{{token}}` substitution (`projectName`, `apiBaseUrl`, `timeout`, plus any
  feature option values). Files with other extensions are copied as-is
  (binary-safe).
