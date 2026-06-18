import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { parseQuizHtml } from "./parser";

const sourceHtml = readFileSync(
  resolve(process.cwd(), "CSA v2 題庫.html"),
  "utf8",
);
const ctiaSourceHtml = readFileSync(
  resolve(process.cwd(), "CTIA 全題庫測驗（順序隨機，每次不同）.html"),
  "utf8",
);

describe("parseQuizHtml", () => {
  it("extracts 100 single-answer questions from the CSA v2 Google Forms export", () => {
    const questions = parseQuizHtml(sourceHtml);

    expect(questions).toHaveLength(100);
    expect(new Set(questions.map((question) => question.id)).size).toBe(100);

    for (const question of questions) {
      expect(question.prompt.trim().length).toBeGreaterThan(0);
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(
        1,
      );
      expect(question.options.every((option) => option.text.trim().length > 0))
        .toBe(true);
    }
  });

  it("uses the score page marked answer instead of the embedded Google Forms answer index", () => {
    const questions = parseQuizHtml(sourceHtml);
    const firstQuestion = questions.find(
      (question) => question.id === "1075512774",
    );
    const secondQuestion = questions.find(
      (question) => question.id === "1603719425",
    );

    expect(firstQuestion?.options.find((option) => option.isCorrect)?.text).toBe(
      "False Negative",
    );
    expect(secondQuestion?.options.find((option) => option.isCorrect)?.text).toBe(
      "Cloud Access Security Broker",
    );
  });

  it("extracts form data when formatted HTML adds whitespace before closing script", () => {
    const questions = parseQuizHtml(`
      <div data-item-id="1">
        <div role="radiogroup" data-value="Beta"></div>
      </div>
      <script>
        var FB_PUBLIC_LOAD_DATA_ = [
          null,
          [
            null,
            [
              [
                1,
                "Formatted prompt",
                null,
                null,
                [
                  [
                    10,
                    [["Alpha"], ["Beta"], ["Gamma"], ["Delta"]],
                    1
                  ]
                ]
              ]
            ]
          ]
        ];
      </script>
    `);

    expect(questions).toHaveLength(1);
    expect(questions[0]?.options.find((option) => option.isCorrect)?.text).toBe(
      "Beta",
    );
  });

  it("uses the correct-answer block instead of the selected wrong answer", () => {
    const questions = parseQuizHtml(`
      <div data-item-id="1">
        <div aria-label="答錯" role="note"></div>
        <div role="radiogroup" data-value="Selected wrong">
          <div role="radio" data-value="Selected wrong" aria-checked="true"></div>
          <div role="radio" data-value="Actual correct" aria-checked="false"></div>
          <div role="radio" data-value="Other A" aria-checked="false"></div>
          <div role="radio" data-value="Other B" aria-checked="false"></div>
        </div>
        <div>
          <div role="heading" aria-level="3">正確答案</div>
          <div role="radio" data-value="Actual correct" aria-checked="true"></div>
        </div>
      </div>
      <script>
        var FB_PUBLIC_LOAD_DATA_ = [
          null,
          [
            null,
            [
              [
                1,
                "Formatted prompt",
                null,
                null,
                [
                  [
                    10,
                    [["Selected wrong"], ["Actual correct"], ["Other A"], ["Other B"]],
                    1
                  ]
                ]
              ]
            ]
          ]
        ];
      </script>
    `);

    expect(questions[0]?.options.find((option) => option.isCorrect)?.text).toBe(
      "Actual correct",
    );
  });

  it("extracts 88 CTIA questions and skips the Google Forms description item", () => {
    const questions = parseQuizHtml(ctiaSourceHtml);

    expect(questions).toHaveLength(88);
    expect(questions[0]?.prompt).toMatch(/^1\. A team of threat intelligence/);
    expect(
      questions.some((question) =>
        question.prompt.includes("本表單包含所有 CTIA 題庫"),
      ),
    ).toBe(false);

    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.filter((option) => option.isCorrect)).toHaveLength(
        1,
      );
    }
  });

  it("keeps CTIA score-page answers scoped to their own question block", () => {
    const questions = parseQuizHtml(ctiaSourceHtml);
    const question = questions.find((item) => item.id === "803033495");

    expect(question?.prompt).toMatch(/^41\./);
    expect(question?.options.find((option) => option.isCorrect)?.text).toBe(
      "Gateway",
    );
  });

  it("keeps CTIA source question numbers and prompt-internal numbered lists", () => {
    const questions = parseQuizHtml(ctiaSourceHtml);
    const question = questions.find((item) => item.id === "2050614455");

    expect(question?.prompt).toMatch(
      /^7\. What is the correct sequence of steps involved in scheduling a threat intelligence program\?/,
    );
    expect(question?.prompt).toContain("1. Review the project charter");
    expect(question?.prompt).toContain("9. Build a work breakdown structure");
  });
});
