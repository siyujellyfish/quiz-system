import { shuffle } from "./practice";
import type { QuizQuestion } from "./types";

type RandomSource = () => number;

export type ExamAnswers = Record<string, string>;

export type ExamWrongAnswer = {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
};

export type ExamResult = {
  score: number;
  total: number;
  percentage: number;
  wrongAnswers: ExamWrongAnswer[];
};

export function createExam(
  questions: QuizQuestion[],
  random: RandomSource = Math.random,
): QuizQuestion[] {
  return shuffle(questions, random).map((question) => ({
    ...question,
    options: shuffle(question.options, random),
  }));
}

export function scoreExam(
  questions: QuizQuestion[],
  answers: ExamAnswers,
): ExamResult {
  const wrongAnswers: ExamWrongAnswer[] = [];
  let score = 0;

  for (const question of questions) {
    const selectedOptionId = answers[question.id];
    const correctOption = question.options.find((option) => option.isCorrect);

    if (!correctOption) {
      throw new Error(`Question ${question.id} has no correct option.`);
    }

    if (selectedOptionId === correctOption.id) {
      score += 1;
    } else {
      wrongAnswers.push({
        questionId: question.id,
        selectedOptionId: selectedOptionId ?? "",
        correctOptionId: correctOption.id,
      });
    }
  }

  return {
    score,
    total: questions.length,
    percentage:
      questions.length === 0 ? 0 : Math.round((score / questions.length) * 100),
    wrongAnswers,
  };
}
