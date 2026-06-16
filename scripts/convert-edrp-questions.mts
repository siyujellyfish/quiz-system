import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import type { QuizQuestion } from "../src/lib/quiz/types.ts";

type EdrpOptionKey = "A" | "B" | "C" | "D";

type EdrpSourceQuestion = {
  n: number;
  q: string;
  opts: Record<EdrpOptionKey, string>;
  correct: EdrpOptionKey;
};

const optionKeys = ["A", "B", "C", "D"] as const satisfies EdrpOptionKey[];

const inputPath = resolve(process.cwd(), "EDRP題庫.json");
const outputPath = resolve(process.cwd(), "src/data/edrp-questions.json");
const sourceQuestions = parseSourceQuestions(readFileSync(inputPath, "utf8"));
const questions = sourceQuestions.map(convertQuestion);

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(questions, null, 2)}\n`);

console.log(`Converted ${questions.length} EDRP questions to ${outputPath}`);

function parseSourceQuestions(source: string): EdrpSourceQuestion[] {
  const parsed: unknown = JSON.parse(source);

  if (!Array.isArray(parsed)) {
    throw new Error("EDRP source must be an array.");
  }

  return parsed.map((question, index) => readSourceQuestion(question, index));
}

function readSourceQuestion(
  value: unknown,
  index: number,
): EdrpSourceQuestion {
  if (!isRecord(value)) {
    throw new Error(`EDRP source question ${index + 1} must be an object.`);
  }

  const number = readNumber(value.n, `EDRP source question ${index + 1} n`);
  const prompt = readString(value.q, `EDRP source question ${number} q`);
  const options = readOptions(value.opts, number);
  const correct = readOptionKey(
    value.correct,
    `EDRP source question ${number} correct`,
  );

  return {
    n: number,
    q: prompt,
    opts: options,
    correct,
  };
}

function convertQuestion(question: EdrpSourceQuestion): QuizQuestion {
  return {
    id: `edrp-${question.n}`,
    prompt: question.q,
    options: optionKeys.map((optionKey) => ({
      id: `edrp-${question.n}-${optionKey.toLowerCase()}`,
      text: question.opts[optionKey],
      isCorrect: optionKey === question.correct,
    })),
  };
}

function readOptions(value: unknown, questionNumber: number) {
  if (!isRecord(value)) {
    throw new Error(`EDRP source question ${questionNumber} opts is invalid.`);
  }

  return Object.fromEntries(
    optionKeys.map((optionKey) => [
      optionKey,
      readString(
        value[optionKey],
        `EDRP source question ${questionNumber} option ${optionKey}`,
      ),
    ]),
  ) as Record<EdrpOptionKey, string>;
}

function readNumber(value: unknown, label: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new Error(`${label} must be a positive integer.`);
  }

  return value;
}

function readString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function readOptionKey(value: unknown, label: string): EdrpOptionKey {
  if (!isEdrpOptionKey(value)) {
    throw new Error(`${label} must be A, B, C, or D.`);
  }

  return value;
}

function isEdrpOptionKey(value: unknown): value is EdrpOptionKey {
  return optionKeys.some((optionKey) => optionKey === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
