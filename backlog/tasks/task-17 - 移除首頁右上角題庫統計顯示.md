---
id: TASK-17
title: 移除首頁右上角題庫統計顯示
status: Done
assignee: []
created_date: '2026-06-16 06:12'
updated_date: '2026-06-16 06:15'
labels:
  - frontend
  - copy
dependencies: []
modified_files:
  - src/app/page.tsx
  - src/app/page.test.tsx
  - vitest.config.ts
priority: medium
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
依使用者要求，移除首頁右上角顯示的題數、題庫組數與考試類型統計，不影響實際題庫切換與刷題功能。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 首頁右上角不再顯示「題庫」、「題庫組」、「考試類型」統計卡片
- [x] #2 題庫切換選單與各模式刷題功能維持可用
- [x] #3 新增或更新測試覆蓋此首頁顯示調整，並完成相關驗證
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Removed the homepage hero summary card that showed question count, bank count, and exam type count in the upper-right header area. Kept ThemeSwitch and the QuizApp bank data flow intact, added a page-level regression test for the removed labels, and added Vitest alias resolution for existing @/* imports. Verification: pnpm test src/app/page.test.tsx failed before the UI change on the existing 「題庫」 label, then passed after the change; CI=true pnpm test passed 12 files / 33 tests; CI=true pnpm lint exited 0; CI=true pnpm build passed outside the sandbox after the sandboxed run failed on Turbopack worker port binding.
<!-- SECTION:FINAL_SUMMARY:END -->
