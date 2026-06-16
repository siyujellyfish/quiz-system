---
id: TASK-15
title: 清理失效檔案並加入 Dark Mode Switch
status: Done
assignee: []
created_date: '2026-06-16 05:51'
updated_date: '2026-06-16 05:58'
labels:
  - cleanup
  - theme
  - ui
dependencies: []
modified_files:
  - README.md
  - public/file.svg
  - public/globe.svg
  - public/next.svg
  - public/vercel.svg
  - public/window.svg
  - src/app/globals.css
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/components/quiz/quiz-app.tsx
  - src/components/theme/theme-init-script.tsx
  - src/components/theme/theme-switch.tsx
  - src/components/ui/button.tsx
  - src/components/ui/card.tsx
  - src/components/ui/progress.tsx
  - src/components/ui/tabs.tsx
  - src/data/questions.json
  - src/lib/quiz/questions.test.ts
  - src/lib/quiz/questions.ts
  - src/lib/theme/theme.test.ts
  - src/lib/theme/theme.ts
priority: medium
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
移除失效題庫與未引用 Next 預設資產，刪除 legacy getQuizQuestions shim 與測試，並加入可持久化的明暗模式切換。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 src/data/questions.json 與未引用 public/*.svg 預設資產已移除
- [x] #2 legacy getQuizQuestions() shim 與對應測試已移除，現有題庫 loader API 維持可用
- [x] #3 首頁 header 提供 Sun/Moon icon dark mode switch，具 aria-label
- [x] #4 未設定主題時跟隨 prefers-color-scheme，使用者切換後寫入 localStorage 並套用 document.documentElement dark class
- [x] #5 主要頁面、quiz app 與 UI 元件在 light/dark 下皆保持可讀
- [x] #6 README 功能列表包含暗色模式
- [x] #7 pnpm test、pnpm lint、pnpm build 已執行並處理結果
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Removed stale src/data/questions.json and unused Next default SVG assets. Deleted legacy getQuizQuestions() shim and its test while keeping getCsaV2Questions()/getCtiaQuestions(). Added tested theme utilities, a startup theme script, and a Sun/Moon header switch that follows system preference until the user stores an explicit localStorage preference. Added dark-mode variables/classes across the app shell, quiz panels, controls, answer states, stats, and shared UI primitives. Updated README feature list. Verification: CI=true pnpm test passed 10 files/30 tests; CI=true pnpm lint exited 0; CI=true pnpm build completed successfully; localhost smoke check returned the updated page with theme startup script and switch markup.
<!-- SECTION:FINAL_SUMMARY:END -->
