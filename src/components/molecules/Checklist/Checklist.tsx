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
        'my-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900/40',
        className,
      )}
    >
      <div className="[&_li]:my-1 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul]:marker:text-brand-600 dark:[&_ul]:marker:text-brand-400">
        {children}
      </div>
    </div>
  );
}
