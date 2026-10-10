import { describe, expect, it } from 'vitest';

import {
  defaultLocale,
  isLocale,
  localeFromPathname,
  preferredLocale,
  switchLocalePath,
} from '@/lib/i18n/locales';

describe('locales', () => {
  it('valida códigos de idioma', () => {
    expect(isLocale('es')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  it('cambia el idioma conservando la ruta', () => {
    expect(switchLocalePath('/es/docs/solid', 'en')).toBe('/en/docs/solid');
    expect(switchLocalePath('/en', 'es')).toBe('/es');
    expect(switchLocalePath('/', 'en')).toBe('/en');
  });

  it('prefija el idioma cuando la ruta no está localizada', () => {
    expect(switchLocalePath('/foo', 'en')).toBe('/en/foo');
  });

  it('detecta el idioma preferido desde navigator.languages', () => {
    expect(preferredLocale(['fr-FR', 'en-US'])).toBe('en');
    expect(preferredLocale(['es-MX'])).toBe('es');
    expect(preferredLocale([])).toBe(defaultLocale);
  });

  it('resuelve el idioma desde el pathname', () => {
    expect(localeFromPathname('/en/docs/solid')).toBe('en');
    expect(localeFromPathname('/es')).toBe('es');
    expect(localeFromPathname('/fr/docs')).toBe(defaultLocale);
    expect(localeFromPathname('/')).toBe(defaultLocale);
  });
});
