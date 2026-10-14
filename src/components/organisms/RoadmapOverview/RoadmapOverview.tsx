import { Link } from '@tanstack/react-router';

import { BlueprintFrame, Reveal, SectionGlyph } from '@/components/atoms';
import { RoadmapMeter } from '@/components/molecules';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import {
  countDone,
  getNextPendingStep,
  getRoadmapText,
  getStageText,
  type RoadmapPath,
} from '@/lib/roadmap/roadmap-registry';
import { useRoadmapProgress } from '@/lib/roadmap/use-roadmap-progress';
import { padNumber } from '@/lib/utils/pad-number';

import { MiniMetro } from './MiniMetro';

type RoadmapOverviewProps = Readonly<{
  paths: RoadmapPath[];
}>;

type RoadmapCardProps = Readonly<{
  done: ReadonlySet<string>;
  path: RoadmapPath;
}>;

function RoadmapCard({ done, path }: RoadmapCardProps) {
  const locale = useLocale();
  const messages = useMessages();
  const text = messages.roadmap;
  const roadmapText = getRoadmapText(path.roadmap, locale);
  const doneCount = countDone(path, done);
  const next = getNextPendingStep(path, done);
  let cta = text.start;

  if (next === undefined) {
    cta = text.completed;
  } else if (doneCount > 0) {
    cta = text.continue;
  }

  return (
    <BlueprintFrame className="group h-full bg-neutral-50 transition-colors duration-300 hover:border-neutral-900 dark:bg-neutral-950 dark:hover:border-neutral-300">
      <Link
        className="flex h-full flex-col gap-5 p-6 sm:p-7"
        params={{ locale, roadmap: path.roadmap.id }}
        to="/$locale/roadmap/$roadmap"
      >
        <span className="flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center border border-neutral-300 text-neutral-800 transition-colors duration-300 group-hover:border-accent-500 group-hover:text-accent-700 dark:border-neutral-700 dark:text-neutral-200 dark:group-hover:text-accent-400">
            <SectionGlyph className="h-6 w-6" icon={path.roadmap.icon} id={path.roadmap.id} />
          </span>
          <span className="font-mono text-xs tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
            R-{padNumber(path.number)}
          </span>
        </span>
        <span className="space-y-2">
          <span className="block font-display text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50">
            {roadmapText.label}
          </span>
          <span className="line-clamp-3 block font-serif text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {roadmapText.description}
          </span>
        </span>
        <MiniMetro done={done} nextSlug={next?.entry.slug} path={path} />
        <ol className="space-y-1.5 font-sans text-sm text-neutral-700 dark:text-neutral-300">
          {path.stages.map((stage) => (
            <li className="flex items-baseline gap-3" key={stage.stage.id}>
              <span
                aria-hidden="true"
                className="font-mono text-[0.68rem] text-accent-600 dark:text-accent-400"
              >
                {padNumber(stage.index + 1)}
              </span>
              <span className="truncate">{getStageText(stage.stage, locale).label}</span>
              <span className="ml-auto shrink-0 font-mono text-[0.68rem] text-neutral-500 dark:text-neutral-400">
                {stage.steps.length}
              </span>
            </li>
          ))}
        </ol>
        <RoadmapMeter
          className="mt-auto pt-2"
          done={doneCount}
          label={text.progress(doneCount, path.steps.length)}
          total={path.steps.length}
        />
        <span className="flex items-center justify-between font-mono text-xs tracking-[0.14em] text-brand-700 uppercase dark:text-brand-300">
          <span>
            {text.readingHours(path.readingMinutes)} · {cta}
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-1.5"
          >
            →
          </span>
        </span>
      </Link>
    </BlueprintFrame>
  );
}

/**
Catálogo de roadmaps: una hoja por ruta con su trazado en miniatura y el progreso del lector.
*/
export function RoadmapOverview({ paths }: RoadmapOverviewProps) {
  const { done } = useRoadmapProgress();

  return (
    <ul className="grid [grid-template-columns:repeat(auto-fill,minmax(min(100%,21rem),1fr))] gap-7">
      {paths.map((path, index) => (
        <li key={path.roadmap.id}>
          <Reveal className="h-full" delay={index * 90}>
            <RoadmapCard done={done} path={path} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
