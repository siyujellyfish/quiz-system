export type QuizMode = "practice" | "mistakes" | "exam";

const selectionKeyPrefix = "csa.quiz.selectedBank";

export function getSelectedBankId(
  storage: Storage,
  mode: QuizMode,
  availableBankIds: string[],
  defaultBankId: string,
): string {
  const selectedBankId = storage.getItem(getSelectionKey(mode));

  if (selectedBankId && availableBankIds.includes(selectedBankId)) {
    return selectedBankId;
  }

  return defaultBankId;
}

export function setSelectedBankId(
  storage: Storage,
  mode: QuizMode,
  bankId: string,
): void {
  storage.setItem(getSelectionKey(mode), bankId);
}

function getSelectionKey(mode: QuizMode): string {
  return `${selectionKeyPrefix}.${mode}`;
}
