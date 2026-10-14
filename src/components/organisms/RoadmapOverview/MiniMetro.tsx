import type { RoadmapPath } from '@/lib/roadmap/roadmap-registry';
import { cn } from '@/lib/utils/cn';

type MiniMetroProps = Readonly<{
  done: ReadonlySet<string>;
  nextSlug: string | undefined;
  path: RoadmapPath;
}>;

const WIDTH = 320;
const HEIGHT = 28;
const MARGIN = 8;
const STAGE_GAP = 14;
const MID = HEIGHT / 2;

/**
Trazado del roadmap en miniatura: una parada por paso, separadas por etapa con una cota.
*/
export function MiniMetro({ done, nextSlug, path }: MiniMetroProps) {
  const gaps = (path.stages.length - 1) * STAGE_GAP;
  const pitch = (WIDTH - MARGIN * 2 - gaps) / Math.max(1, path.steps.length - 1);
  const xOf = (number: number, stageIndex: number) =>
    MARGIN + (number - 1) * pitch + stageIndex * STAGE_GAP;
  const lastStep = path.steps.at(-1);
  const endX = lastStep === undefined ? WIDTH - MARGIN : xOf(lastStep.number, lastStep.stageIndex);
  const boundaries = path.stages.slice(1).map((stage) => {
    const first = stage.steps[0];

    return first === undefined ? 0 : xOf(first.number, stage.index) - (pitch + STAGE_GAP) / 2;
  });

  return (
    <svg aria-hidden="true" className="block h-7 w-full" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
      <path
        className="animate-draw stroke-neutral-400 dark:stroke-neutral-600"
        d={`M${MARGIN} ${MID}H${endX}`}
        pathLength={1}
        strokeDasharray="1"
        strokeWidth={1.2}
      />
      {boundaries.map((x) => (
        <path
          className="stroke-neutral-400 dark:stroke-neutral-600"
          d={`M${x} 3v${HEIGHT - 6}`}
          key={x}
          strokeDasharray="2 2"
        />
      ))}
      {path.steps.map((step) => {
        const isDone = done.has(step.entry.slug);
        const isNext = step.entry.slug === nextSlug;

        return (
          <circle
            className={cn(
              'transition-colors duration-500',
              isDone &&
                'fill-neutral-900 stroke-neutral-900 dark:fill-neutral-100 dark:stroke-neutral-100',
              isNext &&
                'fill-accent-600 stroke-accent-600 dark:fill-accent-400 dark:stroke-accent-400',
              !isDone && !isNext && 'fill-neutral-50 stroke-neutral-500 dark:fill-neutral-950',
            )}
            cx={xOf(step.number, step.stageIndex)}
            cy={MID}
            key={step.entry.slug}
            r={isNext ? 4.5 : 3}
            strokeWidth={1.2}
          />
        );
      })}
    </svg>
  );
}
