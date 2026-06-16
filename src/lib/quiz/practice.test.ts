import { describe, expect, it } from "vitest";

import type { QuizQuestion } from "./types";
import {
  answerPracticeQuestion,
  createPracticeRound,
  createSeededRandom,
} from "./practice";

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
      { id: "q2-a", text: "A", isCorrect: false },
      { id: "q2-b", text: "B", isCorrect: false },
      { id: "q2-c", text: "C", isCorrect: true },
      { id: "q2-d", text: "D", isCorrect: false },
    ],
  },
  {
    id: "q3",
    prompt: "Question 3",
    options: [
      { id: "q3-a", text: "A", isCorrect: true },
      { id: "q3-b", text: "B", isCorrect: false },
      { id: "q3-c", text: "C", isCorrect: false },
      { id: "q3-d", text: "D", isCorrect: false },
    ],
  },
];

describe("practice mode", () => {
  it("creates a shuffled round without repeating questions", () => {
    const round = createPracticeRound(questions, seededRandom());

    expect(round).toHaveLength(questions.length);
    expect(new Set(round.map((question) => question.id)).size).toBe(
      questions.length,
    );
    expect(round.map((question) => question.id)).not.toEqual(
      questions.map((question) => question.id),
    );
  });

  it("randomizes option order once and scores answers without mutating options", () => {
    const [question] = createPracticeRound([questions[0]], seededRandom());
    const optionOrder = question.options.map((option) => option.id);
    const correctOption = question.options.find((option) => option.isCorrect);

    expect(correctOption).toBeDefined();

    const result = answerPracticeQuestion(question, correctOption!.id);

    expect(result).toEqual({
      questionId: "q1",
      selectedOptionId: correctOption!.id,
      correctOptionId: "q1-b",
      isCorrect: true,
    });
    expect(question.options.map((option) => option.id)).toEqual(optionOrder);
  });

  it("creates the same round for the same seed", () => {
    const firstRound = createPracticeRound(
      questions,
      createSeededRandom("session-a"),
    );
    const secondRound = createPracticeRound(
      questions,
      createSeededRandom("session-a"),
    );

    expect(firstRound.map((question) => question.id)).toEqual(
      secondRound.map((question) => question.id),
    );
    expect(firstRound[0]?.options.map((option) => option.id)).toEqual(
      secondRound[0]?.options.map((option) => option.id),
    );
  });
});

function seededRandom() {
  const values = [0.9, 0.1, 0.7, 0.3, 0.8, 0.2, 0.6, 0.4];
  let index = 0;

  return () => values[index++ % values.length];
}
