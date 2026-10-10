import { createContext, use } from 'react';

import { defaultLocale, type Locale } from '@/lib/i18n/locales';

export const LocaleContext = createContext<Locale>(defaultLocale);

export function useLocale(): Locale {
  return use(LocaleContext);
}
