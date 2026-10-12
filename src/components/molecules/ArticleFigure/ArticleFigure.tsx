import { useId } from 'react';

import { BlueprintFrame } from '@/components/atoms';
import { FIGURE_HEIGHT, FIGURE_WIDTH, type Figure } from '@/lib/figures/figure-types';
import { useMessages } from '@/lib/i18n/use-messages';
import { cn } from '@/lib/utils/cn';

import { FigureShapes } from './FigureShapes';

type ArticleFigureProps = Readonly<{
  caption: string;
  className?: string;
  figure: Figure;
  /**
  Número de figura (la hoja del artículo): "FIG. 07".
  */
  number: number;
}>;

/**
Figura del artículo: el mismo lenguaje de plano que la portada, con marco de registro y pie
numerado. Es la imagen que también se usa en la tarjeta social del artículo.
*/
export function ArticleFigure({ caption, className, figure, number }: ArticleFigureProps) {
  const captionId = useId();
  const { blueprint } = useMessages();

  return (
    <figure className={cn('animate-fade', className)} style={{ animationDelay: '280ms' }}>
      <BlueprintFrame className="bg-neutral-50 p-3 sm:p-6 dark:bg-neutral-950">
        <svg
          aria-labelledby={captionId}
          className="h-auto w-full"
          role="img"
          viewBox={`0 0 ${FIGURE_WIDTH} ${FIGURE_HEIGHT}`}
        >
          <FigureShapes items={figure} />
        </svg>
        <figcaption
          className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-dashed border-neutral-300 pt-3 dark:border-neutral-700"
          id={captionId}
        >
          <span className="font-mono text-[0.68rem] tracking-[0.14em] whitespace-nowrap text-accent-700 uppercase dark:text-accent-400">
            {blueprint.figure} {String(number).padStart(2, '0')}
          </span>
          <span className="font-serif text-base text-neutral-600 italic dark:text-neutral-300">
            {caption}
          </span>
        </figcaption>
      </BlueprintFrame>
    </figure>
  );
}
