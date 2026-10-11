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
        'rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-950',
        className,
      )}
    >
      <summary className="cursor-pointer font-medium text-neutral-800 dark:text-neutral-100">
        {question}
      </summary>
      <div className="mt-2 space-y-2 text-neutral-600 dark:text-neutral-300">{children}</div>
    </details>
  );
}
