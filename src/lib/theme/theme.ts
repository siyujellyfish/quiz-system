export const themeStorageKey = "csa-theme-preference";

export type ThemePreference = "light" | "dark";

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark";
}

export function resolveTheme(
  storedPreference: ThemePreference | null,
  prefersDark: boolean,
): ThemePreference {
  if (isThemePreference(storedPreference)) {
    return storedPreference;
  }

  return prefersDark ? "dark" : "light";
}

export function getNextTheme(currentTheme: ThemePreference): ThemePreference {
  return currentTheme === "dark" ? "light" : "dark";
}

export function themeClassName(theme: ThemePreference): string {
  return theme === "dark" ? "dark" : "";
}
