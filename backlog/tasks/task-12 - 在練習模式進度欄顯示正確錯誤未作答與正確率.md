---
id: TASK-12
title: 在練習模式進度欄顯示正確錯誤未作答與正確率
status: Done
assignee: []
created_date: '2026-06-16 00:33'
updated_date: '2026-06-16 00:35'
labels:
  - frontend
  - quiz
dependencies: []
modified_files:
  - src/lib/quiz/practice-stats.ts
  - src/lib/quiz/practice-stats.test.ts
  - src/components/quiz/quiz-app.tsx
priority: medium
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
在主要練習模式右側進度欄加入兩列統計：第一列顯示正確/錯誤/未作答題數，第二列顯示正確率，分母為已作答題數。錯題模式維持現有顯示。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 練習模式提交答案後立即更新正確、錯誤、未作答題數
- [x] #2 正確率以 正確題數 / 已作答題數 計算，未作答時顯示 0%
- [x] #3 重新洗牌與切換練習題庫會清空本輪統計
- [x] #4 錯題模式不顯示此練習統計區塊
- [x] #5 新增統計純函式測試並完成 pnpm test、pnpm lint、pnpm build 驗證
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Added calculatePracticeStats to derive correct, incorrect, unanswered, answered count, and answered-only accuracy from practice answers. Practice mode now stores the current round's answer results, clears them on reshuffle/bank switch via resetPractice, and passes stats into PracticePanel. Mistakes mode does not pass stats, so its progress panel remains unchanged.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented practice-mode progress statistics. The progress panel now shows one row for 正確/錯誤/未作答 and one row for 正確率 using 正確題數 / 已作答題數. Added pure-function tests for empty, mixed, and zero-question rounds. Verification: pnpm test passed 9 files / 21 tests; pnpm lint passed; pnpm build passed outside sandbox after Turbopack local worker port binding was allowed.
<!-- SECTION:FINAL_SUMMARY:END -->
