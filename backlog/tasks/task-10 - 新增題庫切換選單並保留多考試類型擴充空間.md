---
id: TASK-10
title: 新增題庫切換選單並保留多考試類型擴充空間
status: Done
assignee: []
created_date: '2026-06-16 00:15'
updated_date: '2026-06-16 00:21'
labels:
  - quiz
  - frontend
dependencies: []
modified_files:
  - src/lib/quiz/types.ts
  - src/lib/quiz/banks.ts
  - src/lib/quiz/bank-selection.ts
  - src/lib/quiz/bank-selection.test.ts
  - src/app/page.tsx
  - src/components/quiz/quiz-app.tsx
priority: medium
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
在既有 CSA v2 刷題系統中補齊題庫 registry、題庫選取儲存與 UI 切換選單，讓目前 CSA v2 題庫可被選取，並讓未來不同考試類型可以透過新增 bank definition 擴充。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 題庫資料以 bank definition 管理，預設 CSA v2 全題庫仍載入 100 題
- [x] #2 練習模式、錯題模式、模擬測驗可依目前選取題庫運作
- [x] #3 切換題庫時會重置該模式作答狀態，避免題目與答案狀態混用
- [x] #4 題庫選取可用 localStorage 依模式保存，且未知或移除的題庫 id 會回退預設題庫
- [x] #5 測試、lint、build 驗證完成並更新任務紀錄
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented a question bank registry and mode-specific localStorage bank selection. The active tab controls which bank the selector edits, so practice, mistakes, and exam can keep independent selected banks. Changing a bank resets only that mode's in-progress state. Current bank definition includes CSA v2 all questions and supports future exam types or subsets via bank definitions.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added question bank switching for the CSA quiz app. Introduced typed bank definitions, resolved bank loading, localStorage-backed per-mode selection, and a top toolbar selector in the quiz UI. Practice, mistakes, and exam now operate against their selected bank while preserving the existing CSA v2 100-question default. Verification: pnpm test passed 7 files / 17 tests; pnpm lint passed; pnpm build passed outside sandbox after Turbopack local worker port binding was allowed; curl -I http://localhost:3000 returned 200 OK.
<!-- SECTION:FINAL_SUMMARY:END -->
