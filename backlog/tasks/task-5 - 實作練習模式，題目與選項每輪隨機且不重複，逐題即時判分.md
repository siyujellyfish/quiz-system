---
id: TASK-5
title: 實作練習模式，題目與選項每輪隨機且不重複，逐題即時判分
status: Done
assignee: []
created_date: '2026-06-15 07:04'
updated_date: '2026-06-15 07:32'
labels: []
dependencies: []
priority: high
ordinal: 5000
---

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Practice questions do not repeat in a round
- [x] #2 Option order is randomized once per question
- [x] #3 Answer feedback is immediate
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-06-15 07:32
---
Verification: pnpm test src/lib/quiz/practice.test.ts exited 0 with 2 tests; pnpm lint exited 0. Practice engine shuffles questions without repeats, shuffles each question options once, scores immediately, and UI disables options after answer while showing feedback/next.
---
<!-- COMMENTS:END -->
