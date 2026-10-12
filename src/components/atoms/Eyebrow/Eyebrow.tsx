import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

type EyebrowProps = Readonly<ComponentProps<'p'>>;

/**
Etiqueta pequeña en versalitas que precede a un título.
*/
export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-sans text-xs font-semibold tracking-[0.18em] text-accent-700 uppercase before:h-px before:w-8 before:bg-accent-500 dark:text-accent-400',
        className,
      )}
      {...props}
    />
  );
}
