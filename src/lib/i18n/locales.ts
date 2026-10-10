import localesConfigJson from '@/lib/i18n/locales.json';

export type Locale = 'en' | 'es';

export type LocaleDefinition = {
  code: Locale;
  label: string;
  ogLocale: string;
};

const config = localesConfigJson as { default: Locale; locales: LocaleDefinition[] };

export const localeDefinitions: LocaleDefinition[] = config.locales;
export const locales: Locale[] = config.locales.map((definition) => definition.code);
export const defaultLocale: Locale = config.default;

const localeSet = new Set<string>(locales);

export function isLocale(value: string): value is Locale {
  return localeSet.has(value);
}

export function getLocaleDefinition(locale: Locale): LocaleDefinition {
  const definition = config.locales.find((entry) => entry.code === locale);

  if (definition !== undefined) {
    return definition;
  }

  const [first] = config.locales;

  if (first === undefined) {
    throw new Error('src/lib/i18n/locales.json debe definir al menos un idioma');
  }

  return first;
}

export function preferredLocale(languages: readonly string[] = []): Locale {
  for (const language of languages) {
    const code = language.toLowerCase().split('-', 1)[0];

    if (code !== undefined && isLocale(code)) {
      return code;
    }
  }

  return defaultLocale;
}

export function switchLocalePath(pathname: string, target: Locale): string {
  const segments = pathname.split('/');
  const current = segments[1];

  if (current !== undefined && isLocale(current)) {
    segments[1] = target;
    return segments.join('/');
  }

  const rest = pathname.replace(/^\/+/, '');

  return rest.length === 0 ? `/${target}` : `/${target}/${rest}`;
}

export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split('/', 2)[1];

  return segment !== undefined && isLocale(segment) ? segment : defaultLocale;
}
