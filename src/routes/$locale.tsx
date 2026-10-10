import { Outlet, createFileRoute, notFound } from '@tanstack/react-router';

import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { isLocale } from '@/lib/i18n/locales';
import { getMessages } from '@/lib/i18n/messages';
import { websiteJsonLd } from '@/lib/seo/json-ld';

export const Route = createFileRoute('/$locale')({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) {
      throw notFound();
    }
  },
  component: LocaleLayout,
  head: ({ params }) => {
    const locale = resolveLocaleParam(params.locale);

    return {
      scripts: [
        {
          children: websiteJsonLd(locale, getMessages(locale).site.description),
          type: 'application/ld+json',
        },
      ],
    };
  },
});

function LocaleLayout() {
  return <Outlet />;
}
