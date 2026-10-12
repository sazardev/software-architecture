import { createFileRoute } from '@tanstack/react-router';

import {
  ClosingCta,
  HomeHero,
  LatestDocs,
  PrinciplesBand,
  SectionPaths,
  TagIndex,
  type HomeStats,
} from '@/components/organisms';
import { site } from '@/lib/config/site';
import {
  getDocsByLocale,
  getDocsBySection,
  getLatestDocs,
  getTopTags,
} from '@/lib/content/registry';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { getMessages } from '@/lib/i18n/messages';
import { buildPageHead } from '@/lib/seo/meta';

export const Route = createFileRoute('/$locale/')({
  component: HomePage,
  head: ({ params }) => {
    const locale = resolveLocaleParam(params.locale);
    const messages = getMessages(locale);

    return buildPageHead({
      description: messages.site.description,
      locale,
      path: `/${locale}`,
      title: site.name,
    });
  },
});

function HomePage() {
  const { locale: localeParam } = Route.useParams();
  const locale = resolveLocaleParam(localeParam);
  const groups = getDocsBySection(locale);
  const stats: HomeStats = {
    articles: getDocsByLocale(locale).length,
    minutes: getDocsByLocale(locale).reduce((sum, doc) => sum + doc.readingMinutes, 0),
    sections: groups.length,
    updatedAt: getLatestDocs(locale, 1)[0]?.updatedAt ?? '1970-01-01',
  };

  return (
    <>
      <HomeHero stats={stats} />
      <SectionPaths groups={groups} />
      <LatestDocs docs={getLatestDocs(locale, 4)} />
      <TagIndex tags={getTopTags(locale, 14)} />
      <PrinciplesBand />
      <ClosingCta />
    </>
  );
}
