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
        'my-6 rounded-lg border border-emerald-200 bg-emerald-50 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100',
        className,
      )}
    >
      <header className="flex flex-wrap items-baseline justify-between gap-2 border-b border-emerald-200 px-4 py-3 dark:border-emerald-800">
        <p className="font-semibold">{title}</p>
        {meta ? (
          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{meta}</p>
        ) : null}
      </header>
      <div className="space-y-2 px-4 py-3 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </section>
  );
}
