# templates

**Role.** The source trees the scaffolder (`scaffold.mjs`) copies from to
produce a generated project. Split into an always-emitted skeleton and a
catalog of opt-in feature modules.

## Structure

| Path | Purpose |
| --- | --- |
| `base/` | The always-emitted, hand-written application skeleton — copied into every generated project regardless of which features are enabled. See [`base/README.md`](./base/README.md). |
| `features/<id>/` | Toggleable feature modules — copied only when enabled in `forge.config.yaml`. See [`features/README.md`](./features/README.md). |

## Should contain

- `base/` and `features/` — nothing else at this level.

## Should NOT contain

- Files meant to be edited directly in *this* repo's own `src/` app — this
  tree is scaffolder input, not the reference app itself.
- Generated/aggregator output (`*.generated.*`) — those are produced at sync
  time, never committed here.

## Rules

- See [`docs/features.md`](../docs/features.md) for the full feature-module
  engine documentation: the catalog, `forge.config.yaml` format, CLI usage,
  how aggregators wire features together, and how to add a feature.
- Text files under either tree may use `{{token}}` placeholders
  (`projectName`, `apiBaseUrl`, `timeout`, feature options); `.json` files
  are always copied raw (see `docs/features.md` §7).
