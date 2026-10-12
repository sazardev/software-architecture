import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

const toneStyles = {
  info: {
    box: 'border-brand-500 bg-brand-50/70 dark:border-brand-400 dark:bg-brand-950/40',
    icon: 'text-brand-600 dark:text-brand-300',
    title: 'text-brand-800 dark:text-brand-200',
  },
  tip: {
    box: 'border-emerald-600 bg-emerald-50/70 dark:border-emerald-500 dark:bg-emerald-950/30',
    icon: 'text-emerald-700 dark:text-emerald-300',
    title: 'text-emerald-900 dark:text-emerald-200',
  },
  warning: {
    box: 'border-accent-500 bg-accent-50/80 dark:border-accent-400 dark:bg-accent-950/35',
    icon: 'text-accent-700 dark:text-accent-300',
    title: 'text-accent-900 dark:text-accent-200',
  },
} as const;

const toneIcons = {
  info: <path d="M12 8h.01M11 12h1v5h1M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" />,
  tip: (
    <path d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
  ),
  warning: (
    <path d="M12 9v4m0 4h.01M10.3 3.9 2.4 17.6A2 2 0 0 0 4.1 20.6h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
  ),
} as const;

type CalloutTone = keyof typeof toneStyles;

type CalloutProps = Readonly<{
  children: ReactNode;
  title?: string;
  tone?: CalloutTone;
}>;

export function Callout({ children, title, tone = 'info' }: CalloutProps) {
  const styles = toneStyles[tone];

  return (
    <aside
      className={cn(
        'my-8 flex gap-4 rounded-r-2xl border-l-[3px] py-5 pr-5 pl-5 text-[0.95em] leading-relaxed',
        styles.box,
      )}
    >
      <svg
        aria-hidden="true"
        className={cn('mt-0.5 h-5 w-5 shrink-0', styles.icon)}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        {toneIcons[tone]}
      </svg>
      <div className="min-w-0">
        {title ? (
          <p className={cn('mb-1.5 font-sans text-sm font-semibold tracking-wide', styles.title)}>
            {title}
          </p>
        ) : null}
        <div className="callout-body">{children}</div>
      </div>
    </aside>
  );
}
