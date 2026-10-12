import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils/cn';

type EyebrowProps = Readonly<ComponentProps<'p'>>;

/**
Etiqueta en versalitas precedida por una cota de plano (línea con remates).
*/
export function Eyebrow({ children, className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-mono text-xs font-medium tracking-[0.18em] text-accent-700 uppercase dark:text-accent-400',
        className,
      )}
      {...props}
    >
      <svg
        aria-hidden="true"
        className="h-2 w-8 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        viewBox="0 0 32 8"
      >
        <path d="M.5 0v8M31.5 0v8M0 4h32" />
      </svg>
      {children}
    </p>
  );
}
