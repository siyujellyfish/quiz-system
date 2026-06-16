import type { PracticeAnswerResult } from "./practice";

export type PracticeStats = {
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  answeredCount: number;
  accuracy: number;
};

export function calculatePracticeStats(
  answers: PracticeAnswerResult[],
  total: number,
): PracticeStats {
  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const answeredCount = answers.length;
  const incorrectCount = answeredCount - correctCount;
  const unansweredCount = Math.max(total - answeredCount, 0);
  const accuracy =
    answeredCount === 0 ? 0 : Math.round((correctCount / answeredCount) * 100);

  return {
    correctCount,
    incorrectCount,
    unansweredCount,
    answeredCount,
    accuracy,
  };
}
