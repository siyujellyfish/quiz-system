import { describe, expect, it } from "vitest";

import {
  getNextTheme,
  resolveTheme,
  themeClassName,
  type ThemePreference,
} from "./theme";

describe("theme preference", () => {
  it("uses a stored user preference before system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to system preference when no preference is stored", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
  });

  it("ignores invalid stored preferences", () => {
    expect(resolveTheme("sepia" as ThemePreference, true)).toBe("dark");
  });

  it("returns the opposite explicit theme for switch toggles", () => {
    expect(getNextTheme("light")).toBe("dark");
    expect(getNextTheme("dark")).toBe("light");
  });

  it("maps only dark theme to the document class", () => {
    expect(themeClassName("dark")).toBe("dark");
    expect(themeClassName("light")).toBe("");
  });
});
