import { describe, expect, it } from 'vitest';

import {
  isThemePreference,
  nextThemePreference,
  parseThemePreference,
  resolveTheme,
} from '@/lib/theme/themes';

describe('themes', () => {
  it('resuelve el tema efectivo según la preferencia del sistema', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('valida y normaliza preferencias', () => {
    expect(isThemePreference('dark')).toBe(true);
    expect(isThemePreference('sepia')).toBe(false);
    expect(parseThemePreference('light')).toBe('light');
    expect(parseThemePreference('hacker')).toBe('system');
    expect(parseThemePreference(undefined)).toBe('system');
  });

  it('cicla claro → oscuro → sistema → claro', () => {
    expect(nextThemePreference('light')).toBe('dark');
    expect(nextThemePreference('dark')).toBe('system');
    expect(nextThemePreference('system')).toBe('light');
  });
});
