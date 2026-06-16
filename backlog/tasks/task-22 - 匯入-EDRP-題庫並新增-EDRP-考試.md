---
id: TASK-22
title: 匯入 EDRP 題庫並新增 EDRP 考試
status: Done
assignee: []
created_date: '2026-06-16 07:26'
updated_date: '2026-06-16 07:32'
labels:
  - quiz-bank
  - edrp
dependencies: []
modified_files:
  - README.md
  - package.json
  - scripts/convert-edrp-questions.mts
  - src/data/edrp-questions.json
  - src/lib/quiz/questions.ts
  - src/lib/quiz/questions.test.ts
  - src/lib/quiz/banks.ts
  - src/lib/quiz/banks.test.ts
  - backlog/tasks/task-22 - 匯入-EDRP-題庫並新增-EDRP-考試.md
priority: high
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Convert the root `EDRP題庫.json` source file into the app's generated quiz-bank data format and register it as a third selectable exam bank. This pass intentionally does not display or preserve source `note` explanations in app data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 A reproducible EDRP converter reads `EDRP題庫.json` and writes `src/data/edrp-questions.json` using ids `edrp-${n}` and option ids `edrp-${n}-a` through `edrp-${n}-d`.
- [x] #2 EDRP questions are exposed through `getEdrpQuestions()` without changing existing quiz question or option interfaces.
- [x] #3 `getQuizBanks()` includes an `edrp-all` bank titled `EDRP 全題庫` with exam type `EDRP` and the expected 153-question description.
- [x] #4 Tests cover EDRP question count, uniqueness, four options per question, exactly one correct option per question, and the first question's correct answer mapping to `Fault Tolerance`.
- [x] #5 README command notes mention regenerating the EDRP data from `EDRP題庫.json`.
<!-- AC:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Implemented EDRP as a third quiz bank. Added a reproducible `pnpm convert:edrp` converter from root `EDRP題庫.json` to `src/data/edrp-questions.json`, exposed `getEdrpQuestions()`, registered `edrp-all`, and documented the new source/conversion command. Added tests for EDRP count, uniqueness, option correctness, bank registration, and first-question answer mapping. Verification: `pnpm convert:edrp`, `pnpm test`, `pnpm lint`, and `pnpm build` all completed successfully.
<!-- SECTION:FINAL_SUMMARY:END -->
