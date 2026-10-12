import { cn } from '@/lib/utils/cn';

type TitleBlockRow = Readonly<{
  label: string;
  value: string;
}>;

type TitleBlockProps = Readonly<{
  className?: string;
  rows: TitleBlockRow[];
}>;

/**
Cajetín de plano: tabla de datos técnicos en mono (hoja, escala, revisión…).
*/
export function TitleBlock({ className, rows }: TitleBlockProps) {
  return (
    <dl
      className={cn(
        'grid grid-cols-[auto_1fr] border border-neutral-400 font-mono text-[0.68rem] leading-none tracking-[0.12em] uppercase dark:border-neutral-600',
        className,
      )}
    >
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
