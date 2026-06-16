---
id: TASK-3
title: 建立題庫抽取腳本，從 CSA v2 題庫.html 解析 100 題、4 選項、單一正解，輸出 JSON
status: Done
assignee: []
created_date: '2026-06-15 07:03'
updated_date: '2026-06-15 07:28'
labels: []
dependencies: []
priority: high
ordinal: 3000
---

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Parser reads CSA v2 題庫.html
- [x] #2 Output JSON has 100 questions
- [x] #3 Each question has 4 options and exactly 1 answer
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-06-15 07:28
---
Verification: pnpm extract:questions exited 0 and wrote src/data/questions.json; direct JSON check printed 100, true for four options, true for exactly one correct answer; parser test src/lib/quiz/parser.test.ts passed.
---
<!-- COMMENTS:END -->
