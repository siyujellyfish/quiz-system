import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { QuizApp } from "./quiz-app";

import type { QuizBank } from "@/lib/quiz/types";

describe("QuizApp text formatting", () => {
  it("preserves question and option line breaks in rendered quiz text", () => {
    const html = renderToStaticMarkup(
      <QuizApp banks={[createBankWithMultilineText()]} seed="line-breaks" />,
    );

    expect(html).toContain("Question line 1\nQuestion line 2");
    expect(html).toContain("Option line 1\nOption line 2");
    expect(html).toContain("whitespace-pre-line");
  });
});

function createBankWithMultilineText(): QuizBank {
  return {
    id: "test",
    title: "Test Bank",
    examType: "Test",
    questions: [
      {
        id: "q1",
        prompt: "Question line 1\nQuestion line 2",
        options: [
          {
            id: "q1-a",
            text: "Option line 1\nOption line 2",
            isCorrect: true,
          },
          { id: "q1-b", text: "Option B", isCorrect: false },
          { id: "q1-c", text: "Option C", isCorrect: false },
          { id: "q1-d", text: "Option D", isCorrect: false },
        ],
      },
    ],
  };
}
