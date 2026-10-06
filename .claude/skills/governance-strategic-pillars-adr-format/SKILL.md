---
name: governance-strategic-pillars-adr-format
description: "Procedure: Governance — strategic pillars & ADR format. Use when this procedure is needed."
---

Five non-negotiables hold across every chrysa project, whatever the stack. Breaking one
requires an ADR with a kill-test, not a shrug.

1. **LLM-provider independence** — no vendor SDK in business code; inference goes through a
   local port with **≥2 real, tested adapters** (e.g. Claude + a local model). A prompt that
   only works on one vendor is a bug, not a feature. **"Local model" means a model running on
   the machine or self-hosted** — an interpreter/weights the owner runs (Ollama, llama.cpp, a
   vLLM/TGI server on chrysa infrastructure), never a third-party hosted API dressed up as
   "local". The independence is only proven when one of the tested adapters needs no external
   provider to answer. **Every LLM call — internal or external — goes through the `chrysa-LLM`
   gateway**, never a vendor SDK or raw provider endpoint called directly from a product's
   business code. `chrysa-LLM` *is* the local port of this pillar made concrete across the
   fleet: it owns provider selection and the ≥2 tested adapters, and it is the one place where
   routing, fallback, prompt/model/version pinning, evaluation, cost and token budgets, caching,
   rate limiting and observability live (satisfying the *AI feature is evaluated* and *agent
   actions are governed* obligations once, not per repo). A product calls it as a **versioned
   contract** through a thin local adapter (*projects talk through versioned contracts only*)
   and degrades to a documented no-AI / fallback mode when it is unreachable — it never reaches
   a model by any other path. A direct call to Claude, OpenAI, Ollama, or any inference endpoint
   that bypasses `chrysa-LLM` is a defect, not a shortcut; the single documented exception is
   `chrysa-LLM` itself, which owns the real adapters. Products built *on top of* the gateway —
   e.g. `ai-aggregator`, a showcase/front consuming `chrysa-LLM` — are consumers of this
   contract, not alternative gateways: they route through `chrysa-LLM` like everything else and
   never re-implement provider access. This is the transport-level application of *no code
   duplication* and *external servers addressed through the environment*: the gateway's endpoint
   arrives by env, and the adapters exist once, there.
2. **GAFAM independence** — every managed-cloud dependency has a documented self-hosted exit
   path; the cloud SDK stays confined to an adapter (`BlobStore`, not `S3Client`).
3. **Portable personalisation data** — all user/personal data is exportable to an open format
   (JSON/SQLite) by a documented command; `export → import → export` is idempotent (tested).
   A stored-but-unexportable field needs an ADR.
4. **k8s config in-project** — manifests live in `deploy/k8s/` of the repo; nothing exists
   only inside a running cluster.
5. **Adaptation layer** — no third-party lib/API/service is imported by the domain directly;
   it goes through an adapter whose port is written in the domain's language, not the vendor's.

**ADR format (refutable).** Any structural decision — new external dependency, LLM/cloud
provider choice, breaking public-API change, data-model change, or a pillar exception — gets
one ADR under `docs/adr/` (series named in the local `CLAUDE.md`). Beyond the classic fields,
every chrysa ADR carries three that make it falsifiable:

- **Fatal hypothesis** — the single, falsifiable belief whose falsity invalidates the decision.
  One only; about the real world (cost, latency, a third party), not an internal intention.
- **Kill-test** — the observable, dated signal that proves it wrong: what to measure, which
  threshold, when checked, what happens on breach. Mechanised as a test where possible.
- **Validation gate** — the pre-agreed condition that unlocks the next step, written *before*
  building.

`Killed` is a valid ADR status: the kill-test fired and the hypothesis was false. A corpus with
no `Killed` entry has kill-tests that are too lax. Scaffold a new record with `/adr-new`.
<!-- chrysa:standards:end -->
