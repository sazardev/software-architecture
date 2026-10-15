import { arrow, figure, group, heading, label, motion, node, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BAND_X = 60;
const BAND_W = 520;
const BAND_H = 62;
const BANDS_TOP = 104;
const BAND_GAP = 10;
const BASE_Y = 340;

/**
Observable: papel sólido. Hipótesis: contorno discontinuo, sin certeza. Reversible hoy: tono de plano.
*/
const BANDS = [
  { key: 'observable', fill: 'paper', stroke: 'ink', width: 1.5 },
  { dash: '5 7', fill: 'sunken', key: 'hypothesis', stroke: 'muted', width: 1.2 },
  { fill: 'brandSoft', key: 'reversible', stroke: 'ink', width: 1.5 },
] as const;

const REVIEWS = [
  { key: 'first', x: 200 },
  { key: 'second', x: 360 },
  { key: 'third', x: 520 },
] as const;

const COPY = {
  en: {
    bands: { observable: 'OBSERVABLE', hypothesis: 'HYPOTHESIS', reversible: 'REVERSIBLE TODAY' },
    reviews: { first: 'REVIEW 1', second: 'REVIEW 2', third: 'REVIEW 3' },
    title: 'Review horizon',
  },
  es: {
    bands: { observable: 'OBSERVABLE', hypothesis: 'HIPÓTESIS', reversible: 'REVERSIBLE HOY' },
    reviews: { first: 'REVISIÓN 1', second: 'REVISIÓN 2', third: 'REVISIÓN 3' },
    title: 'Horizonte de revisión',
  },
} as const;

/**
Horizonte en tres bandas: lo que ya se observa, lo que solo es hipótesis y lo que conviene
decidir hoy por ser reversible. La línea avanza por puntos de revisión; cada uno decide qué banda
merece más peso.
*/
export function futuroArquitecturaConIa(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  const bands = BANDS.map(({ key, ...style }, index) => {
    const y = BANDS_TOP + index * (BAND_H + BAND_GAP);

    return group(
      [
        rect(BAND_X, y, BAND_W, BAND_H, style),
        label(BAND_X + 18, y + BAND_H / 2 + 4, copy.bands[key], {
          anchor: 'start',
          size: 11,
          tone: 'ink',
          tracking: 2,
        }),
      ],
      motion('rise', index * 160),
    );
  });

  const reviews = REVIEWS.map(({ key, x }, index) =>
    group(
      [
        node(x, BASE_Y, 6, index === REVIEWS.length - 1, { width: 1.4 }),
        label(x, BASE_Y + 28, copy.reviews[key], { size: 10, tracking: 1.4 }),
      ],
      motion('fade', 700 + index * 180),
    ),
  );

  return figure(
    heading(320, 64, copy.title, { size: 15 }),
    bands,
    group(
      [
        arrow(
          [
            [BAND_X, BASE_Y],
            [BAND_X + BAND_W + 20, BASE_Y],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
      ],
      motion('fade', 500),
    ),
    reviews,
    pulse(REVIEWS[2].x, BASE_Y, 14, 1300),
  );
}
