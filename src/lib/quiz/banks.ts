import { getCsaV2Questions, getCtiaQuestions } from "./questions";
import type {
  QuizBank,
  QuizBankDefinition,
  QuizQuestion,
} from "./types";

const bankDefinitions: QuizBankDefinition[] = [
  {
    id: "csa-v2-all",
    title: "CSA v2 全題庫",
    examType: "CSA v2",
    description: "從 CSA v2 題庫匯出整理的 100 題單選題。",
  },
  {
    id: "ctia-all",
    title: "CTIA 全題庫",
    examType: "CTIA",
    description: "從 CTIA 全題庫測驗匯出整理的 88 題單選題。",
  },
];

export function getQuizBanks(): QuizBank[] {
  return [
    resolveQuestionBank(bankDefinitions[0], getCsaV2Questions()),
    resolveQuestionBank(bankDefinitions[1], getCtiaQuestions()),
  ];
}

export function resolveQuestionBanks(
  definitions: QuizBankDefinition[],
  questions: QuizQuestion[],
): QuizBank[] {
  const seenBankIds = new Set<string>();

  return definitions.map((definition) => {
    if (seenBankIds.has(definition.id)) {
      throw new Error(`Duplicate bank id: ${definition.id}`);
    }
    seenBankIds.add(definition.id);

    return resolveQuestionBank(definition, questions);
  });
}

function resolveQuestionBank(
  definition: QuizBankDefinition | undefined,
  questions: QuizQuestion[],
): QuizBank {
  if (!definition) {
    throw new Error("Question bank definition is missing.");
  }

  const questionsById = new Map(
    questions.map((question) => [question.id, question]),
  );

  const bankQuestions = definition.questionIds
    ? definition.questionIds.map((questionId) => {
        const question = questionsById.get(questionId);

        if (!question) {
          throw new Error(
            `Bank ${definition.id} references unknown question id: ${questionId}`,
          );
        }

        return question;
      })
    : questions;

  if (bankQuestions.length === 0) {
    throw new Error(`Bank ${definition.id} must include at least 1 question.`);
  }

  return {
    ...definition,
    questions: bankQuestions,
  };
}
