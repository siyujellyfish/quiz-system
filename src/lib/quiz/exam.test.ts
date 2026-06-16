import { describe, expect, it } from "vitest";

import type { QuizQuestion } from "./types";
import { createExam, scoreExam } from "./exam";

const questions: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Question 1",
    options: [
      { id: "q1-a", text: "A", isCorrect: false },
      { id: "q1-b", text: "B", isCorrect: true },
      { id: "q1-c", text: "C", isCorrect: false },
      { id: "q1-d", text: "D", isCorrect: false },
    ],
  },
  {
    id: "q2",
    prompt: "Question 2",
    options: [
      { id: "q2-a", text: "A", isCorrect: true },
      { id: "q2-b", text: "B", isCorrect: false },
      { id: "q2-c", text: "C", isCorrect: false },
      { id: "q2-d", text: "D", isCorrect: false },
    ],
  },
];

describe("exam mode", () => {
  it("creates an exam with shuffled questions and scores only after submission", () => {
    const exam = createExam(questions, seededRandom());

    expect(exam).toHaveLength(2);
    expect(new Set(exam.map((question) => question.id)).size).toBe(2);

    const result = scoreExam(exam, {
      q1: "q1-b",
      q2: "q2-c",
    });

    expect(result.score).toBe(1);
    expect(result.total).toBe(2);
    expect(result.percentage).toBe(50);
    expect(result.wrongAnswers).toEqual([
      {
        questionId: "q2",
        selectedOptionId: "q2-c",
        correctOptionId: "q2-a",
      },
    ]);
  });
});

function seededRandom() {
  const values = [0.9, 0.1, 0.7, 0.3, 0.8, 0.2, 0.6, 0.4];
  let index = 0;

  return () => values[index++ % values.length];
}
