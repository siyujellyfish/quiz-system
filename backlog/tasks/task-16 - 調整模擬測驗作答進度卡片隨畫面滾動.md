---
id: TASK-16
title: 調整模擬測驗作答進度卡片隨畫面滾動
status: Done
assignee: []
created_date: '2026-06-16 06:05'
updated_date: '2026-06-16 06:08'
labels:
  - ui
  - exam
  - layout
dependencies: []
modified_files:
  - src/components/quiz/exam-layout.ts
  - src/components/quiz/exam-layout.test.ts
  - src/components/quiz/quiz-app.tsx
priority: medium
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
讓模擬測驗桌面版的作答進度、提交測驗與提交後分數卡片在長題目列表滾動時維持可見，同時保留手機版一般文件流與既有 light/dark 樣式。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 模擬測驗桌面版作答進度/提交測驗卡片使用 lg sticky 行為並隨 viewport 保持可見
- [x] #2 手機版不使用 fixed/sticky bottom 行為且不遮住題目或選項
- [x] #3 避免 ExamPanel 外層 overflow-hidden 破壞 sticky 行為
- [x] #4 提交後分數卡片沿用同一個隨畫面滾動容器
- [x] #5 現有模擬測驗答題、進度、提交與計分邏輯不變
- [x] #6 pnpm test、pnpm lint、pnpm build 已執行並處理結果
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Adjusted the ExamPanel layout so the exam progress/submit/result sidebar uses a shared class with lg:sticky lg:top-6 lg:self-start and no fixed positioning, keeping mobile in normal flow. Replaced the exam card overflow-hidden wrapper with an explicit overflow-visible class and rounded the exam header so sticky descendants are not clipped while the card presentation remains intact. Added a focused Vitest layout contract test for the overflow and desktop-only sticky behavior. Verification: CI=true pnpm test src/components/quiz/exam-layout.test.ts passed 1 file/2 tests; CI=true pnpm test passed 11 files/32 tests; CI=true pnpm lint exited 0; CI=true pnpm build completed successfully.
<!-- SECTION:FINAL_SUMMARY:END -->
