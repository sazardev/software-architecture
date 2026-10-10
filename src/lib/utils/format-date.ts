import type { Locale } from '@/lib/i18n/locales';

const formatters = new Map<Locale, Intl.DateTimeFormat>();

function getFormatter(locale: Locale): Intl.DateTimeFormat {
  const existing = formatters.get(locale);

  if (existing !== undefined) {
    return existing;
  }

  const formatter = new Intl.DateTimeFormat(locale, { dateStyle: 'medium' });
  formatters.set(locale, formatter);

  return formatter;
}

export function formatDate(isoDate: string, locale: Locale): string {
  return getFormatter(locale).format(new Date(`${isoDate}T00:00:00`));
}
