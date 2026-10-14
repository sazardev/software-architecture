import { createFileRoute } from '@tanstack/react-router';

import { Container, Eyebrow, Reveal } from '@/components/atoms';
import { RoadmapOverview } from '@/components/organisms';
import { resolveLocaleParam } from '@/lib/i18n/locale-head';
import { useMessages } from '@/lib/i18n/use-messages';
import { getRoadmapPaths } from '@/lib/roadmap/roadmap-registry';
import { roadmapIndexSeo, toRouteHead } from '@/lib/seo/page-heads';
import { padNumber } from '@/lib/utils/pad-number';

export const Route = createFileRoute('/$locale/roadmap/')({
  component: RoadmapIndexPage,
  head: ({ params }) => toRouteHead(roadmapIndexSeo(resolveLocaleParam(params.locale))),
});

function RoadmapIndexPage() {
  const { locale: localeParam } = Route.useParams();
  const locale = resolveLocaleParam(localeParam);
  const messages = useMessages();
  const text = messages.roadmap;
  const paths = getRoadmapPaths(locale);
  const steps = paths.reduce((total, path) => total + path.steps.length, 0);

  return (
    <>
      <div className="bp-grid border-b border-neutral-200 dark:border-neutral-800">
        <Container className="space-y-12 py-14 sm:py-20">
          <div className="max-w-3xl animate-rise space-y-5">
            <Eyebrow>
              {text.eyebrow} · {padNumber(paths.length)}
            </Eyebrow>
            <h1
              className="font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] font-medium tracking-[-0.03em] text-neutral-950 dark:text-neutral-50"
              style={{ fontVariationSettings: "'opsz' 144" }}
            >
              {text.title}
            </h1>
            <p className="font-serif text-xl leading-relaxed text-pretty text-neutral-600 dark:text-neutral-300">
              {text.description}
            </p>
            <p className="font-mono text-xs tracking-[0.14em] text-neutral-500 uppercase dark:text-neutral-400">
              {text.stepCount(steps)} · {messages.docs.articleCount(steps)}
            </p>
          </div>
          <ol className="grid gap-px border border-neutral-400 bg-neutral-400 sm:grid-cols-3 dark:border-neutral-600 dark:bg-neutral-600">
            {text.howItWorks.map((item, index) => (
              <li className="bg-neutral-50 p-6 dark:bg-neutral-950" key={item.title}>
                <Reveal className="space-y-2" delay={index * 90}>
                  <p className="font-mono text-xs tracking-[0.16em] text-accent-700 dark:text-accent-400">
                    {padNumber(index + 1)}
                  </p>
                  <h2 className="font-display text-xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
                    {item.title}
                  </h2>
                  <p className="font-serif text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                    {item.body}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </div>
      <Container className="py-14 sm:py-20">
        <RoadmapOverview paths={paths} />
      </Container>
    </>
  );
}
