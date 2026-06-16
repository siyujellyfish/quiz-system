---
id: TASK-11
title: 將網頁標題改為通用刷題系統
status: Done
assignee: []
created_date: '2026-06-16 00:25'
updated_date: '2026-06-16 00:27'
labels:
  - frontend
  - copy
dependencies: []
modified_files:
  - src/lib/quiz/product-copy.ts
  - src/lib/quiz/product-copy.test.ts
  - src/app/layout.tsx
  - src/app/page.tsx
priority: medium
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
依使用者要求，將產品層級標題改為「刷題系統」，讓 CSA v2 只作為其中一個題庫/考試類型呈現。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 瀏覽器 metadata title 顯示為「刷題系統」
- [x] #2 首頁 H1 顯示為「刷題系統」，不再是「CSA v2 刷題系統」
- [x] #3 首頁輔助文案不把 CSA v2 當作整個產品名稱
- [x] #4 CSA v2 題庫名稱、examType 與題庫選單顯示維持不變
- [x] #5 新增或更新測試覆蓋產品層級文案，並完成 lint/test/build 驗證
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Centralized product-level copy in productCopy so metadata and the homepage hero use the same generic app title. Kept CSA v2 naming inside question bank definitions and bank selector display only.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Changed the app-level title from CSA v2-specific wording to the generic title 「刷題系統」. Added product copy constants and a Vitest regression test so the product title remains generic while CSA v2 stays a bank/exam type. Verification: product-copy test passed; pnpm test passed 8 files / 18 tests; pnpm lint passed; pnpm build passed outside sandbox after Turbopack local worker port binding was allowed.
<!-- SECTION:FINAL_SUMMARY:END -->
