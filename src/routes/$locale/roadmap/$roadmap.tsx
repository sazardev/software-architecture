import { createFileRoute, notFound } from '@tanstack/react-router';

import { Container, Eyebrow, Reveal } from '@/components/atoms';
import { RoadmapExplorer, RoadmapHeader, RoadmapStepList } from '@/components/organisms';
import { NotFoundPage } from '@/components/templates';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { useMessages } from '@/lib/i18n/use-messages';
import { getRoadmapPath } from '@/lib/roadmap/roadmap-registry';
import { roadmapIndexSeo, roadmapSeo, toRouteHead } from '@/lib/seo/page-heads';

export const Route = createFileRoute('/$locale/roadmap/$roadmap')({
  component: RoadmapPage,
  loader: ({ params }) => {
    const path = getRoadmapPath(resolveLocaleParam(params.locale), params.roadmap);

    if (path === undefined) {
      throw notFound();
    }

    return { path };
  },
  head: ({ loaderData, params }) => {
    const locale = resolveLocaleParam(params.locale);

    return toRouteHead(
      loaderData === undefined ? roadmapIndexSeo(locale) : roadmapSeo(locale, loaderData.path),
    );
  },
  notFoundComponent: RoadmapNotFound,
});

function RoadmapNotFound() {
  const messages = useMessages();

  return (
    <NotFoundPage
      description={messages.roadmap.notFoundDescription}
      title={messages.roadmap.notFoundTitle}
    />
  );
}

function RoadmapPage() {
  const { path } = Route.useLoaderData();
  const messages = useMessages();

  return (
    <>
      <RoadmapHeader path={path} />
      <Container className="py-10 sm:py-14" size="bleed">
        <RoadmapExplorer key={path.roadmap.id} path={path} />
      </Container>
      <Container className="pt-6 pb-10">
        <Reveal className="mb-12 max-w-2xl space-y-3 border-t border-neutral-400 pt-10 dark:border-neutral-600">
          <Eyebrow>{messages.roadmap.stepList}</Eyebrow>
          <h2 className="font-display text-3xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
            {messages.roadmap.stepListDescription}
          </h2>
        </Reveal>
        <RoadmapStepList path={path} />
      </Container>
    </>
  );
}
