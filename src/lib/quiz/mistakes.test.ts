import { describe, expect, it } from "vitest";

import {
  clearMistakes,
  getMistakeIds,
  recordMistake,
  removeMistake,
  syncMistakeForAnswer,
} from "./mistakes";

describe("mistake storage", () => {
  it("persists wrong answers without duplicates", () => {
    const storage = createMemoryStorage();

    recordMistake(storage, "q1");
    recordMistake(storage, "q1");
    recordMistake(storage, "q2");

    expect(getMistakeIds(storage)).toEqual(["q1", "q2"]);
  });

  it("removes a mistake after a correct answer and clears all mistakes", () => {
    const storage = createMemoryStorage();

    recordMistake(storage, "q1");
    recordMistake(storage, "q2");
    syncMistakeForAnswer(storage, { questionId: "q1", isCorrect: true });
    removeMistake(storage, "missing");

    expect(getMistakeIds(storage)).toEqual(["q2"]);

    clearMistakes(storage);

    expect(getMistakeIds(storage)).toEqual([]);
  });

  it("keeps a mistake after an incorrect answer", () => {
    const storage = createMemoryStorage();

    syncMistakeForAnswer(storage, { questionId: "q3", isCorrect: false });

    expect(getMistakeIds(storage)).toEqual(["q3"]);
  });
});

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();

  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (key) => data.get(key) ?? null,
    key: (index) => Array.from(data.keys())[index] ?? null,
    removeItem: (key) => data.delete(key),
    setItem: (key, value) => data.set(key, value),
  };
}
