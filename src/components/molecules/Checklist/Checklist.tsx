import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type ChecklistProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function Checklist({ children, className }: ChecklistProps) {
  return (
    <div
      className={cn(
        'my-8 rounded-2xl border border-neutral-200 bg-white p-6 text-[0.95em] shadow-soft dark:border-neutral-800 dark:bg-neutral-900/60 dark:shadow-none',
        className,
      )}
    >
      <div className="callout-body checklist-body">{children}</div>
    </div>
  );
}
