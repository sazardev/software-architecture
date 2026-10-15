import { arrow, circle, figure, group, label, line, motion, path, pulse } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const TRUNK_Y = 132;
const BRANCH_Y = 296;
const LEAVE_X = 200;
const MERGE_X = 444;
const TRUNK_START = 56;
const TRUNK_END = 610;

// Integraciones diarias de quienes siguen en el tronco, también mientras la rama larga vive.
const TRUNK_COMMITS = [96, 136, 176, 240, 280, 320, 360, 400, 480, 520, 560];

const COPY = {
  en: {
    branch: 'LONG BRANCH · 3 WEEKS',
    conflict: 'CONFLICT ON MERGE',
    daily: 'ONE COMMIT A DAY, AT LEAST',
    trunk: 'TRUNK',
  },
  es: {
    branch: 'RAMA LARGA · 3 SEMANAS',
    conflict: 'CONFLICTO AL FUSIONAR',
    daily: 'UN COMMIT AL DÍA, COMO MÍNIMO',
    trunk: 'TRONCO',
  },
} as const;

export function ramasYEntregaContinua(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    // Tronco: la línea compartida que todos integran con frecuencia.
    group(
      [
        line(TRUNK_START, TRUNK_Y, TRUNK_END, TRUNK_Y, { width: 2.6 }),
        arrow(
          [
            [584, TRUNK_Y],
            [616, TRUNK_Y],
          ],
          { tone: 'ink', width: 2 },
        ),
        label(TRUNK_START, 96, copy.trunk, { anchor: 'start', tone: 'ink', tracking: 3 }),
      ],
      motion('rise', 0),
    ),
    // Integraciones pequeñas, una tras otra.
    group(
      TRUNK_COMMITS.map((x) => circle(x, TRUNK_Y, 4.5, { fill: 'paper', width: 1.5 })),
      motion('rise', 200),
    ),
    // Rama larga: se separa del tronco y vuelve tarde, con todo el trabajo acumulado.
    group(
      [
        path(
          `M${LEAVE_X} ${TRUNK_Y}C214 ${TRUNK_Y} 214 ${BRANCH_Y} 232 ${BRANCH_Y}L412 ${BRANCH_Y}C428 ${BRANCH_Y} 428 ${TRUNK_Y} ${MERGE_X} ${TRUNK_Y}`,
          { stroke: 'muted', width: 1.8 },
        ),
        circle(LEAVE_X, TRUNK_Y, 4.5, { fill: 'paper', width: 1.5 }),
        label(320, BRANCH_Y + 26, copy.branch, { tone: 'ink' }),
      ],
      motion('rise', 500),
    ),
    // El punto de fusión es la idea clave: aquí se concentra el coste.
    group(
      [
        pulse(MERGE_X, TRUNK_Y, 16, 0),
        circle(MERGE_X, TRUNK_Y, 7, { fill: 'accent', width: 1.6 }),
        label(MERGE_X, 98, copy.conflict, { tone: 'accent' }),
      ],
      motion('fade', 1100),
    ),
    // Medida de la integración diaria frente a la semana de trabajo sin integrar.
    group(
      [
        line(96, 360, 560, 360, { stroke: 'muted', width: 1 }),
        line(96, 354, 96, 366, { stroke: 'muted', width: 1 }),
        line(560, 354, 560, 366, { stroke: 'muted', width: 1 }),
        label(TRUNK_START, 382, copy.daily, { anchor: 'start', tone: 'muted' }),
      ],
      motion('fade', 1300),
    ),
  );
}
