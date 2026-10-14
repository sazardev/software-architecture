import { Link } from '@tanstack/react-router';

import { Button, Container, Eyebrow, SectionGlyph, buttonVariants } from '@/components/atoms';
import { RoadmapMeter, TitleBlock } from '@/components/molecules';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import {
  countDone,
  getNextPendingStep,
  getRoadmapText,
  type RoadmapPath,
} from '@/lib/roadmap/roadmap-registry';
import { useRoadmapProgress } from '@/lib/roadmap/use-roadmap-progress';
import { padNumber } from '@/lib/utils/pad-number';

type RoadmapHeaderProps = Readonly<{
  path: RoadmapPath;
}>;

/**
Cabecera de un roadmap: identidad (R-NN), cajetín con sus cifras, progreso y «continuar».
*/
export function RoadmapHeader({ path }: RoadmapHeaderProps) {
  const locale = useLocale();
  const messages = useMessages();
  const text = messages.roadmap;
  const { clear, done } = useRoadmapProgress();
  const roadmapText = getRoadmapText(path.roadmap, locale);
  const doneCount = countDone(path, done);
  const next = getNextPendingStep(path, done);
  const slugs = path.steps.map((step) => step.entry.slug);

  return (
    <header className="bp-grid border-b border-neutral-200 dark:border-neutral-800">
      <Container className="grid gap-x-14 gap-y-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Link
            className="inline-flex animate-rise font-sans text-sm text-neutral-600 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-50"
            params={{ locale }}
            to="/$locale/roadmap"
          >
            ← {text.allRoadmaps}
          </Link>
          <div className="flex animate-rise items-center gap-4" style={{ animationDelay: '80ms' }}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-neutral-400 text-neutral-800 dark:border-neutral-600 dark:text-neutral-200">
              <SectionGlyph icon={path.roadmap.icon} id={path.roadmap.id} />
            </span>
            <Eyebrow>
              {text.title} · R-{padNumber(path.number)}
            </Eyebrow>
          </div>
          <h1
            className="animate-rise font-display text-[clamp(2.4rem,5.4vw,4.2rem)] leading-[1.03] font-medium tracking-[-0.03em] text-balance text-neutral-950 dark:text-neutral-50"
            style={{ animationDelay: '140ms', fontVariationSettings: "'opsz' 144" }}
          >
            {roadmapText.label}
          </h1>
          <p
            className="max-w-2xl animate-rise font-serif text-xl leading-relaxed text-pretty text-neutral-600 dark:text-neutral-300"
            style={{ animationDelay: '220ms' }}
          >
            {roadmapText.description}
          </p>
        </div>

        <div
          className="flex animate-rise flex-col gap-6 lg:pt-10"
          style={{ animationDelay: '300ms' }}
        >
          <TitleBlock
            layout="row"
            rows={[
              { label: text.stagesLabel, value: padNumber(path.stages.length) },
              { label: text.stepsLabel, value: padNumber(path.steps.length) },
              {
                label: messages.blueprint.reading,
                value: `${Math.round(path.readingMinutes / 60)} h`,
              },
              { label: text.progressLabel, value: `${doneCount}/${path.steps.length}` },
            ]}
          />
          <RoadmapMeter
            done={doneCount}
            label={text.progress(doneCount, path.steps.length)}
            total={path.steps.length}
          />
          <div className="flex flex-wrap gap-2.5">
            {next === undefined ? (
              <p className="font-display text-xl text-neutral-950 dark:text-neutral-50">
                ✓ {text.completed}
              </p>
            ) : (
              <Link
                className={buttonVariants({ size: 'lg' })}
                params={{ locale, slug: next.entry.slug }}
                to="/$locale/docs/$slug"
              >
                {doneCount === 0 ? text.start : text.continue}
                <span aria-hidden="true">→</span>
              </Link>
            )}
            {doneCount > 0 ? (
              <Button
                onClick={() => {
                  clear(slugs);
                }}
                size="lg"
                variant="ghost"
              >
                {text.reset}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </header>
  );
}
