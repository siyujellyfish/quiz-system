---
id: TASK-14
title: 初始化 Git 並準備 0.1 beta GitHub 發布
status: Done
assignee: []
created_date: '2026-06-16 02:17'
updated_date: '2026-06-16 02:31'
labels:
  - release
  - github
dependencies: []
priority: high
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
重寫 README 以符合目前刷題系統內容，更新 package metadata 為 0.1.0-beta.1，完成 release 驗證，初始化 Git、建立本地 tag/source archive，並在 GitHub auth 可用時建立公開 repo 與 release。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 README 移除 Next.js 範本內容並說明目前 CSA v2 與 CTIA 多題庫刷題系統
- [x] #2 package.json name/version 更新為 quiz-system / 0.1.0-beta.1 且保留 private true
- [x] #3 完成 pnpm extract:questions、pnpm test、pnpm lint、pnpm build 驗證
- [x] #4 本地 Git repository 初始化完成並建立初始 commit 與 v0.1.0-beta.1 tag
- [x] #5 產出 source zip，且不包含 node_modules、.next、.pnpm-store
- [x] #6 若 gh auth 可用則建立公開 GitHub repo 與 release；若不可用則明確記錄阻塞點
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
author: Codex
created: 2026-06-16 02:30
---
Release validation completed with mise-managed Node 24 using pnpm 11.5.1. Because pnpm attempted a run-time dependency status check that failed on the store SQLite database in this sandbox, commands were executed as `mise exec -- pnpm --config.verify-deps-before-run=false run <script>`. Results: extraction produced CSA 100 questions and CTIA 88 questions; Vitest passed 9 files / 26 tests; ESLint passed; production build passed outside sandbox after Turbopack failed inside sandbox due process/port binding restrictions. GitHub CLI is installed, but `gh auth status` reports account `siyujellyfish` has an invalid token, so remote repo/release creation is blocked until re-authentication.
---
<!-- COMMENTS:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Completed local 0.1 beta release preparation.

Release verification:
- `mise exec -- pnpm --config.verify-deps-before-run=false run extract:questions` extracted 100 CSA v2 questions and 88 CTIA questions.
- `mise exec -- pnpm --config.verify-deps-before-run=false run test` passed 9 test files / 26 tests.
- `mise exec -- pnpm --config.verify-deps-before-run=false run lint` passed with no ESLint errors.
- `mise exec -- pnpm --config.verify-deps-before-run=false run build` passed outside the sandbox; the sandboxed run was blocked by Turbopack process/port binding restrictions.

Git/release state:
- Repository initialized on `main`.
- Local release tag: `v0.1.0-beta.1`.
- Source archive: `quiz-system-v0.1.0-beta.1-source.zip`, generated from the release tag and verified to exclude `node_modules/`, `.next/`, and `.pnpm-store/`.

GitHub release status:
- `gh auth status` reports account `siyujellyfish` has an invalid token. Public GitHub repository and release creation are blocked until `gh auth login -h github.com` is completed.
<!-- SECTION:FINAL_SUMMARY:END -->
