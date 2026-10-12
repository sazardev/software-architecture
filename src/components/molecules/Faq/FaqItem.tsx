import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type FaqItemProps = Readonly<{
  children: ReactNode;
  className?: string;
  question: string;
}>;

export function FaqItem({ children, className, question }: FaqItemProps) {
  return (
    <details
      className={cn(
        'group rounded-2xl border border-neutral-200 bg-white px-5 py-4 transition-colors duration-300 open:border-neutral-300 open:shadow-soft dark:border-neutral-800 dark:bg-neutral-900/60 dark:open:border-neutral-700',
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium text-neutral-900 marker:hidden dark:text-neutral-50 [&::-webkit-details-marker]:hidden">
        {question}
        <span
          aria-hidden="true"
          className="relative h-3.5 w-3.5 shrink-0 before:absolute before:top-1/2 before:h-px before:w-full before:bg-accent-600 after:absolute after:top-1/2 after:h-px after:w-full after:rotate-90 after:bg-accent-600 after:transition-transform after:duration-300 group-open:after:rotate-0"
        />
      </summary>
      <div className="mt-3 space-y-2 text-neutral-600 dark:text-neutral-300">{children}</div>
    </details>
  );
}
