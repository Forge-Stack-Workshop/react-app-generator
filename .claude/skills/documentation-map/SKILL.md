---
name: documentation-map
description: "Procedure: Documentation map. Use when this procedure is needed."
---

Root docs generated for this repo (facts tagged FACT/INFERENCE/UNKNOWN inside each):

- `ARCHITECTURE.md` — purpose, scaffolder flow, reference-app layers, integrations.
- `REQUIREMENTS.md` — REQ-PROD / REQ-TECH matrix with evidence pointers.
- `CONSTRAINTS.md` — technical/process/governance constraints (zero-dep scaffolder, lint isolation, npm/pnpm, GitFlow).
- `DECISIONS.md` — ADR-001..008 (rationale UNKNOWN where unrecorded).
- `TESTING.md` — CI stages vs the absent test suite; how to run.
- `SECURITY.md` — secret scan (clean) + LOW findings for the owner.
- `ROADMAP.md` — tracked (#22) + proposals; no invented roadmap.
- `GLOSSARY.md`, `REVIEW.md` — terms; contradictions & housekeeping debt.

Note: `template-docs/**` are doc stubs copied into *generated* projects, not this repo's own specs.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **react-app-generator** (1097 symbols, 1614 relationships, 30 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.
