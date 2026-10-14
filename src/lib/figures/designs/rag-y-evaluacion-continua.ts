import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BOX_Y = 160;
const BOX_W = 120;
const BOX_H = 56;
const boxX = [40, 190, 340, 490] as const;

const COPY = {
  en: {
    evaluate: 'EVALUATE',
    generate: 'GENERATE',
    index: 'INDEX',
    loop: 'tune chunks and prompt',
    note: 'without measurement you cannot tell if it improved',
    retrieve: 'RETRIEVE',
    title: 'Retrieve, generate, measure',
  },
  es: {
    evaluate: 'EVALUAR',
    generate: 'GENERAR',
    index: 'INDEXAR',
    loop: 'ajustar fragmentos y prompt',
    note: 'sin medición no sabes si mejoró',
    retrieve: 'RECUPERAR',
    title: 'Recuperar, generar, medir',
  },
} as const;

/**
Un RAG se mide como una cadena: indexación, recuperación, generación y evaluación. La evaluación
no es un paso final; alimenta los cambios de fragmentos y de prompt.
*/
export function ragYEvaluacionContinua(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];
  const names = [copy.index, copy.retrieve, copy.generate, copy.evaluate];

  return figure(
    heading(320, 56, copy.title, { size: 15 }),
    boxX.map((x, index) => {
      const isEval = index === boxX.length - 1;

      return group(
        [
          rect(x, BOX_Y, BOX_W, BOX_H, {
            fill: isEval ? 'accent' : 'paper',
            r: 8,
            stroke: isEval ? undefined : 'ink',
            width: 1.5,
          }),
          label(x + BOX_W / 2, BOX_Y + 33, names[index] ?? '', {
            size: 10.5,
            tone: isEval ? 'paper' : 'ink',
            tracking: 1.2,
          }),
        ],
        motion('rise', index * 120),
      );
    }),
    [0, 1, 2].map((index) =>
      arrow(
        [
          [(boxX[index] ?? 0) + BOX_W + 4, BOX_Y + BOX_H / 2],
          [(boxX[index + 1] ?? 0) - 4, BOX_Y + BOX_H / 2],
        ],
        { tone: 'ink' },
      ),
    ),
    group(
      [
        arrow(
          [
            [550, 220],
            [550, 270],
            [250, 270],
            [250, 220],
          ],
          { tone: 'muted' },
        ),
        label(400, 292, copy.loop, { size: 10, tone: 'muted' }),
      ],
      motion('draw', 500),
    ),
    label(320, 360, copy.note, { tone: 'muted' }),
  );
}
