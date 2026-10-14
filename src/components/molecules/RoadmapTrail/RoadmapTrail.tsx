import { Link, useNavigate } from '@tanstack/react-router';

import { BlueprintFrame, Button, Eyebrow, buttonVariants } from '@/components/atoms';
import type { ContentEntry } from '@/lib/content/types';
import { useMessages } from '@/lib/i18n/use-messages';
import {
  getDocRoadmapPosition,
  getRoadmapText,
  getStageText,
  type RoadmapStep,
} from '@/lib/roadmap/roadmap-registry';
import { useRoadmapProgress } from '@/lib/roadmap/use-roadmap-progress';
import { cn } from '@/lib/utils/cn';
import { padNumber } from '@/lib/utils/pad-number';

type RoadmapTrailProps = Readonly<{
  className?: string;
  entry: ContentEntry;
}>;

type StopState = 'current' | 'done' | 'pending';

const stopClass: Record<StopState, string> = {
  current:
    'h-3.5 w-3.5 border-accent-600 bg-accent-600 ring-4 ring-accent-500/20 dark:border-accent-400 dark:bg-accent-400',
  done: 'h-2.5 w-2.5 border-neutral-900 bg-neutral-900 dark:border-neutral-100 dark:bg-neutral-100',
  pending:
    'h-2.5 w-2.5 border-neutral-400 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-950',
};

/**
«Estás aquí» del artículo dentro de su roadmap: posición, línea de paradas y el siguiente paso.
*/
export function RoadmapTrail({ className, entry }: RoadmapTrailProps) {
  const messages = useMessages();
  const navigate = useNavigate();
  const { done, setDone } = useRoadmapProgress();
  const position = getDocRoadmapPosition(entry);

  if (position === undefined) {
    return null;
  }

  const { locale } = entry;
  const { next, path, stage, step } = position;
  const text = messages.roadmap;
  const isDone = done.has(entry.slug);

  function stateOf(candidate: RoadmapStep): StopState {
    if (candidate.entry.slug === entry.slug) {
      return 'current';
    }

    return done.has(candidate.entry.slug) ? 'done' : 'pending';
  }

  function completeAndContinue() {
    setDone(entry.slug, true);

    if (next !== undefined) {
      void navigate({
        params: { locale, slug: next.entry.slug },
        to: '/$locale/docs/$slug',
      });
    }
  }

  return (
    <BlueprintFrame className={cn('mt-14 bg-neutral-50 dark:bg-neutral-950', className)}>
      <section aria-label={text.inRoadmap} className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <Eyebrow>
              {text.inRoadmap} · R-{padNumber(path.number)}
            </Eyebrow>
            <Link
              className="link-underline font-display text-2xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50"
              params={{ locale, roadmap: path.roadmap.id }}
              to="/$locale/roadmap/$roadmap"
            >
              {getRoadmapText(path.roadmap, locale).label}
            </Link>
            <p className="font-serif text-base text-neutral-600 dark:text-neutral-400">
              {text.stage} {padNumber(stage.index + 1)} · {getStageText(stage.stage, locale).label}
            </p>
          </div>
          <p className="font-mono text-xs tracking-[0.14em] text-neutral-500 uppercase dark:text-neutral-400">
            {text.stepOf(step.number, path.steps.length)}
          </p>
        </div>

        <ol aria-label={text.stepList} className="flex flex-wrap items-center gap-y-3">
          {path.stages.map((group) => (
            <li className="flex items-center" key={group.stage.id}>
              {group.index > 0 ? (
                <span
                  aria-hidden="true"
                  className="mx-2 h-3 border-l border-neutral-400 dark:border-neutral-600"
                />
              ) : null}
              <ol className="flex items-center">
                {group.steps.map((candidate, index) => {
                  const state = stateOf(candidate);

                  return (
                    <li className="flex items-center" key={candidate.entry.slug}>
                      {index > 0 ? (
                        <span
                          aria-hidden="true"
                          className="h-px w-2.5 bg-neutral-300 sm:w-3.5 dark:bg-neutral-700"
                        />
                      ) : null}
                      <Link
                        aria-current={state === 'current' ? 'step' : undefined}
                        aria-label={`${padNumber(candidate.number)} · ${candidate.entry.title}`}
                        className="flex h-6 items-center justify-center"
                        params={{ locale, slug: candidate.entry.slug }}
                        title={candidate.entry.title}
                        to="/$locale/docs/$slug"
                      >
                        <span
                          className={cn(
                            'block rounded-full border transition-transform duration-300 hover:scale-125',
                            stopClass[state],
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-3 border-t border-dashed border-neutral-300 pt-6 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-700">
          {next === undefined ? (
            <p className="font-serif text-lg text-neutral-700 dark:text-neutral-300">
              {isDone ? `✓ ${text.completed}` : text.youAreHere}
            </p>
          ) : (
            <p className="min-w-0 font-serif text-lg text-neutral-700 dark:text-neutral-300">
              <span className="mr-2 font-mono text-xs tracking-[0.14em] text-accent-700 uppercase dark:text-accent-400">
                {text.nextStep}
              </span>
              {next.entry.title}
            </p>
          )}
          <div className="flex shrink-0 flex-wrap gap-2.5">
            <Button
              aria-pressed={isDone}
              onClick={() => {
                setDone(entry.slug, !isDone);
              }}
              size="sm"
              variant="secondary"
            >
              {isDone ? `✓ ${text.markedDone}` : text.markDone}
            </Button>
            {next === undefined ? (
              <Link
                className={buttonVariants({ size: 'sm' })}
                params={{ locale, roadmap: path.roadmap.id }}
                to="/$locale/roadmap/$roadmap"
              >
                {text.open} →
              </Link>
            ) : (
              <Button onClick={completeAndContinue} size="sm">
                {text.markDoneNext} →
              </Button>
            )}
          </div>
        </div>
      </section>
    </BlueprintFrame>
  );
}
