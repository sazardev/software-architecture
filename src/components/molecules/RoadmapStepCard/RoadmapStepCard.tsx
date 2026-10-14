import { Link } from '@tanstack/react-router';

import { Badge, Button, buttonVariants } from '@/components/atoms';
import { useLocale } from '@/lib/i18n/locale-context';
import { useMessages } from '@/lib/i18n/use-messages';
import type { RoadmapStep } from '@/lib/roadmap/roadmap-registry';
import { cn } from '@/lib/utils/cn';
import { padNumber } from '@/lib/utils/pad-number';

import { FigureThumb } from '../FigureThumb';

type RoadmapStepCardProps = Readonly<{
  className?: string;
  isDone: boolean;
  isNext: boolean;
  onNext?: (() => void) | undefined;
  onPrevious?: (() => void) | undefined;
  onToggleDone: () => void;
  stageLabel: string;
  step: RoadmapStep;
  total: number;
}>;

const navButtonClass =
  'flex h-9 w-9 items-center justify-center border border-neutral-300 font-mono text-sm text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-950 disabled:pointer-events-none disabled:opacity-35 dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-neutral-300 dark:hover:text-neutral-50';

/**
Ficha del paso seleccionado en el plano: figura, resumen, lectura y acciones del recorrido.
*/
export function RoadmapStepCard({
  className,
  isDone,
  isNext,
  onNext,
  onPrevious,
  onToggleDone,
  stageLabel,
  step,
  total,
}: RoadmapStepCardProps) {
  const locale = useLocale();
  const messages = useMessages();
  const text = messages.roadmap;
  const { entry } = step;

  return (
    <article aria-live="polite" className={cn('flex flex-col gap-5', className)} key={entry.slug}>
      <header className="flex items-center justify-between gap-3">
        <p className="font-mono text-[0.7rem] tracking-[0.16em] text-neutral-500 uppercase dark:text-neutral-400">
          {text.step} {padNumber(step.number)}
          <span className="text-neutral-400 dark:text-neutral-600"> / {padNumber(total)}</span>
        </p>
        <div className="flex gap-1.5">
          <button
            aria-label={text.previousStep}
            className={navButtonClass}
            disabled={onPrevious === undefined}
            onClick={onPrevious}
            type="button"
          >
            ←
          </button>
          <button
            aria-label={text.nextStep}
            className={navButtonClass}
            disabled={onNext === undefined}
            onClick={onNext}
            type="button"
          >
            →
          </button>
        </div>
      </header>
      <FigureThumb className="animate-fade" slug={entry.slug} />
      <div className="animate-rise space-y-3">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.68rem] tracking-[0.14em] text-accent-700 uppercase dark:text-accent-400">
            {text.stage} {padNumber(step.stageIndex + 1)} · {stageLabel}
          </span>
          {isNext ? <Badge tone="accent">{text.legend.next}</Badge> : null}
          {isDone ? <Badge tone="brand">✓ {text.markedDone}</Badge> : null}
        </p>
        <h3 className="font-display text-2xl leading-snug font-medium tracking-tight text-balance text-neutral-950 dark:text-neutral-50">
          {entry.title}
        </h3>
        <p className="font-serif text-[1.05rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {entry.description}
        </p>
        <p className="font-mono text-xs tracking-[0.08em] text-neutral-500 uppercase dark:text-neutral-400">
          {messages.docs.readingTime(entry.readingMinutes)}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap gap-2.5">
        <Link
          className={buttonVariants({ size: 'md' })}
          params={{ locale, slug: entry.slug }}
          to="/$locale/docs/$slug"
        >
          {text.readStep}
          <span
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/button:translate-x-1"
          >
            →
          </span>
        </Link>
        <Button aria-pressed={isDone} onClick={onToggleDone} variant="secondary">
          {isDone ? text.undo : text.markDone}
        </Button>
      </div>
    </article>
  );
}
