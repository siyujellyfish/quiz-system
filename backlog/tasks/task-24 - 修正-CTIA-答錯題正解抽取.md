---
id: TASK-24
title: 修正 CTIA 答錯題正解抽取
status: Done
assignee: []
created_date: '2026-06-17 02:24'
updated_date: '2026-06-17 02:27'
labels:
  - parser
  - ctia
  - quiz-data
dependencies: []
modified_files:
  - scripts/extract-questions.mts
  - src/data/ctia-questions.json
  - src/lib/quiz/parser.ts
  - src/lib/quiz/parser.test.ts
priority: high
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
修正 Google Forms 分數頁 parser，答錯題應優先使用同題區塊的「正確答案」區塊作為正解來源，避免把使用者選錯的 radiogroup data-value 寫入 CTIA 題庫。重產 CTIA 題庫並驗證來源正確性。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 parser 測試覆蓋答錯題正確答案區塊
- [x] #2 CTIA 題庫依目前來源 HTML 重產為正確答案版本
- [x] #3 CTIA JSON 與來源正確答案區塊核對無不一致
- [x] #4 pnpm validate:questions、pnpm test、pnpm lint、pnpm build 通過
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
修正 Google Forms score-page parser，答錯題會優先讀取同題「正確答案」區塊，找不到時才回退到 radiogroup data-value。重產 CTIA 題庫並保留現有移除 prompt 開頭題號規則；來源核對顯示 explicitCorrectAnswerBlocks=23、sourceAnswers=88、jsonQuestions=88、mismatchCount=0。驗證完成：pnpm validate:questions、pnpm test、pnpm lint、pnpm build 均通過。
<!-- SECTION:FINAL_SUMMARY:END -->
