import { cn } from '@/lib/utils/cn';

type TitleBlockRow = Readonly<{
  label: string;
  value: string;
}>;

type TitleBlockProps = Readonly<{
  className?: string;
  /**
  `column`: filas etiqueta/valor (compacto). `row`: celdas apiladas en una banda horizontal.
  */
  layout?: 'column' | 'row';
  rows: TitleBlockRow[];
}>;

const baseClass =
  'border border-neutral-400 font-mono text-[0.68rem] leading-none tracking-[0.12em] uppercase dark:border-neutral-600';

/**
Cajetín de plano: tabla de datos técnicos en mono (hoja, escala, revisión…).
*/
export function TitleBlock({ className, layout = 'column', rows }: TitleBlockProps) {
  if (layout === 'row') {
    return (
      <dl
        className={cn(
          baseClass,
          'grid grid-cols-2 divide-neutral-400 sm:grid-cols-4 sm:divide-x dark:divide-neutral-600',
          className,
        )}
      >
        {rows.map((row, index) => (
          <div
            className={cn(
              'space-y-2 px-4 py-3',
              index % 2 === 1 &&
                'border-l border-neutral-400 sm:border-l-0 dark:border-neutral-600',
              index > 1 && 'border-t border-neutral-400 sm:border-t-0 dark:border-neutral-600',
            )}
            key={row.label}
          >
            <dt className="text-neutral-500 dark:text-neutral-400">{row.label}</dt>
            <dd className="truncate text-neutral-900 dark:text-neutral-100">{row.value}</dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl className={cn(baseClass, 'grid grid-cols-[auto_1fr]', className)}>
      {rows.map((row, index) => (
        <div className="col-span-2 grid grid-cols-subgrid" key={row.label}>
          <dt
            className={cn(
              'border-r border-neutral-400 px-3 py-2.5 text-neutral-500 dark:border-neutral-600 dark:text-neutral-400',
              index > 0 && 'border-t',
            )}
          >
            {row.label}
          </dt>
          <dd
            className={cn(
              'px-3 py-2.5 text-neutral-900 dark:text-neutral-100',
              index > 0 && 'border-t border-neutral-400 dark:border-neutral-600',
            )}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
