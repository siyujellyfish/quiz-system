---
id: TASK-4
title: 建立題庫型別、載入器與解析驗證測試
status: Done
assignee: []
created_date: '2026-06-15 07:04'
updated_date: '2026-06-15 07:30'
labels: []
dependencies: []
priority: high
ordinal: 4000
---

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Question types are defined
- [x] #2 Loader exposes validated quiz data
- [x] #3 Tests cover counts, options, answers, and unique IDs
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-06-15 07:30
---
Verification: pnpm test src/lib/quiz/questions.test.ts src/lib/quiz/parser.test.ts exited 0 with 2 files and 3 tests passing; tests cover 100 questions, unique IDs, four options, exactly one correct option, and duplicate-ID rejection.
---
<!-- COMMENTS:END -->
