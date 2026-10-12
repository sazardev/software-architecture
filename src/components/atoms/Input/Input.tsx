import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

type InputProps = Readonly<ComponentProps<'input'>>;

export function Input({ className, type = 'text', ...props }: InputProps) {
  return (
    <input
      className={cn(
        'h-14 w-full rounded-none border border-neutral-300 bg-white px-5 font-sans text-base text-neutral-900 transition-colors duration-300 placeholder:text-neutral-400 focus:border-brand-500 focus:outline-2 focus:outline-offset-2 focus:outline-brand-500/40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-500',
        className,
      )}
      type={type}
      {...props}
    />
  );
}
