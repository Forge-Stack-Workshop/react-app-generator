# tools/lint

**Role.** Self-contained ESLint toolchain, isolated from the project's build
dependencies. It pins TypeScript to `<6.1` — the range `typescript-eslint`
officially supports — so linting works even though the project builds on
TypeScript 7 (which `typescript-eslint` cannot parse yet).

## Structure

| Path                | Purpose                                                        |
| ------------------- | ------------------------------------------------------------- |
| `package.json`      | Pinned lint deps (`eslint`, `typescript-eslint`, `typescript@5.9.3`, plugins). |
| `package-lock.json` | Lockfile for reproducible `npm ci`.                           |
| `eslint.config.mjs` | Flat config, mirror of the root `../../eslint.config.js`.     |
| `run-eslint.mjs`    | Runner: installs this toolchain on first use, then runs ESLint from the repo root. |

## Why it exists

`typescript-eslint@8` requires `typescript >=4.8.4 <6.1.0`. The project pins
`typescript@~7.x` for its build (fleet standard). Running ESLint against the
project's own `node_modules` crashes at load time
(`Cannot read properties of undefined (reading 'Cjs')`). Keeping the lint
TypeScript here, separate from the build TypeScript, resolves that without
downgrading the build.

## Consumers

- `npm run lint` → `node tools/lint/run-eslint.mjs .`
- pre-commit `eslint` hook (`.pre-commit-config.yaml`) → `node tools/lint/run-eslint.mjs <files>`

## Rules

- `eslint.config.mjs` must stay in sync with the root `../../eslint.config.js`.
- Keep `typescript` here `<6.1.0` until `typescript-eslint` ships stable TS7
  support; then this whole folder can be removed and the root config used directly.
- `node_modules/` here is git-ignored and installed on demand by `run-eslint.mjs`.
