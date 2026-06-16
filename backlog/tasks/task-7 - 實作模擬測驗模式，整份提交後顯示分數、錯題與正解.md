---
id: TASK-7
title: 實作模擬測驗模式，整份提交後顯示分數、錯題與正解
status: Done
assignee: []
created_date: '2026-06-15 07:04'
updated_date: '2026-06-15 07:37'
labels: []
dependencies: []
priority: high
ordinal: 7000
---

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Exam mode scores after full submission
- [x] #2 Exam review lists wrong questions
- [x] #3 Correct answers are shown after submit
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-06-15 07:37
---
Verification: pnpm test src/lib/quiz/exam.test.ts exited 0; pnpm lint exited 0. Exam mode keeps selections private until submit, then shows score percentage, wrong-question markers, selected wrong options, and correct answers.
---
<!-- COMMENTS:END -->
