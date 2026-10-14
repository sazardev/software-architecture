import { figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BASE_Y = 320;
const BAR_W = 72;

const bars = [
  { height: 60, hot: false, name: 'REHOST' },
  { height: 110, hot: false, name: 'REPLATFORM' },
  { height: 180, hot: true, name: 'REFACTOR' },
  { height: 140, hot: false, name: 'REPURCHASE' },
  { height: 40, hot: false, name: 'RETIRE' },
  { height: 30, hot: false, name: 'RETAIN' },
] as const;

const COPY = {
  en: {
    note: 'choose per application, not per data center',
    scale: 'HEIGHT = EFFORT',
    title: 'Six strategies, one judgement per application',
  },
  es: {
    note: 'se elige por aplicación, no por centro de datos',
    scale: 'ALTURA = ESFUERZO',
    title: 'Seis estrategias y un criterio por aplicación',
  },
} as const;

/**
Las seis R describen formas distintas de llevar una aplicación a la nube. El esfuerzo y el riesgo
no crecen igual en todas: la decisión depende del valor de negocio y de las dependencias.
*/
export function migracionNube6r(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 66, copy.title, { size: 14 }),
    label(580, 96, copy.scale, { anchor: 'end', size: 10, tone: 'muted' }),
    group([line(60, BASE_Y, 580, BASE_Y, { stroke: 'ink', width: 1.6 })], motion('draw', 200)),
    bars.map((bar, index) => {
      const x = 74 + index * 88;

      return group(
        [
          rect(x, BASE_Y - bar.height, BAR_W, bar.height, {
            fill: bar.hot ? 'accent' : 'brandSoft',
            r: 6,
            stroke: bar.hot ? undefined : 'ink',
            width: 1.4,
          }),
          label(x + BAR_W / 2, BASE_Y + 22, bar.name, { size: 9, tracking: 0.8 }),
        ],
        motion('rise', 300 + index * 100),
      );
    }),
    label(320, 368, copy.note, { tone: 'muted' }),
  );
}
