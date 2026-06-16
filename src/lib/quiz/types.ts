export type QuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export type QuizBankDefinition = {
  id: string;
  title: string;
  examType: string;
  description: string;
  questionIds?: string[];
};

export type QuizBank = QuizBankDefinition & {
  questions: QuizQuestion[];
};

export type AnswerRecord = {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
};
