import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ThemeContext, type ThemeContextValue } from '@/lib/theme/theme-context';
import {
  parseThemePreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from '@/lib/theme/themes';

type ThemeProviderProps = Readonly<{
  children: ReactNode;
}>;

const darkQuery = '(prefers-color-scheme: dark)';
function isSystemDark(): boolean {
  const canQuery = typeof window !== 'undefined' && typeof matchMedia === 'function';

  return canQuery && matchMedia(darkQuery).matches;
}
function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }

  try {
    return parseThemePreference(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    /*
    localStorage puede no estar disponible
    */
    return 'system';
  }
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [preferenceState, setPreferenceState] = useState<ThemePreference>(() =>
    readStoredPreference(),
  );
  const [prefersDark, setPrefersDark] = useState<boolean>(() => isSystemDark());

  const resolvedTheme = resolveTheme(preferenceState, prefersDark);

  useEffect(() => {
    const media = matchMedia(darkQuery);

    function handleChange(event: MediaQueryListEvent) {
      setPrefersDark(event.matches);
    }

    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);

    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /*
      localStorage puede no estar disponible
      */
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference: preferenceState, resolvedTheme, setPreference }),
    [preferenceState, resolvedTheme, setPreference],
  );

  return <ThemeContext value={value}>{children}</ThemeContext>;
}
