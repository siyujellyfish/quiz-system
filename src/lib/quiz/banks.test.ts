import { describe, expect, it } from "vitest";

import type { QuizQuestion } from "./types";
import { getQuizBanks, resolveQuestionBanks } from "./banks";

const questions: QuizQuestion[] = [
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
  {
    id: "q2",
    prompt: "Question 2",
    options: [
      { id: "q2-a", text: "A", isCorrect: false },
      { id: "q2-b", text: "B", isCorrect: true },
      { id: "q2-c", text: "C", isCorrect: false },
      { id: "q2-d", text: "D", isCorrect: false },
    ],
  },
];

describe("question banks", () => {
  it("loads the default CSA v2 bank from all validated questions", () => {
    const banks = getQuizBanks();

    expect(banks).toHaveLength(3);
    expect(banks.find((bank) => bank.id === "csa-v2-all")).toMatchObject({
      id: "csa-v2-all",
      title: "CSA v2 全題庫",
      examType: "CSA v2",
    });
    expect(banks.find((bank) => bank.id === "csa-v2-all")?.questions).toHaveLength(
      100,
    );
  });

  it("loads the CTIA bank from validated CTIA questions", () => {
    const banks = getQuizBanks();

    expect(banks.find((bank) => bank.id === "ctia-all")).toMatchObject({
      id: "ctia-all",
      title: "CTIA 全題庫",
      examType: "CTIA",
    });
    expect(banks.find((bank) => bank.id === "ctia-all")?.questions).toHaveLength(
      88,
    );
  });

  it("loads the EDRP bank from validated EDRP questions", () => {
    const banks = getQuizBanks();

    expect(banks.find((bank) => bank.id === "edrp-all")).toMatchObject({
      id: "edrp-all",
      title: "EDRP 全題庫",
      examType: "EDRP",
      description: "從 EDRP 題庫整理的 153 題單選題。",
    });
    expect(banks.find((bank) => bank.id === "edrp-all")?.questions).toHaveLength(
      153,
    );
  });

  it("supports future subset banks by question id", () => {
    const banks = resolveQuestionBanks(
      [
        {
          id: "subset",
          title: "Subset",
          examType: "Future Exam",
          description: "Two-question source reduced to one question.",
          questionIds: ["q2"],
        },
      ],
      questions,
    );

    expect(banks).toHaveLength(1);
    expect(banks[0]?.questions.map((question) => question.id)).toEqual(["q2"]);
  });

  it("rejects bank definitions that reference missing questions", () => {
    expect(() =>
      resolveQuestionBanks(
        [
          {
            id: "broken",
            title: "Broken",
            examType: "Future Exam",
            description: "References an unknown question.",
            questionIds: ["missing"],
          },
        ],
        questions,
      ),
    ).toThrow(/unknown question id: missing/);
  });
});
