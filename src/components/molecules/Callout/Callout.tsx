import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

const toneStyles = {
  info: 'border-brand-200 bg-brand-50 text-brand-900 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-100',
  tip: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100',
} as const;

type CalloutTone = keyof typeof toneStyles;

type CalloutProps = Readonly<{
  children: ReactNode;
  title?: string;
  tone?: CalloutTone;
}>;

export function Callout({ children, title, tone = 'info' }: CalloutProps) {
  return (
    <aside className={cn('my-6 rounded-lg border p-4 text-sm', toneStyles[tone])}>
      {title ? <p className="mb-1 font-semibold">{title}</p> : null}
      <div className="[&>p:first-child]:mt-0 [&>p:last-child]:mb-0">{children}</div>
    </aside>
  );
}
