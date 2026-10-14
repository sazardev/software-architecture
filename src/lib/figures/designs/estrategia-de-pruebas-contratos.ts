import { figure, group, label, motion, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    contract: 'CONTRACT · between services',
    e2e: 'E2E · few',
    title: 'Many unit tests, few end-to-end tests, and contracts in between',
    unit: 'UNIT · many, fast',
  },
  es: {
    contract: 'CONTRATO · entre servicios',
    e2e: 'E2E · pocas',
    title: 'Muchas unitarias, pocas de extremo a extremo y contratos en medio',
    unit: 'UNITARIAS · muchas, rápidas',
  },
} as const;

/**
La pirámide reparte el esfuerzo: la base es barata y rápida, la cima es lenta y frágil. Los
contratos ocupan el punto medio: son la prueba que protege la frontera entre servicios.
*/
export function estrategiaDePruebasContratos(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    group(
      [
        rect(60, 290, 520, 60, { fill: 'paper', r: 8, width: 1.5 }),
        label(320, 325, copy.unit, { size: 11, tracking: 1.2 }),
      ],
      motion('rise'),
    ),
    pulse(320, 230, 16, 800),
    group(
      [
        rect(140, 200, 360, 60, { fill: 'accent', r: 8, stroke: undefined }),
        label(320, 235, copy.contract, { size: 11, tone: 'paper', tracking: 1.2 }),
      ],
      motion('rise', 200),
    ),
    group(
      [
        rect(220, 110, 200, 60, { fill: 'paper', r: 8, width: 1.5 }),
        label(320, 145, copy.e2e, { size: 11, tracking: 1.2 }),
      ],
      motion('rise', 400),
    ),
    rect(130, 190, 380, 80, { dash: '4 4', fill: undefined, r: 10, stroke: 'accent', width: 1.2 }),
    label(320, 384, copy.title, { size: 10, tone: 'muted' }),
  );
}
