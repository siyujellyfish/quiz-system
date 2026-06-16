import { describe, expect, it } from "vitest";

import { calculatePracticeStats } from "./practice-stats";
import type { PracticeAnswerResult } from "./practice";

describe("practice stats", () => {
  it("reports zero progress before any answers are submitted", () => {
    expect(calculatePracticeStats([], 4)).toEqual({
      correctCount: 0,
      incorrectCount: 0,
      unansweredCount: 4,
      answeredCount: 0,
      accuracy: 0,
    });
  });

  it("counts correct, incorrect, unanswered, and answered accuracy", () => {
    const answers: PracticeAnswerResult[] = [
      createAnswer("q1", true),
      createAnswer("q2", false),
    ];

    expect(calculatePracticeStats(answers, 4)).toEqual({
      correctCount: 1,
      incorrectCount: 1,
      unansweredCount: 2,
      answeredCount: 2,
      accuracy: 50,
    });
  });

  it("does not divide by zero when a round has no questions", () => {
    expect(calculatePracticeStats([], 0)).toEqual({
      correctCount: 0,
      incorrectCount: 0,
      unansweredCount: 0,
      answeredCount: 0,
      accuracy: 0,
    });
  });
});

function createAnswer(
  questionId: string,
  isCorrect: boolean,
): PracticeAnswerResult {
  return {
    questionId,
    selectedOptionId: `${questionId}-selected`,
    correctOptionId: `${questionId}-correct`,
    isCorrect,
  };
}
