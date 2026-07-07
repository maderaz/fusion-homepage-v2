import { useState, useCallback, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  const toggleTheme = useCallback(() => {
    const next = isDark ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("fusion-theme", next);
    } catch {
      /* localStorage unavailable */
    }
    setIsDark(!isDark);
  }, [isDark]);

  // Sync with external changes (e.g., another island toggling theme)
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return {
    isDark,
    toggleTheme,
    theme: (isDark ? "dark" : "light") as "dark" | "light",
  };
}
