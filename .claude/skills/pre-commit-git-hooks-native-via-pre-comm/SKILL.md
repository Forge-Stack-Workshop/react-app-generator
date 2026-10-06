---
name: pre-commit-git-hooks-native-via-pre-comm
description: "Procedure: Pre-commit & git hooks (native, via pre-commit.com — never wrapped in make). Use when this procedure is needed."
---

The enforcement engine is **[pre-commit](https://pre-commit.com/)** itself, configured
in `.pre-commit-config.yaml`. pre-commit is the authoritative runner; `make lint` /
`make pre-commit` may exist as thin convenience aliases, but a hook that only runs
through `make` is a defect — every hook MUST be runnable via `pre-commit run` directly,
and CI invokes `pre-commit`, not `make`.

- **Every git hook goes through the framework — no hand-rolled hooks.** A repo's hooks are
  declared as pre-commit hook ids in `.pre-commit-config.yaml` and installed by
  `pre-commit install --hook-type pre-commit --hook-type commit-msg --hook-type pre-push`.
  Hand-written scripts committed under `.git/hooks/` or a repo-local `hooks/` wired via
  `core.hooksPath`, alternative runners (**husky**, **lefthook**, **overcommit**, npm
  `prepare` hook installers), and checks reachable only through `make` or a bespoke
  `scripts/*.sh` are **forbidden**: a gate that is not a pre-commit hook id is not
  discoverable, not pinned, not skippable per-hook (`SKIP=`), and not runnable in CI the
  same way. A repo-specific check is a `repo: local` hook in the config (or a hook published
  by `chrysa/pre-commit-tools`), not a script bolted onto git. The single sanctioned
  exception is the host-global pre-push (`dotfiles/git-hooks-global/pre-push`), which is
  machine-level, not repo-level, and itself only invokes `pre-commit`.
- **The gate is host-native — no strong coupling to the project's containers.** pre-commit
  runs with only `pre-commit` installed on the host (via `pipx`/`uv`, outside any repo); it
  provisions each hook's isolated environment itself (`~/.cache/pre-commit`), so a commit
  needs **no project image and no running container**. Local hooks are `language: system` /
  `python` (or another native language) invoking **host** tools — **never** `docker compose
  run`, and `language: docker` / `language: docker_image` is **forbidden**. A check that
  genuinely needs the project image (Django settings, a DB, a compiled tool) **degrades gracefully on the host**:
  it probes for the tool and skips with a message when absent
  (`command -v <tool> >/dev/null 2>&1 && <run> || echo 'skipping — runs in CI/Docker'`),
  it does **not** spin up a container. Container-side enforcement is CI's job; locally the
  gate is best-effort and never blocks on the Docker daemon being up. This does not
  contradict the container-runtime policy — the *application* runs in a container; the
  *commit gate*, like git, is a host tool.
- **Two stages, two scopes — do not mix them:**
  - **commit stage** (`pre-commit run`, default): auto-fixers + fast lints —
    `ruff`, `end-of-file-fixer`, `trailing-whitespace`, `detect-secrets`/`gitleaks`,
    `conventional-pre-commit` (commit-msg), `no-commit-to-branch --branch main`.
    These **mutate** the tree, so they only ever run over the staged/committed diff.
  - **pre-push stage** (`pre-commit run --hook-stage pre-push`): only hooks tagged
    `stages: [pre-push]` (e.g. `regression-gate` from `chrysa/pre-commit-tools`), run
    **natively over the pushed commit range** (`--from-ref <remote>` `--to-ref <local>`).
    A push **verifies, it never mutates** the tree.
- **Forbidden at push time:** `make lint`, and `pre-commit run --all-files`. Running the
  full tree at push re-executes commit-stage **auto-fixers** on unrelated files, mutates
  them, exits non-zero, and **rejects the push over a pre-existing defect in a file you
  never touched**. `--all-files` belongs to CI (where a mutation surfaces as a diff) and
  to a deliberate local audit — never to the push gate.
- **The global pre-push hook** (`dotfiles/git-hooks-global/pre-push`) mirrors pre-commit's
  own installed pre-push hook: it runs the `pre-push` stage over the range only, then the
  SonarCloud quality gate. No `make`, no `--all-files`, no tree mutation.
- **The shared hook package is Docker-free by construction.** `chrysa/pre-commit-tools`
  — the hook-decentralisation package the whole fleet consumes — publishes every hook as
  `language: python` (or another native pre-commit language) with its dependencies declared
  in the hook definition. **Forbidden in that package:** `language: docker`,
  `language: docker_image`, and any `docker` / `docker compose` invocation inside a hook
  entrypoint. A published hook MUST run identically on a host where Docker is not installed
  at all; if a check cannot work without the daemon, it is a CI job, not a hook. This keeps
  the fleet gate installable with a single `pipx install pre-commit` and immune to the
  daemon being down.
- Hooks are **pinned by `rev`**; shared hooks come from `chrysa/pre-commit-tools`.
  `detect-secrets`/`gitleaks` respect the repo's secret allowlist.
- **Hook logic is centralised in `chrysa/pre-commit-tools` — `repo: local` is glue only.**
  Every gate is declared in `.pre-commit-config.yaml`, and any hook carrying real logic
  is published as a versioned hook id in `chrysa/pre-commit-tools`, consumed by `rev`.
  `repo: local` is reserved for genuinely repo-specific glue (a path check tied to this
  repo's layout) and stays a few lines; it is never a home for a check other repos could
  want. As with GitHub Actions, the **second occurrence of the same hook anywhere in the
  fleet is an extraction order**, not a copy: it moves to `chrysa/pre-commit-tools` and
  both repos consume it from there. A hook duplicated across repos cannot be fixed once,
  drifts silently, and is the reason a fleet-wide rule change costs sixty pull requests
  instead of one.
