import type { Locale } from '@/lib/i18n/locales';
import { en } from '@/lib/i18n/messages/en';
import { es, type Messages } from '@/lib/i18n/messages/es';

const dictionaries = { en, es } satisfies Record<Locale, Messages>;

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}

export { type Messages } from '@/lib/i18n/messages/es';
