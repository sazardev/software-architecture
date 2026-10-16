import { arrow, circle, dimension, figure, group, label, motion, path, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const LANE_TOP = 170;
const LANE_BOTTOM = 250;
const GATE_X = 500;
const GATE_Y = 210;

const COPY = {
  en: {
    big: 'BIG CHANGE',
    fast: 'FAST REVIEW',
    limit: 'QUEUE LIMIT',
    merged: 'MERGED',
    queue: 'REVIEW QUEUE',
    split: 'SPLIT',
  },
  es: {
    big: 'CAMBIO GRANDE',
    fast: 'REVISIÓN RÁPIDA',
    limit: 'LÍMITE DE COLA',
    merged: 'FUSIONADO',
    queue: 'COLA DE REVISIÓN',
    split: 'PARTIR',
  },
} as const;

/**
Cambios pequeños que avanzan por una cola con revisiones rápidas; un cambio grande se parte
antes de entrar. El acento marca lo que llega a fusionarse.
*/
export function revisionDeCodigoSinCuelloDeBotella(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  const smallCards = [246, 290, 334, 378].map((x, index) =>
    rect(x, 192, 28, 36, { fill: 'brandSoft', r: 3, stroke: 'brand', width: 1.4 }),
  );

  return figure(
    // Cambio grande, con cortes de troceado.
    group(
      [
        rect(44, 150, 120, 120, { fill: 'sunken', r: 4, stroke: 'ink' }),
        path('M84 150V270', { dash: '4 4', stroke: 'accent', width: 1.4 }),
        path('M124 150V270', { dash: '4 4', stroke: 'accent', width: 1.4 }),
        label(104, 296, copy.big, { size: 11, tone: 'ink' }),
        label(104, 138, copy.split, { tone: 'accent' }),
      ],
      motion('fade', 200),
    ),
    arrow(
      [
        [176, 210],
        [214, 210],
      ],
      { tone: 'muted' },
    ),
    // Carril de la cola: cada cambio pequeño entra, espera poco y avanza.
    group(
      [
        rect(230, LANE_TOP, 370, LANE_BOTTOM - LANE_TOP, {
          fill: 'sunken',
          r: 0,
          stroke: undefined,
        }),
        label(44, 84, copy.queue, { anchor: 'start', tone: 'ink', tracking: 3 }),
        dimension(
          [230, 150],
          [600, 150],
          copy.limit,
          { offset: 12 },
        ),
      ],
      motion('fade', 400),
    ),
    smallCards.map((card, index) => group([card], motion('rise', 500 + index * 140))),
    // Revisión rápida: un gesto corto, no una espera.
    group(
      [
        circle(GATE_X, GATE_Y, 16, { fill: 'paper', width: 1.6 }),
        path(`M${GATE_X - 5} ${GATE_Y}l3.6 3.8l7-8`, { stroke: 'accent', width: 2 }),
        label(GATE_X, 290, copy.fast, { size: 11, tone: 'ink' }),
      ],
      motion('rise', 1000),
    ),
    pulse(GATE_X, GATE_Y, 24, 1200),
    // Cambios ya fusionados, en el color de la idea clave.
    group(
      [
        rect(530, 192, 28, 36, { fill: 'accent', r: 3, stroke: 'accent', width: 1.4 }),
        rect(574, 192, 28, 36, { fill: 'accent', r: 3, stroke: 'accent', width: 1.4 }),
        label(572, 268, copy.merged, { size: 10.5, tone: 'accent' }),
      ],
      motion('fade', 1400),
    ),
    arrow(
      [
        [410, GATE_Y],
        [474, GATE_Y],
      ],
      { flow: true, tone: 'accent', width: 1.8 },
    ),
  );
}
