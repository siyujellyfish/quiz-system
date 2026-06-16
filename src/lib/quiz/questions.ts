import csaV2QuestionsJson from "../../data/csa-v2-questions.json";
import ctiaQuestionsJson from "../../data/ctia-questions.json";
import edrpQuestionsJson from "../../data/edrp-questions.json";

import type { QuizQuestion } from "./types";

export function getCsaV2Questions(): QuizQuestion[] {
  return validateQuestions(csaV2QuestionsJson);
}

export function getCtiaQuestions(): QuizQuestion[] {
  return validateQuestions(ctiaQuestionsJson);
}

export function getEdrpQuestions(): QuizQuestion[] {
  return validateQuestions(edrpQuestionsJson);
}

export function validateQuestions(value: unknown): QuizQuestion[] {
  if (!Array.isArray(value)) {
    throw new Error("Question data must be an array.");
  }

  const seenQuestionIds = new Set<string>();

  return value.map((question, index) => {
    if (!isRecord(question)) {
      throw new Error(`Question ${index + 1} must be an object.`);
    }

    const id = readString(question.id, `Question ${index + 1} id`);
    const prompt = readString(question.prompt, `Question ${index + 1} prompt`);

    if (seenQuestionIds.has(id)) {
      throw new Error(`Duplicate question id: ${id}`);
    }
    seenQuestionIds.add(id);

    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(`Question ${id} must have exactly 4 options.`);
    }

    const options = question.options.map((option, optionIndex) => {
      if (!isRecord(option)) {
        throw new Error(`Question ${id} option ${optionIndex + 1} is invalid.`);
      }

      return {
        id: readString(option.id, `Question ${id} option id`),
        text: readString(option.text, `Question ${id} option text`),
        isCorrect: readBoolean(
          option.isCorrect,
          `Question ${id} option correctness`,
        ),
      };
    });

    const correctCount = options.filter((option) => option.isCorrect).length;

    if (correctCount !== 1) {
      throw new Error(`Question ${id} must have exactly 1 correct option.`);
    }

    return { id, prompt, options };
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value;
}

function readBoolean(value: unknown, label: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${label} must be a boolean.`);
  }

  return value;
}
