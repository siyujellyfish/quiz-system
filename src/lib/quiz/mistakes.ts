const mistakeStorageKey = "csa-v2-quiz:mistake-ids";
const mistakeChangeEvent = "csa-v2-quiz:mistakes-changed";
const emptyMistakeIds: string[] = [];
let cachedMistakeRawValue: string | null | undefined;
let cachedMistakeIds: string[] = emptyMistakeIds;

export type MistakeAnswer = {
  questionId: string;
  isCorrect: boolean;
};

export function getMistakeIds(storage: Storage): string[] {
  const rawValue = storage.getItem(mistakeStorageKey);

  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (questionId): questionId is string => typeof questionId === "string",
    );
  } catch {
    return [];
  }
}

export function getMistakeSnapshot(): string[] {
  if (typeof window === "undefined") {
    return emptyMistakeIds;
  }

  const rawValue = window.localStorage.getItem(mistakeStorageKey);

  if (rawValue === cachedMistakeRawValue) {
    return cachedMistakeIds;
  }

  cachedMistakeRawValue = rawValue;
  cachedMistakeIds = parseMistakeIds(rawValue);

  return cachedMistakeIds;
}

export function getMistakeServerSnapshot(): string[] {
  return emptyMistakeIds;
}

export function subscribeToMistakeChanges(listener: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === mistakeStorageKey || event.key === null) {
      listener();
    }
  };

  const onCustomEvent = () => listener();

  window.addEventListener("storage", onStorage);
  window.addEventListener(mistakeChangeEvent, onCustomEvent);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(mistakeChangeEvent, onCustomEvent);
  };
}

export function recordMistake(storage: Storage, questionId: string): string[] {
  const nextIds = addUnique(getMistakeIds(storage), questionId);
  writeMistakes(storage, nextIds);
  return nextIds;
}

export function removeMistake(storage: Storage, questionId: string): string[] {
  const nextIds = getMistakeIds(storage).filter(
    (mistakeId) => mistakeId !== questionId,
  );
  writeMistakes(storage, nextIds);
  return nextIds;
}

export function clearMistakes(storage: Storage): string[] {
  writeMistakes(storage, []);
  return [];
}

export function syncMistakeForAnswer(
  storage: Storage,
  answer: MistakeAnswer,
): string[] {
  if (answer.isCorrect) {
    return removeMistake(storage, answer.questionId);
  }

  return recordMistake(storage, answer.questionId);
}

function addUnique(values: string[], value: string): string[] {
  if (values.includes(value)) {
    return values;
  }

  return [...values, value];
}

function writeMistakes(storage: Storage, questionIds: string[]) {
  const rawValue = JSON.stringify(questionIds);
  storage.setItem(mistakeStorageKey, rawValue);
  cachedMistakeRawValue = rawValue;
  cachedMistakeIds = questionIds;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(mistakeChangeEvent));
  }
}

function parseMistakeIds(rawValue: string | null): string[] {
  if (!rawValue) {
    return emptyMistakeIds;
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return emptyMistakeIds;
    }

    const nextIds = parsedValue.filter(
      (questionId): questionId is string => typeof questionId === "string",
    );

    return nextIds.length === 0 ? emptyMistakeIds : nextIds;
  } catch {
    return emptyMistakeIds;
  }
}
