import { describe, expect, it } from "vitest";

import {
  getCsaV2Questions,
  getCtiaQuestions,
  getQuizQuestions,
  validateQuestions,
} from "./questions";

describe("quiz question loader", () => {
  it("loads validated CSA questions with unique IDs and one correct option", () => {
    const questions = getCsaV2Questions();

    expect(questions).toHaveLength(100);
    expect(new Set(questions.map((question) => question.id)).size).toBe(100);

    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(
        1,
      );
    }
  });

  it("keeps the legacy quiz question loader mapped to CSA v2", () => {
    expect(getQuizQuestions()).toHaveLength(100);
  });

  it("loads validated CTIA questions with unique IDs and one correct option", () => {
    const questions = getCtiaQuestions();

    expect(questions).toHaveLength(88);
    expect(new Set(questions.map((question) => question.id)).size).toBe(88);

    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(
        1,
      );
    }
  });

  it("rejects duplicate question IDs", () => {
    expect(() =>
      validateQuestions([
        {
          id: "duplicate",
          prompt: "Question 1",
          options: [
            { id: "a", text: "A", isCorrect: true },
            { id: "b", text: "B", isCorrect: false },
            { id: "c", text: "C", isCorrect: false },
            { id: "d", text: "D", isCorrect: false },
          ],
        },
        {
          id: "duplicate",
          prompt: "Question 2",
          options: [
            { id: "e", text: "A", isCorrect: true },
            { id: "f", text: "B", isCorrect: false },
            { id: "g", text: "C", isCorrect: false },
            { id: "h", text: "D", isCorrect: false },
          ],
        },
      ]),
    ).toThrow(/Duplicate question id/);
  });
});
