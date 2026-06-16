import vm from "node:vm";

export type ParsedQuizOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type ParsedQuizQuestion = {
  id: string;
  prompt: string;
  options: ParsedQuizOption[];
};

type GoogleQuestion = [
  number,
  string,
  unknown,
  unknown,
  [
    [
      number,
      string[][],
      number,
      ...unknown[],
    ],
  ],
  ...unknown[],
];

const formDataPattern = /var FB_PUBLIC_LOAD_DATA_ = (.*?);<\/script>/s;

export function parseQuizHtml(html: string): ParsedQuizQuestion[] {
  const match = html.match(formDataPattern);

  if (!match) {
    throw new Error("Could not find FB_PUBLIC_LOAD_DATA_ in source HTML.");
  }

  const sandbox: { FB_PUBLIC_LOAD_DATA_?: unknown } = {};
  vm.runInNewContext(`var FB_PUBLIC_LOAD_DATA_ = ${match[1]}`, sandbox, {
    timeout: 1000,
  });

  const questions = getGoogleQuestions(sandbox.FB_PUBLIC_LOAD_DATA_).filter(
    hasOptions,
  );
  const correctAnswers = getCorrectAnswersFromScoreHtml(html);

  return questions.map((question, questionIndex) => {
    const rawOptions = question[4]?.[0]?.[1];
    const correctAnswer = correctAnswers.get(String(question[0]));

    if (!Array.isArray(rawOptions) || typeof correctAnswer !== "string") {
      throw new Error(`Question ${questionIndex + 1} has invalid options.`);
    }

    const normalizedCorrectAnswer = normalizeText(correctAnswer);
    const correctIndex = rawOptions.findIndex(
      (option) => normalizeText(decodeText(option[0])) === normalizedCorrectAnswer,
    );

    if (correctIndex === -1) {
      throw new Error(
        `Question ${question[0]} does not contain the extracted correct answer: ${correctAnswer}`,
      );
    }

    return {
      id: String(question[0]),
      prompt: decodeText(question[1]),
      options: rawOptions.map((option, optionIndex) => ({
        id: `${question[0]}-${optionIndex}`,
        text: decodeText(option[0]),
        isCorrect: optionIndex === correctIndex,
      })),
    };
  });
}

function getGoogleQuestions(data: unknown): GoogleQuestion[] {
  if (!Array.isArray(data)) {
    throw new Error("FB_PUBLIC_LOAD_DATA_ is not an array.");
  }

  const questions = data[1]?.[1];

  if (!Array.isArray(questions)) {
    throw new Error("Could not find Google Forms question array.");
  }

  return questions as GoogleQuestion[];
}

function getCorrectAnswersFromScoreHtml(html: string): Map<string, string> {
  const correctAnswers = new Map<string, string>();
  const pattern =
    /data-item-id="(\d+)"(?:(?!data-item-id=").)*?role="radiogroup"[^>]*data-value="([^"]*)"/gs;

  for (const match of html.matchAll(pattern)) {
    correctAnswers.set(match[1], decodeText(match[2]));
  }

  if (correctAnswers.size === 0) {
    throw new Error("Could not find any score-page answers in source HTML.");
  }

  return correctAnswers;
}

function hasOptions(question: GoogleQuestion): boolean {
  return Array.isArray(question[4]?.[0]?.[1]);
}

function decodeText(value: string): string {
  return value
    .replaceAll("&#39;", "'")
    .replaceAll("&quot;", "\"")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

function normalizeText(value: string): string {
  return decodeText(value).replace(/\s+/g, " ").trim();
}
