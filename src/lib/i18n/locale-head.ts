import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/locales';

export function resolveLocaleParam(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}
