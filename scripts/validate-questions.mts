import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { validateQuestionSources } from "../src/lib/quiz/question-validation.ts";

const sources = [
  {
    name: "CSA v2",
    path: "src/data/csa-v2-questions.json",
    expectedCount: 100,
  },
  {
    name: "CTIA",
    path: "src/data/ctia-questions.json",
    expectedCount: 88,
  },
  {
    name: "EDRP",
    path: "src/data/edrp-questions.json",
    expectedCount: 153,
  },
] as const;

const report = validateQuestionSources(
  sources.map((source) => ({
    name: source.name,
    expectedCount: source.expectedCount,
    questions: readJson(source.path),
  })),
);

if (report.valid) {
  console.log("Question data validation passed.");
  for (const summary of report.summaries) {
    console.log(`- ${summary.name}: ${summary.count} questions`);
  }
} else {
  console.error("Question data validation failed.");
  for (const issue of report.issues) {
    console.error(`- ${issue}`);
  }
  process.exitCode = 1;
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(resolve(process.cwd(), path), "utf8"));
}
