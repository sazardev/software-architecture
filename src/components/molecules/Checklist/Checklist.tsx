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
        'my-8 border border-neutral-300 bg-white p-6 text-[0.95em] dark:border-neutral-700 dark:bg-neutral-900/60',
        className,
      )}
    >
      <div className="callout-body checklist-body">{children}</div>
    </div>
  );
}
