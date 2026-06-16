"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  getNextTheme,
  isThemePreference,
  resolveTheme,
  themeStorageKey,
  type ThemePreference,
} from "@/lib/theme/theme";

export function ThemeSwitch() {
  const [theme, setTheme] = useState<ThemePreference>("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function syncTheme() {
      const storedPreference = window.localStorage.getItem(themeStorageKey);
      const nextTheme = resolveTheme(
        isThemePreference(storedPreference) ? storedPreference : null,
        mediaQuery.matches,
      );

      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      setTheme(nextTheme);
    }

    syncTheme();
    mediaQuery.addEventListener("change", syncTheme);
    window.addEventListener("storage", syncTheme);

    return () => {
      mediaQuery.removeEventListener("change", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, []);

  function toggleTheme() {
    const nextTheme = getNextTheme(theme);

    window.localStorage.setItem(themeStorageKey, nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    setTheme(nextTheme);
  }

  const isDark = theme === "dark";

  return (
    <Button
      aria-label={isDark ? "切換淺色模式" : "切換深色模式"}
      size="icon"
      type="button"
      variant="outline"
      onClick={toggleTheme}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
