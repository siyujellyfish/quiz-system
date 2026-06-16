---
id: TASK-13
title: 匯入 CTIA 題庫並加入題庫切換
status: Done
assignee: []
created_date: '2026-06-16 01:59'
updated_date: '2026-06-16 02:03'
labels:
  - quiz
  - parser
  - data
dependencies: []
modified_files:
  - scripts/extract-questions.mts
  - src/lib/quiz/parser.ts
  - src/lib/quiz/parser.test.ts
  - src/lib/quiz/questions.ts
  - src/lib/quiz/questions.test.ts
  - src/lib/quiz/banks.ts
  - src/lib/quiz/banks.test.ts
  - src/data/csa-v2-questions.json
  - src/data/ctia-questions.json
priority: high
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
分析 CTIA Google Forms HTML 匯出，修正 parser 對說明項與 score-page 正解區塊的處理，產出 CTIA 題庫 JSON，並將 CTIA 全題庫加入現有題庫切換系統。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 CTIA HTML 可解析為 88 題，每題 4 選項且 1 個正解
- [x] #2 Parser 不再跨 data-item-id 區塊誤配正解，CTIA 第 41 題正解為 Network interface card (NIC)
- [x] #3 抽取腳本可產出 CSA v2 與 CTIA 的獨立題庫 JSON
- [x] #4 題庫 registry 同時提供 CSA v2 全題庫與 CTIA 全題庫
- [x] #5 完成 pnpm extract:questions、pnpm test、pnpm lint、pnpm build 驗證
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Implemented CTIA import by generalizing the Google Forms score-page parser. The parser now filters out non-question description items and scopes score-page answer extraction to the current data-item-id block so answers do not cross into the next question. The extraction script now writes separate CSA v2 and CTIA JSON files. Question loaders expose CSA v2 and CTIA datasets, and getQuizBanks now returns both CSA v2 全題庫 and CTIA 全題庫.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Imported CTIA as a second quiz bank. CTIA parses to 88 validated single-answer questions, with the description item skipped and scoped answer extraction verified by CTIA question 41 id 803033495 resolving to Network interface card (NIC). Generated src/data/csa-v2-questions.json and src/data/ctia-questions.json, kept the legacy CSA loader behavior, and added CTIA to the existing bank switcher. Verification: pnpm extract:questions extracted 100 CSA and 88 CTIA questions; pnpm test passed 9 files / 26 tests; pnpm lint passed; pnpm build passed outside sandbox after Turbopack local worker port binding was allowed.
<!-- SECTION:FINAL_SUMMARY:END -->
