import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { parseQuizHtml } from "../src/lib/quiz/parser.ts";

const sources = [
  {
    input: "CSA v2 題庫.html",
    output: "src/data/csa-v2-questions.json",
  },
  {
    input: "CTIA 全題庫測驗（順序隨機，每次不同）.html",
    output: "src/data/ctia-questions.json",
    transformPrompt: stripLeadingQuestionNumber,
  },
] as const;

for (const source of sources) {
  const inputPath = resolve(process.cwd(), source.input);
  const outputPath = resolve(process.cwd(), source.output);
  const questions = parseQuizHtml(readFileSync(inputPath, "utf8")).map(
    (question) => ({
      ...question,
      prompt: "transformPrompt" in source
        ? source.transformPrompt(question.prompt)
        : question.prompt,
    }),
  );

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, `${JSON.stringify(questions, null, 2)}\n`);

  console.log(`Extracted ${questions.length} questions to ${outputPath}`);
}

function stripLeadingQuestionNumber(prompt: string): string {
  return prompt.replace(/^\s*\d+[.)、．）]\s*/, "");
}
