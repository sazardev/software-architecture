import { Link } from '@tanstack/react-router';

import { Eyebrow, Reveal } from '@/components/atoms';
import { RoadmapMeter } from '@/components/molecules';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import {
  getNextPendingStep,
  getStageText,
  type RoadmapPath,
  type RoadmapStep,
} from '@/lib/roadmap/roadmap-registry';
import { useRoadmapProgress } from '@/lib/roadmap/use-roadmap-progress';
import { cn } from '@/lib/utils/cn';
import { padNumber } from '@/lib/utils/pad-number';

type RoadmapStepListProps = Readonly<{
  path: RoadmapPath;
}>;

type StepRowProps = Readonly<{
  delay: number;
  isDone: boolean;
  isNext: boolean;
  onToggle: () => void;
  step: RoadmapStep;
}>;

function StepRow({ delay, isDone, isNext, onToggle, step }: StepRowProps) {
  const locale = useLocale();
  const messages = useMessages();
  const { entry } = step;

  return (
    <li className="group relative pb-8 last:pb-0">
      <span
        aria-hidden="true"
        className="absolute top-10 bottom-0 left-5 w-px bg-neutral-300 group-last:hidden dark:bg-neutral-700"
      />
      <Reveal className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4" delay={delay}>
        <button
          aria-label={`${isDone ? messages.roadmap.undo : messages.roadmap.markDone}: ${entry.title}`}
          aria-pressed={isDone}
          className={cn(
            'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-colors duration-300',
            isDone &&
              'border-neutral-900 bg-neutral-900 text-neutral-50 dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-950',
            !isDone &&
              isNext &&
              'border-accent-600 bg-accent-600 text-neutral-50 dark:border-accent-500 dark:bg-accent-500',
            !isDone &&
              !isNext &&
              'border-neutral-400 bg-neutral-50 text-neutral-700 hover:border-neutral-900 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:border-neutral-300',
          )}
          onClick={onToggle}
          type="button"
        >
          {isDone ? '✓' : padNumber(step.number)}
        </button>
        <Link
          className="group/step block min-w-0 pt-1.5"
          params={{ locale, slug: entry.slug }}
          to="/$locale/docs/$slug"
        >
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-display text-xl leading-snug font-medium tracking-tight text-neutral-950 transition-colors group-hover/step:text-brand-700 dark:text-neutral-50 dark:group-hover/step:text-brand-300">
              {entry.title}
            </span>
            {isNext ? (
              <span className="font-mono text-[0.65rem] tracking-[0.16em] text-accent-700 uppercase dark:text-accent-400">
                ← {messages.roadmap.legend.next}
              </span>
            ) : null}
          </span>
          <span className="mt-1.5 line-clamp-2 block font-serif text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {entry.description}
          </span>
          <span className="mt-2 block font-mono text-[0.68rem] tracking-[0.1em] text-neutral-500 uppercase dark:text-neutral-400">
            {messages.docs.readingTime(entry.readingMinutes)}
          </span>
        </Link>
      </Reveal>
    </li>
  );
}

/**
La ruta como lista ordenada por etapas: lectura secuencial, accesible y cómoda en móvil.
*/
export function RoadmapStepList({ path }: RoadmapStepListProps) {
  const locale = useLocale();
  const messages = useMessages();
  const { done, setDone } = useRoadmapProgress();
  const nextSlug = getNextPendingStep(path, done)?.entry.slug;

  return (
    <div className="space-y-14">
      {path.stages.map((stage) => {
        const text = getStageText(stage.stage, locale);
        const stageDone = stage.steps.filter((step) => done.has(step.entry.slug)).length;

        return (
          <section
            aria-labelledby={`etapa-${stage.stage.id}`}
            className="grid gap-x-12 gap-y-6 lg:grid-cols-[16rem_minmax(0,1fr)]"
            key={stage.stage.id}
          >
            <Reveal className="space-y-3 lg:sticky lg:top-24 lg:self-start">
              <Eyebrow>
                {messages.roadmap.stage} {padNumber(stage.index + 1)}
              </Eyebrow>
              <h3
                className="font-display text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50"
                id={`etapa-${stage.stage.id}`}
              >
                {text.label}
              </h3>
              <p className="font-serif text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                {text.description}
              </p>
              <RoadmapMeter
                className="pt-2"
                done={stageDone}
                label={messages.roadmap.progress(stageDone, stage.steps.length)}
                total={stage.steps.length}
              />
            </Reveal>
            <ol className="min-w-0">
              {stage.steps.map((step, index) => (
                <StepRow
                  delay={index * 50}
                  isDone={done.has(step.entry.slug)}
                  isNext={step.entry.slug === nextSlug}
                  key={step.entry.slug}
                  onToggle={() => {
                    setDone(step.entry.slug, !done.has(step.entry.slug));
                  }}
                  step={step}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
