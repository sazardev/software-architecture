import { createFileRoute } from '@tanstack/react-router';

import {
  ClosingCta,
  HomeHero,
  LatestDocs,
  PrinciplesBand,
  SectionPaths,
  type HomeStats,
} from '@/components/organisms';
import { getDocsByLocale, getDocsBySection, getLatestDocs } from '@/lib/content/registry';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { homeSeo, toRouteHead } from '@/lib/seo/page-heads';

export const Route = createFileRoute('/$locale/')({
  component: HomePage,
  head: ({ params }) => toRouteHead(homeSeo(resolveLocaleParam(params.locale))),
});

function HomePage() {
  const { locale: localeParam } = Route.useParams();
  const locale = resolveLocaleParam(localeParam);
  const groups = getDocsBySection(locale);
  const stats: HomeStats = {
    articles: getDocsByLocale(locale).length,
    updatedAt: getLatestDocs(locale, 1)[0]?.updatedAt ?? '1970-01-01',
  };

  return (
    <>
      <HomeHero stats={stats} />
      <LatestDocs docs={getLatestDocs(locale, 4)} />
      <SectionPaths groups={groups} />
      <PrinciplesBand />
      <ClosingCta />
    </>
  );
}
