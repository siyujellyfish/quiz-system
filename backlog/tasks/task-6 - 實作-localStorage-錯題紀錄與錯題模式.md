---
id: TASK-6
title: 實作 localStorage 錯題紀錄與錯題模式
status: Done
assignee: []
created_date: '2026-06-15 07:04'
updated_date: '2026-06-15 07:35'
labels: []
dependencies: []
priority: high
ordinal: 6000
---

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Wrong answers persist in localStorage
- [x] #2 Mistake mode only shows current wrong questions
- [x] #3 Wrong records can be cleared or removed after correct answer
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-06-15 07:35
---
Verification: pnpm test src/lib/quiz/mistakes.test.ts src/lib/quiz/practice.test.ts exited 0 with 5 tests; pnpm lint exited 0. Practice wrong answers sync to localStorage, mistake mode filters by current wrong IDs, clear removes all, and correct mistake answers remove records when advancing.
---
<!-- COMMENTS:END -->
