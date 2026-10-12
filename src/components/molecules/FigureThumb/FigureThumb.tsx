import { FIGURE_HEIGHT, FIGURE_WIDTH } from '@/lib/figures/figure-types';
import { getThumbnail } from '@/lib/figures/thumbnail';
import { cn } from '@/lib/utils/cn';

import { FigureShapes } from '../ArticleFigure';

type FigureThumbProps = Readonly<{
  className?: string;
  slug: string;
}>;

/**
Miniatura de la figura de un artículo para listados. Decorativa (el título ya describe el
enlace): sin texto, y su movimiento ambiente solo corre mientras el ancestro `group` tiene
el cursor o el foco (ver `.figure-thumb` en `styles/index.css`).
*/
export function FigureThumb({ className, slug }: FigureThumbProps) {
  const figure = getThumbnail(slug);

  if (figure === undefined) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'block border border-neutral-300 bg-neutral-50 p-1.5 transition-colors duration-300 group-hover:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:group-hover:border-neutral-500',
        className,
      )}
    >
      <svg
        className="figure-thumb block h-auto w-full"
        viewBox={`0 0 ${FIGURE_WIDTH} ${FIGURE_HEIGHT}`}
      >
        <FigureShapes items={figure} />
      </svg>
    </span>
  );
}
