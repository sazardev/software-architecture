import { createFileRoute, redirect } from '@tanstack/react-router';

import { preferredLocale } from '@/lib/i18n/locales';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const languages = typeof navigator === 'undefined' ? [] : navigator.languages;

    throw redirect({
      params: { locale: preferredLocale(languages) },
      to: '/$locale',
    });
  },
});
