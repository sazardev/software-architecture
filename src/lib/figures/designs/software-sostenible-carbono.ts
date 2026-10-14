import { arrow, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BASE_Y = 320;

const COPY = {
  en: {
    after: 'AFTER',
    before: 'BEFORE',
    less: 'LESS COMPUTE',
    note: 'same load: less energy, better hour or region',
    title: 'Same service, smaller footprint',
  },
  es: {
    after: 'DESPUÉS',
    before: 'ANTES',
    less: 'MENOS CÓMPUTO',
    note: 'misma carga: menos energía, mejor hora o región',
    title: 'Mismo servicio, huella menor',
  },
} as const;

/**
La huella es energía consumida multiplicada por la intensidad de carbono de la red en ese momento.
Reducir cómputo y elegir mejor hora o región baja el resultado sin cambiar la carga útil.
*/
export function softwareSostenibleCarbono(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 56, copy.title, { size: 15 }),
    group([line(120, BASE_Y, 540, BASE_Y, { stroke: 'ink', width: 1.6 })], motion('draw')),
    group(
      [
        rect(190, 150, 110, 170, { fill: 'accent', r: 6, stroke: undefined }),
        label(245, 344, copy.before, { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 200),
    ),
    group(
      [
        rect(380, 240, 110, 80, { fill: 'brandSoft', r: 6, stroke: 'ink', width: 1.4 }),
        label(435, 344, copy.after, { size: 11, tracking: 1.4 }),
        label(435, 226, copy.less, { size: 10, tone: 'muted' }),
      ],
      motion('rise', 400),
    ),
    group(
      [
        arrow(
          [
            [305, 170],
            [372, 250],
          ],
          { tone: 'muted' },
        ),
      ],
      motion('fade', 600),
    ),
    label(320, 372, copy.note, { tone: 'muted' }),
  );
}
