# SECURITY — react-app-generator

> Docs-only review. No code was modified. HIGH/CRITICAL findings are flagged for the
> owner to fix; nothing here is a fix. Tags: **FACT / INFERENCE / UNKNOWN**.

## Secret scan (FACT)

- **No secrets, keys, tokens, passwords, or credentials found** in tracked source,
  config, fixtures, or workflows.
- The only matches for "token/secret" are:
  - `secrets.SONAR_TOKEN` / `secrets.GITHUB_TOKEN` in `.github/workflows/ci.yml` — the
    **correct** GitHub Actions pattern (referenced, never inlined). OK.
  - Auth-token handling shown as **commented example code** in `scaffold.mjs`
    (`onRequest` interceptor: `localStorage.getItem("token")` → `Authorization: Bearer`).
    This is generated boilerplate guidance, not a live secret.
  - `js-tokens` is a transitive npm package name in lockfiles. Not a secret.

## Surface & risk posture

- **FACT** — This is a **browser-only** template repo: no server, no database, no
  container, no runtime secret store here. Attack surface for this repo itself is
  limited to the build/scaffolder toolchain and CI.
- **INFERENCE (LOW)** — Generated apps that adopt the commented interceptor pattern
  would store auth tokens in `localStorage` (XSS-exfiltration risk in the *consumer*
  app). This is a template-guidance concern, not a vulnerability in this repo. Owner may
  wish to document httpOnly-cookie alternatives in the generated `api/http` comments.

## Supply chain / toolchain notes

- **FACT** — `.npmrc` sets `legacy-peer-deps=true`; peer-dependency conflicts are
  bypassed at install. **INFERENCE (LOW)** — masks incompatible peer ranges; keep an eye
  on it as React/Vite majors move.
- **FACT** — `tools/lint/node_modules/` is committed to the repo (vendored lint
  toolchain). **INFERENCE (LOW)** — committed `node_modules` enlarges the audit surface
  and can drift from advisories; dependabot covers root deps but not this vendored tree
  (verify). Not a secret exposure.
- **FACT** — CI pins actions (`actions/checkout@v7`, `actions/setup-node@v7`,
  `pre-commit/action@v3.0.1`) and uses centralised `chrysa/github-actions/*@main`.
  **INFERENCE (LOW)** — `@main` on internal actions is unpinned to a SHA; standard for
  the ecosystem but worth noting.

## Findings summary

| Severity | Finding | Action |
| --- | --- | --- |
| — | No committed secrets | None |
| LOW | Generated interceptor suggests `localStorage` token storage | Owner: document safer alternative in template |
| LOW | `legacy-peer-deps=true` bypasses peer checks | Owner: monitor |
| LOW | Vendored `tools/lint/node_modules` not audited by dependabot | Owner: verify audit coverage |

**No HIGH or CRITICAL findings.**
