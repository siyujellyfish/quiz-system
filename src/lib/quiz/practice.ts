import type { QuizOption, QuizQuestion } from "./types";

export type PracticeQuestion = QuizQuestion;

export type PracticeAnswerResult = {
  questionId: string;
  selectedOptionId: string;
  correctOptionId: string;
  isCorrect: boolean;
};

type RandomSource = () => number;

export function createSeededRandom(seed: string): RandomSource {
  let state = hashSeed(seed) || 1;

  return () => {
    state += 0x6d2b79f5;

    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createPracticeRound(
  questions: QuizQuestion[],
  random: RandomSource = Math.random,
): PracticeQuestion[] {
  return shuffle(questions, random).map((question) => ({
    ...question,
    options: shuffle(question.options, random),
  }));
}

export function answerPracticeQuestion(
  question: PracticeQuestion,
  selectedOptionId: string,
): PracticeAnswerResult {
  const selectedOption = question.options.find(
    (option) => option.id === selectedOptionId,
  );
  const correctOption = question.options.find((option) => option.isCorrect);

  if (!selectedOption) {
    throw new Error(`Unknown option id: ${selectedOptionId}`);
  }

  if (!correctOption) {
    throw new Error(`Question ${question.id} has no correct option.`);
  }

  return {
    questionId: question.id,
    selectedOptionId,
    correctOptionId: correctOption.id,
    isCorrect: selectedOption.isCorrect,
  };
}

export function shuffle<T extends QuizQuestion | QuizOption>(
  items: readonly T[],
  random: RandomSource = Math.random,
): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function hashSeed(seed: string): number {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}
