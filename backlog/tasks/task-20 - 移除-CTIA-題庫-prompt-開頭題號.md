---
id: TASK-20
title: 移除 CTIA 題庫 prompt 開頭題號
status: Done
assignee: []
created_date: '2026-06-16 06:35'
updated_date: '2026-06-16 06:36'
labels:
  - ctia
  - data
dependencies: []
modified_files:
  - src/data/ctia-questions.json
  - src/lib/quiz/questions.test.ts
priority: medium
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
依使用者要求，移除 src/data/ctia-questions.json 中每一題 prompt 最開頭的題號前綴，例如 `1. `、`41. `；只處理題幹最開頭，不影響題目內文中的編號。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 CTIA JSON 每題 prompt 開頭不再含來源題號前綴
- [x] #2 只移除 prompt 開頭題號，不修改選項或正解
- [x] #3 完成資料驗證並記錄修改檔案
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
已移除 src/data/ctia-questions.json 中 88 題 CTIA prompt 最開頭的來源題號前綴；只處理 prompt 開頭，保留題幹內部的 numbered list。同步更新 questions.test.ts，改為驗證 CTIA 載入結果不含開頭題號且保留內部清單編號。驗證：node 資料檢查顯示 total=88、remainingLeadingNumbers=0、keepsInternalList=true；pnpm test src/lib/quiz/questions.test.ts src/lib/quiz/parser.test.ts 通過 2 files / 8 tests；git diff --check 通過。
<!-- SECTION:FINAL_SUMMARY:END -->
