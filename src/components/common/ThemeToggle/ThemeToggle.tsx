"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  applyTheme,
  isDarkTheme,
  storeTheme,
  subscribeToTheme,
} from "@/lib/theme";

interface ThemeToggleProps {
  strings: Pick<Dictionary["header"], "themeToDark" | "themeToLight">;
}

export const ThemeToggle = ({ strings }: ThemeToggleProps) => {
  const dark = useSyncExternalStore(subscribeToTheme, isDarkTheme, () => false);

  // Strict Mode's remount in development drops the class the inline script set.
  useLayoutEffect(applyTheme, []);

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label={dark ? strings.themeToLight : strings.themeToDark}
      onClick={() => storeTheme(!dark)}
    >
      <Sun className="hidden dark:block" />
      <Moon className="dark:hidden" />
    </Button>
  );
};
