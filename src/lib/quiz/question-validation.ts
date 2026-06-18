export type QuestionSource = {
  name: string;
  expectedCount?: number;
  questions: unknown;
};

export type QuestionValidationSummary = {
  name: string;
  count: number;
};

export type QuestionValidationReport = {
  valid: boolean;
  summaries: QuestionValidationSummary[];
  issues: string[];
};

export function validateQuestionSources(
  sources: QuestionSource[],
): QuestionValidationReport {
  const summaries: QuestionValidationSummary[] = [];
  const issues: string[] = [];

  for (const source of sources) {
    validateQuestionSource(source, summaries, issues);
  }

  return {
    valid: issues.length === 0,
    summaries,
    issues,
  };
}

function validateQuestionSource(
  source: QuestionSource,
  summaries: QuestionValidationSummary[],
  issues: string[],
) {
  if (!Array.isArray(source.questions)) {
    issues.push(`${source.name}: question data must be an array.`);
    summaries.push({ name: source.name, count: 0 });
    return;
  }

  summaries.push({ name: source.name, count: source.questions.length });

  if (
    typeof source.expectedCount === "number" &&
    source.questions.length !== source.expectedCount
  ) {
    issues.push(
      `${source.name}: expected ${source.expectedCount} questions but found ${source.questions.length}.`,
    );
  }

  const seenQuestionIds = new Set<string>();

  source.questions.forEach((question, questionIndex) => {
    const fallbackLabel = `question ${questionIndex + 1}`;

    if (!isRecord(question)) {
      issues.push(`${source.name}: ${fallbackLabel} must be an object.`);
      return;
    }

    const questionId =
      typeof question.id === "string" && question.id.trim().length > 0
        ? question.id
        : fallbackLabel;

    if (typeof question.id !== "string" || question.id.trim().length === 0) {
      issues.push(`${source.name}: ${fallbackLabel} id must be a non-empty string.`);
    } else if (seenQuestionIds.has(question.id)) {
      issues.push(
        `${source.name}: duplicate question id ${question.id} at question ${questionIndex + 1}.`,
      );
    } else {
      seenQuestionIds.add(question.id);
    }

    if (typeof question.prompt !== "string" || question.prompt.trim().length === 0) {
      issues.push(
        `${source.name}: question ${questionId} prompt must be a non-empty string.`,
      );
    }

    if (!Array.isArray(question.options)) {
      issues.push(`${source.name}: question ${questionId} options must be an array.`);
      return;
    }

    if (question.options.length !== 4) {
      issues.push(
        `${source.name}: question ${questionId} must have exactly 4 options but found ${question.options.length}.`,
      );
    }

    const correctCount = question.options.filter((option, optionIndex) => {
      if (!isRecord(option)) {
        issues.push(
          `${source.name}: question ${questionId} option ${optionIndex + 1} must be an object.`,
        );
        return false;
      }

      const optionLabel =
        typeof option.id === "string" && option.id.trim().length > 0
          ? option.id
          : `option ${optionIndex + 1}`;

      if (typeof option.id !== "string" || option.id.trim().length === 0) {
        issues.push(
          `${source.name}: question ${questionId} option ${optionIndex + 1} id must be a non-empty string.`,
        );
      }

      if (typeof option.text !== "string" || option.text.trim().length === 0) {
        issues.push(
          `${source.name}: question ${questionId} option ${optionLabel} text must be a non-empty string.`,
        );
      }

      if (typeof option.isCorrect !== "boolean") {
        issues.push(
          `${source.name}: question ${questionId} option ${optionLabel} correctness must be a boolean.`,
        );
        return false;
      }

      return option.isCorrect;
    }).length;

    if (correctCount !== 1) {
      issues.push(
        `${source.name}: question ${questionId} must have exactly 1 correct option but found ${correctCount}.`,
      );
    }
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
