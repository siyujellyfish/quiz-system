import { describe, expect, it } from "vitest";

import {
  getCsaV2Questions,
  getCtiaQuestions,
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

  it("loads validated CTIA questions with unique IDs and one correct option", () => {
    const questions = getCtiaQuestions();

    expect(questions).toHaveLength(88);
    expect(new Set(questions.map((question) => question.id)).size).toBe(88);
    expect(questions[0]?.prompt).toMatch(
      /^A team of threat intelligence analysts/,
    );

    for (const question of questions) {
      expect(question.prompt).not.toMatch(/^\d+[.)、．）]\s/);
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(
        1,
      );
    }

    const numberedListQuestion = questions.find(
      (question) => question.id === "2050614455",
    );
    expect(numberedListQuestion?.prompt).toContain(
      "1. Review the project charter",
    );
    expect(numberedListQuestion?.prompt).toContain(
      "9. Build a work breakdown structure",
    );
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
