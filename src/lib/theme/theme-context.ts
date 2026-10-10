import { createContext, use } from 'react';

import type { ResolvedTheme, ThemePreference } from '@/lib/theme/themes';

export type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

export const ThemeContext = createContext<ThemeContextValue>({
  preference: 'system',
  resolvedTheme: 'light',
  setPreference: () => {
    /*
    sin provider montado
    */
  },
});

export function useTheme(): ThemeContextValue {
  return use(ThemeContext);
}
