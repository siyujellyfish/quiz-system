---
id: TASK-18
title: 回復 CTIA 題庫開頭題號
status: Done
assignee: []
created_date: '2026-06-16 06:19'
updated_date: '2026-06-16 06:27'
labels:
  - parser
  - ctia
  - data
dependencies: []
modified_files:
  - scripts/extract-questions.mts
  - src/lib/quiz/parser.ts
  - src/lib/quiz/parser.test.ts
  - src/lib/quiz/questions.test.ts
  - src/data/ctia-questions.json
priority: medium
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
依使用者要求，回復 CTIA 題庫 prompt 保留來源題號前綴，例如 1.、41.；移除先前針對 CTIA 題幹開頭題號的 stripping 流程，並加入測試防止再次移除。CSA v2 題庫維持現況。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 CTIA JSON 第一題 prompt 以 1. 開頭
- [x] #2 CTIA 第 41 題 prompt 保留 41. 開頭
- [x] #3 CTIA 題目內部清單或步驟編號維持原文
- [x] #4 extract、targeted tests、full tests、lint、build 驗證完成
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
回復 CTIA 題庫保留來源開頭題號；重新執行題庫抽取後 CTIA JSON 已恢復第一題 1. 前綴，並新增測試覆蓋第一題、第 41 題與題內清單編號。驗證：pnpm test src/lib/quiz/parser.test.ts src/lib/quiz/questions.test.ts、pnpm test、pnpm lint、pnpm build 通過；pnpm build 在 sandbox 內曾因 Turbopack binding port 權限失敗，非 sandbox 重跑通過。
<!-- SECTION:FINAL_SUMMARY:END -->
