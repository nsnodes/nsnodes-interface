"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined
);

const THEME_STORAGE_KEY = "theme";
const THEME_CHANGE_EVENT = "nsnodes-theme-change";

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

function readStoredTheme(fallback: Theme): Theme {
  if (typeof window === "undefined") return fallback;

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(storedTheme) ? storedTheme : fallback;
}

function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const getThemeSnapshot = useCallback(
    () => readStoredTheme(defaultTheme),
    [defaultTheme]
  );
  const getServerThemeSnapshot = useCallback(() => defaultTheme, [defaultTheme]);
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((theme: Theme) => {
    applyTheme(theme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
