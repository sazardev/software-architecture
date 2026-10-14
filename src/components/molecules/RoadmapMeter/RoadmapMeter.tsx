import { cn } from '@/lib/utils/cn';

type RoadmapMeterProps = Readonly<{
  className?: string;
  done: number;
  label: string;
  total: number;
}>;

/**
Barra de progreso segmentada (una celda por paso), como la escala gráfica de un plano.
*/
export function RoadmapMeter({ className, done, label, total }: RoadmapMeterProps) {
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3 font-mono text-[0.68rem] tracking-[0.14em] text-neutral-500 uppercase dark:text-neutral-400">
        <span>{label}</span>
        <span className="text-neutral-900 tabular-nums dark:text-neutral-100">{percent}%</span>
      </div>
      <div
        aria-label={label}
        aria-valuemax={total}
        aria-valuemin={0}
        aria-valuenow={done}
        className="flex h-2 gap-[2px]"
        role="meter"
      >
        {Array.from({ length: total }, (_, index) => (
          <span
            className={cn(
              'flex-1 transition-colors duration-500',
              index < done
                ? 'bg-accent-600 dark:bg-accent-400'
                : 'bg-neutral-200 dark:bg-neutral-800',
            )}
            key={index}
            style={{ transitionDelay: `${index * 18}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
