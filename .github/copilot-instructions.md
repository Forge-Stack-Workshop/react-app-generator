# react-app-generator — GitHub Copilot Instructions

## Mandatory Workflow

1. Read `.github/instructions/*.instructions.md` when present.
2. Read `CLAUDE.md` for repository context.
3. Follow repository-local conventions before writing code.

## Project Context

**Stack:** TypeScript
**Purpose:** [![CI](https://github.com/Forge-Stack-Workshop/react-app-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/Forge-Stack-Workshop/react-app-generator/actions/workflows/ci.yml).

## Engineering Rules

- Write in English: code, comments, docs, issues, PRs and commits.
- Keep changes minimal and aligned with the existing style.
- Do not add unrelated refactors or speculative improvements.
- Prefer make targets when available instead of invoking tooling ad hoc.
- Never commit secrets, credentials or environment-specific values.

## Claude Interoperability

- This repository is also prepared for Claude Code via `.claude/` and `CLAUDE.md`.
- Claude skills are available under `.claude/skills/` for relevant tasks.
- If a task has repository instructions, those instructions override generic defaults.

## Quality Thresholds

- Max function length: 50 lines when practical.
- Max file length: 500 lines when practical.
- Max cyclomatic complexity: 10.
- Lint warnings target: 0.
