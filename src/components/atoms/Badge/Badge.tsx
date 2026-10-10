import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    defaultVariants: {
      tone: 'neutral',
    },
    variants: {
      tone: {
        brand:
          'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300',
        neutral:
          'border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300',
        outline:
          'border-neutral-300 text-neutral-600 dark:border-neutral-700 dark:text-neutral-400',
      },
    },
  },
);

type BadgeProps = Readonly<ComponentProps<'span'> & VariantProps<typeof badgeVariants>>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
