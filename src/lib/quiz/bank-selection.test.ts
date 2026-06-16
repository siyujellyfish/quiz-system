import { describe, expect, it } from "vitest";

import {
  getSelectedBankId,
  setSelectedBankId,
} from "./bank-selection";

describe("bank selection storage", () => {
  it("falls back to the default bank when no saved selection exists", () => {
    const storage = createMemoryStorage();

    expect(
      getSelectedBankId(storage, "practice", ["csa-v2-all"], "csa-v2-all"),
    ).toBe("csa-v2-all");
  });

  it("stores each mode independently", () => {
    const storage = createMemoryStorage();

    setSelectedBankId(storage, "practice", "csa-v2-all");
    setSelectedBankId(storage, "exam", "future-exam");

    expect(
      getSelectedBankId(
        storage,
        "practice",
        ["csa-v2-all", "future-exam"],
        "csa-v2-all",
      ),
    ).toBe("csa-v2-all");
    expect(
      getSelectedBankId(
        storage,
        "exam",
        ["csa-v2-all", "future-exam"],
        "csa-v2-all",
      ),
    ).toBe("future-exam");
  });

  it("ignores saved bank ids that are not available anymore", () => {
    const storage = createMemoryStorage();

    setSelectedBankId(storage, "mistakes", "removed-bank");

    expect(
      getSelectedBankId(storage, "mistakes", ["csa-v2-all"], "csa-v2-all"),
    ).toBe("csa-v2-all");
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
