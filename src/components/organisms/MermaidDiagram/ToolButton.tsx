import type { ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type ToolButtonProps = Readonly<{
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}>;

/**
Botón cuadrado de la barra de herramientas de los diagramas (siempre sobre fondo de plano oscuro).
*/
export function ToolButton({
  children,
  className,
  disabled = false,
  label,
  onClick,
}: ToolButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        'flex h-8 min-w-8 items-center justify-center gap-1.5 border border-white/25 bg-brand-950/70 px-2 font-mono text-xs tracking-[0.08em] text-white transition-colors hover:border-accent-300 hover:text-accent-300 focus-visible:border-accent-300 focus-visible:outline-none disabled:opacity-30 disabled:hover:border-white/25 disabled:hover:text-white',
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

type IconName = 'close' | 'download' | 'expand' | 'fit' | 'reset';

const iconPaths: Record<IconName, string> = {
  close: 'M5 5l10 10M15 5L5 15',
  download: 'M10 3v9m0 0l-3.5-3.5M10 12l3.5-3.5M4 16h12',
  expand: 'M4 8V4h4M16 8V4h-4M4 12v4h4M16 12v4h-4',
  fit: 'M3 7V3h4M17 7V3h-4M3 13v4h4M17 13v4h-4M7 7h6v6H7z',
  reset: 'M4 10a6 6 0 1 0 2-4.5M4 3v4h4',
};

export function ToolIcon({ name }: Readonly<{ name: IconName }>) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 20 20"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}
