---
id: TASK-23
title: 新增題庫 validate 指令
status: Done
assignee: []
created_date: '2026-06-17 02:05'
updated_date: '2026-06-17 02:07'
labels:
  - validation
  - quiz-data
dependencies: []
modified_files:
  - package.json
  - scripts/validate-questions.mts
  - src/lib/quiz/question-validation.ts
  - src/lib/quiz/question-validation.test.ts
priority: high
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
新增可重跑的題庫 JSON 品質檢查指令，驗證 CSA v2、CTIA、EDRP 題庫題數與基本資料結構，避免題庫匯入或格式化後發生靜默資料退化。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 提供 pnpm validate:questions 指令
- [x] #2 驗證三個題庫 JSON 的題數、唯一題目 ID、每題 4 個選項與單一正解
- [x] #3 驗證空白題幹與空白選項會回報錯誤
- [x] #4 驗證邏輯有 Vitest 覆蓋
- [x] #5 pnpm test、pnpm lint、pnpm build 通過
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
新增 pnpm validate:questions 指令，透過純函式驗證三份題庫 JSON 的題數、題目 ID 唯一性、題幹/選項非空、每題 4 選項與單一正解。補上 Vitest 覆蓋並完成 pnpm validate:questions、pnpm test、pnpm lint、pnpm build 驗證。
<!-- SECTION:FINAL_SUMMARY:END -->
