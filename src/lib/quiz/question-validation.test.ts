import { describe, expect, it } from "vitest";

import { validateQuestionSources } from "./question-validation";

describe("question source validation", () => {
  it("reports valid question sources with counts", () => {
    const report = validateQuestionSources([
      {
        name: "Sample",
        expectedCount: 1,
        questions: [
          {
            id: "q1",
            prompt: "Question 1",
            options: [
              { id: "q1-a", text: "A", isCorrect: true },
              { id: "q1-b", text: "B", isCorrect: false },
              { id: "q1-c", text: "C", isCorrect: false },
              { id: "q1-d", text: "D", isCorrect: false },
            ],
          },
        ],
      },
    ]);

    expect(report.valid).toBe(true);
    expect(report.summaries).toEqual([{ name: "Sample", count: 1 }]);
    expect(report.issues).toEqual([]);
  });

  it("reports expected count and duplicate question id issues", () => {
    const report = validateQuestionSources([
      {
        name: "Broken",
        expectedCount: 3,
        questions: [
          {
            id: "duplicate",
            prompt: "Question 1",
            options: [
              { id: "q1-a", text: "A", isCorrect: true },
              { id: "q1-b", text: "B", isCorrect: false },
              { id: "q1-c", text: "C", isCorrect: false },
              { id: "q1-d", text: "D", isCorrect: false },
            ],
          },
          {
            id: "duplicate",
            prompt: "Question 2",
            options: [
              { id: "q2-a", text: "A", isCorrect: true },
              { id: "q2-b", text: "B", isCorrect: false },
              { id: "q2-c", text: "C", isCorrect: false },
              { id: "q2-d", text: "D", isCorrect: false },
            ],
          },
        ],
      },
    ]);

    expect(report.valid).toBe(false);
    expect(report.issues).toContain(
      "Broken: expected 3 questions but found 2.",
    );
    expect(report.issues).toContain(
      "Broken: duplicate question id duplicate at question 2.",
    );
  });

  it("reports blank prompts, blank options, option counts, and correct counts", () => {
    const report = validateQuestionSources([
      {
        name: "Broken",
        questions: [
          {
            id: "q1",
            prompt: " ",
            options: [
              { id: "q1-a", text: "", isCorrect: true },
              { id: "q1-b", text: "B", isCorrect: true },
              { id: "q1-c", text: "C", isCorrect: false },
            ],
          },
        ],
      },
    ]);

    expect(report.valid).toBe(false);
    expect(report.issues).toEqual([
      "Broken: question q1 prompt must be a non-empty string.",
      "Broken: question q1 must have exactly 4 options but found 3.",
      "Broken: question q1 option q1-a text must be a non-empty string.",
      "Broken: question q1 must have exactly 1 correct option but found 2.",
    ]);
  });
});
