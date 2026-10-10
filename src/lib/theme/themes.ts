export type ThemePreference = 'dark' | 'light' | 'system';

export type ResolvedTheme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'sa:theme';

const themePreferences: ThemePreference[] = ['light', 'dark', 'system'];

const preferenceSet = new Set<string>(themePreferences);

export function isThemePreference(value: string): value is ThemePreference {
  return preferenceSet.has(value);
}

export function parseThemePreference(value: unknown): ThemePreference {
  return typeof value === 'string' && isThemePreference(value) ? value : 'system';
}

export function resolveTheme(preference: ThemePreference, isSystemDark: boolean): ResolvedTheme {
  if (preference === 'system') {
    return isSystemDark ? 'dark' : 'light';
  }

  return preference;
}

export function nextThemePreference(current: ThemePreference): ThemePreference {
  const index = themePreferences.indexOf(current);
  const next = themePreferences[(index + 1) % themePreferences.length];

  return next ?? 'system';
}
