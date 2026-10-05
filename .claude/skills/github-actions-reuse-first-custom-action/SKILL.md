---
name: github-actions-reuse-first-custom-action
description: "Procedure: GitHub Actions (reuse first · custom actions centralised · thin workflows). Use when this procedure is needed."
---

CI is assembled from **existing actions**, not written. A workflow is glue — checkout,
setup, invoke the repo's own gate (`pre-commit`, `make ci`) — and every line of logic it
carries is a line that lives in the wrong repo. A pipeline has one job: **tell the truth
about the code, fast, without becoming a codebase of its own**. Full rules, with ids and a
review checklist: annexe [`CI-CD.md`](https://github.com/chrysa/shared-standards/blob/main/standards/annexes/CI-CD.md)
(`CI-000`…`CI-053`) — pipeline architecture, supply-chain pinning, least privilege,
cost/latency, what the gate must prove, feedback.

Five of its rules are load-bearing enough to state here:

- **Every repo runs CI, and every deployable product ships CD** (`CI-006`, `CI-047`). There is
  no repository without a pipeline: CI runs the repo's own gate (`make ci` / `pre-commit`) on
  every push and PR, scaled to the `runtime:` tier. A deployable product (`runtime: container`)
  or a published library delivers through an **automated, environment-gated** pipeline — never a
  laptop deploy — and what CD ships **announces its version** in production (the `/version`
  endpoint + admin surface already required below).
- **A red check means the code is wrong** (`CI-040`). A gate that fails because a repo is not
  onboarded, a tool is missing or billing lapsed trains everyone to ignore red — and the next
  real failure is ignored too. Fix it or remove it the day it appears.
- **A skipped job reports as skipped, never as passed** (`CI-032`). Path filters may skip work;
  they must never turn a required check green without running it. A tick that means "not
  executed" destroys trust in the whole pipeline.
- **Build once, promote the artefact** (`CI-046`). The image digest that was tested is the one
  deployed; rebuilding per environment means production runs something no test ever saw.
- **Every job declares `timeout-minutes:` and every PR workflow a concurrency group**
  (`CI-030`, `CI-031`) — cancelling superseded PR runs, and explicitly **not** cancelling
  deployments.

- **Reuse before writing — always.** The first choice is a **maintained public action**
  (`actions/checkout`, `actions/setup-python`, `actions/setup-node`, `astral-sh/setup-uv`,
  `docker/build-push-action`, `SonarSource/*`, `pypa/gh-action-pypi-publish`, …).
  Re-implementing in a `run:` block something a maintained action already does — caching,
  toolchain setup, publishing, artifact upload — is a defect. Preferring a hand-rolled
  script because "it's shorter" is not a reason.
- **The only home for chrysa-specific actions is `chrysa/github-actions`.** When no public
  action fits, the behaviour becomes a composite action / reusable workflow in that repo
  (`python-setup`, `ruff-check`, `run-tests`, `sonar-scan`, `publish-python-package`, …)
  and consumers reference it: `uses: chrysa/github-actions/<action>@<rev>`. Reusable
  workflow templates live in `shared-standards/workflows/` and are distributed, never
  hand-forked.
- **Repo-local actions are forbidden by default.** No `.github/actions/**` composite in a
  product repo, no inline bash beyond glue, no `scripts/ci-*.sh` that exists only to be
  called by a workflow. The **second occurrence of the same CI logic anywhere in the fleet
  is an extraction order**, not a copy: it moves to `chrysa/github-actions` and both repos
  consume it. A repo-local action is tolerated only as a short-lived spike, with an issue
  tracking its migration.
- **Keep the code minimal.** A job step is a `uses:` or a one-line `run:`. A `run:` block
  past ~15 lines, or any conditional/parsing/retry logic, does not belong in YAML — it
  becomes a tested entrypoint inside the action repo (Python preferred, testable), not a
  heredoc. Duplicated near-identical jobs collapse into a `strategy.matrix`; shared setup
  collapses into a composite action. Workflow YAML is not a programming language and is
  not covered by any test.
- **Pinning & permissions.** Third-party actions are pinned by **commit SHA** (with the
  version in a trailing comment); `chrysa/github-actions` and `actions/*` by tag.
  Workflows declare least-privilege `permissions:` (read by default, `packages:write` /
  `contents:write` only on the job that needs it), never a plaintext PAT where the
  workflow `GITHUB_TOKEN` or OIDC works. Dependabot keeps the `github-actions` ecosystem
  up to date.
- **Secrets are passed explicitly — `secrets: inherit` is banned.** A reusable workflow
  receives only the secrets it actually uses, named one by one under `secrets:`
  (`secrets: {SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}}`). `secrets: inherit` hands the
  callee the caller's entire secret store, so a compromised or careless step reaches
  credentials it was never meant to see, and no one can tell from the call site which
  secrets a workflow consumes. The same rule applies to steps: scope `env:` to the step
  that needs the value, never to the job or the workflow when a single step uses it. A
  workflow whose secret list is not readable at the call site is a defect.
