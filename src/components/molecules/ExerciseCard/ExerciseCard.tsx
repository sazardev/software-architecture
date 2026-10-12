import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type ExerciseCardProps = Readonly<{
  children: ReactNode;
  className?: string;
  meta?: string;
  title: string;
}>;

export function ExerciseCard({ children, className, meta, title }: ExerciseCardProps) {
  return (
    <section
      className={cn(
        'my-8 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50/60 text-[0.95em] dark:border-emerald-900 dark:bg-emerald-950/25',
        className,
      )}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-emerald-200/80 bg-emerald-100/50 px-5 py-3 dark:border-emerald-900 dark:bg-emerald-950/40">
        <p className="font-display text-lg font-medium text-emerald-950 dark:text-emerald-100">
          {title}
        </p>
        {meta ? (
          <p className="font-sans text-xs font-semibold tracking-wider text-emerald-800 uppercase dark:text-emerald-300">
            {meta}
          </p>
        ) : null}
      </header>
      <div className="callout-body px-5 py-4">{children}</div>
    </section>
  );
}
