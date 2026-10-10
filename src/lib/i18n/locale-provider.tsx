import { useEffect, type ReactNode } from 'react';

import { LocaleContext } from '@/lib/i18n/locale-context';
import type { Locale } from '@/lib/i18n/locales';

type LocaleProviderProps = Readonly<{
  children: ReactNode;
  locale: Locale;
}>;

export function LocaleProvider({ children, locale }: LocaleProviderProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <LocaleContext value={locale}>{children}</LocaleContext>;
}
