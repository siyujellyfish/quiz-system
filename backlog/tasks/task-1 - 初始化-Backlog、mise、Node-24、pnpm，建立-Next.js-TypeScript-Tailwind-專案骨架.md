---
id: TASK-1
title: 初始化 Backlog、mise、Node 24、pnpm，建立 Next.js + TypeScript + Tailwind 專案骨架
status: Done
assignee: []
created_date: '2026-06-15 07:03'
updated_date: '2026-06-15 07:10'
labels: []
dependencies: []
priority: high
ordinal: 1000
---

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Backlog initialized in backlog/ with filesystem-only MCP setup
- [x] #2 .mise.toml pins Node 24
- [x] #3 Project uses pnpm and has pnpm-lock.yaml
- [x] #4 Next.js TypeScript Tailwind app scaffold exists
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-06-15 07:10
---
Verification: backlog task list --plain succeeded after init; .mise.toml exists and mise exec reports node 24.16.0; pnpm install succeeds using project .npmrc store-dir=.pnpm-store; pnpm-lock.yaml and src/app/page.tsx exist.
---
<!-- COMMENTS:END -->
