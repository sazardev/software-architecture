import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

const cornerPositions = [
  '-top-[7px] -left-[7px]',
  '-top-[7px] -right-[7px]',
  '-bottom-[7px] -left-[7px]',
  '-right-[7px] -bottom-[7px]',
] as const;

type BlueprintFrameProps = Readonly<ComponentProps<'div'>>;

/**
Marco de hoja de plano: borde fino y marcas de registro (+) en las cuatro esquinas.
Las marcas se tiñen de brasa cuando el ancestro `group` recibe hover.
*/
export function BlueprintFrame({ children, className, ...props }: BlueprintFrameProps) {
  return (
    <div
      className={cn('relative border border-neutral-300 dark:border-neutral-700', className)}
      {...props}
    >
      {cornerPositions.map((position) => (
        <svg
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute h-3.5 w-3.5 bg-neutral-50 text-neutral-400 transition-colors duration-300 group-hover:text-accent-600 dark:bg-neutral-950 dark:text-neutral-600 dark:group-hover:text-accent-400',
            position,
          )}
          fill="none"
          key={position}
          stroke="currentColor"
          strokeWidth="1.2"
          viewBox="0 0 14 14"
        >
          <path d="M7 1v12M1 7h12" />
        </svg>
      ))}
      {children}
    </div>
  );
}
