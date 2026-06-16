---
id: TASK-19
title: 修復題目分行顯示失效
status: Done
assignee: []
created_date: '2026-06-16 06:31'
updated_date: '2026-06-16 06:33'
labels:
  - ui
  - quiz
  - bug
dependencies: []
modified_files:
  - src/components/quiz/quiz-app.tsx
  - src/components/quiz/quiz-app.test.tsx
priority: medium
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
題目 prompt 內的換行字元目前在畫面顯示時被 HTML whitespace collapse，需保留題幹原始分行以提升長題可讀性，且不破壞題庫資料抽取。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 題目 prompt 內的換行在主要測驗畫面可被保留顯示
- [x] #2 選項文字如含換行也可被保留顯示
- [x] #3 資料抽取與題庫載入仍保留原始換行字元
- [x] #4 targeted tests、full tests、lint、build 驗證完成
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
修復題目分行顯示失效：確認 CTIA 題庫 JSON 原本保留 \n，根因是題幹與選項直接以一般 HTML 文字節點顯示，瀏覽器會折疊換行。已在練習/錯題/模擬測驗的題幹、選項與正解文字加入 whitespace-pre-line，並新增 QuizApp server-render 測試覆蓋多行題幹與選項。驗證：pnpm test src/components/quiz/quiz-app.test.tsx、pnpm test src/lib/quiz/parser.test.ts src/lib/quiz/questions.test.ts、pnpm test、pnpm lint、pnpm build 通過；pnpm build 在 sandbox 內仍因 Turbopack binding port 權限失敗，非 sandbox 重跑通過。
<!-- SECTION:FINAL_SUMMARY:END -->
