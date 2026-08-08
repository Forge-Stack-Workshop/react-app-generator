# templates/features

**Role.** The catalog of toggleable feature modules. Each subfolder is one
self-contained feature that the sync engine may copy into a generated
project, wire into the base app's aggregators, and reconcile into
`package.json` — driven by `forge.config.yaml`. Full behavior is documented
in [`docs/features.md`](../../docs/features.md).

## Structure

| Path | Purpose |
| --- | --- |
| `<id>/feature.yaml` | Feature manifest: id, name, description, `default` enabled state, `deps`/`devDeps`, `options`, `contributes` (routes/nav/providers/http). |
| `<id>/files/**` | The files copied into a generated project when the feature is enabled, mirroring the target `src/` layout. |

Shipped features: `auth`, `dataTable`, `forms`, `i18n`, `mock`,
`notifications`, `theming`.

## Should contain

- One folder per feature, named after its `id`.
- A `feature.yaml` manifest and a `files/**` tree per folder — nothing else
  at this level.

## Should NOT contain

- Feature-agnostic skeleton files needed by every project — those belong in
  [`templates/base/`](../base/) instead.
- Hand-maintained duplicates of the `*.generated.*` aggregator files — those
  are produced at sync time from every enabled feature's `contributes`
  section (see `docs/features.md` §5).
- Cross-feature imports. A feature's `files/**` must not import from another
  feature's `files/**` — features must stay independently toggleable.

## Rules

- `feature.yaml` `contributes.*.import` paths are written relative to
  `src/`, with no leading `./` (e.g. `features/<id>/Widget`).
- Provider/route components use a named export matching `component:` in
  `feature.yaml`. HTTP handler files export a function named after the file
  basename.
- Adding a plain feature (files + manifest) requires no engine changes —
  see the "Add-a-feature recipe" in `docs/features.md` §6, and add a case to
  `tools/scaffold/features.test.mjs`.
- `template.yaml`'s `features:` list (read by the interactive CLI) must stay
  in sync with the on-disk catalog here — same ids, same dep versions.
