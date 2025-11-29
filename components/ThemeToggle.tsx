"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border px-3 py-1 rounded"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
