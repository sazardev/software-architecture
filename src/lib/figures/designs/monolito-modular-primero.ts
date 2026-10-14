import { arrow, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const MODULE_Y = 124;
const MODULE_W = 150;
const MODULE_H = 120;
const moduleX = [76, 245, 414] as const;

const COPY = {
  en: {
    data: 'OWN DATA',
    forbidden: "direct access to another module's data: forbidden",
    modules: ['ORDERS', 'PAYMENTS', 'SHIPPING'],
    api: 'PUBLIC API',
    process: 'ONE PROCESS',
    title: 'Boundaries inside one process',
  },
  es: {
    data: 'DATOS PROPIOS',
    forbidden: 'acceso directo a los datos de otro módulo: prohibido',
    modules: ['PEDIDOS', 'PAGOS', 'ENVÍOS'],
    api: 'API PÚBLICA',
    process: 'UN PROCESO',
    title: 'Fronteras dentro de un solo proceso',
  },
} as const;

/**
Un proceso con módulos. Los módulos se hablan solo por su API pública; el acceso directo a
los datos de otro módulo queda prohibido.
*/
export function monolitoModularPrimero(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    group(
      [
        rect(40, 80, 560, 260, { fill: 'paper', r: 14, width: 1.5 }),
        label(60, 104, copy.process, { anchor: 'start', size: 10.5 }),
      ],
      motion('fade'),
    ),
    moduleX.map((x, index) =>
      group(
        [
          rect(x, MODULE_Y, MODULE_W, MODULE_H, { fill: 'brandSoft', r: 8, width: 1.5 }),
          label(x + MODULE_W / 2, MODULE_Y + 30, copy.modules[index] ?? '', {
            size: 11,
            tracking: 1.4,
          }),
          rect(x + 22, MODULE_Y + 56, MODULE_W - 44, 22, { fill: 'paper', r: 4, width: 1 }),
          label(x + MODULE_W / 2, MODULE_Y + 71, copy.api, { size: 9.5 }),
          rect(x + 22, MODULE_Y + 86, MODULE_W - 44, 20, { fill: 'paper', r: 4, width: 1 }),
          label(x + MODULE_W / 2, MODULE_Y + 100, copy.data, { size: 9 }),
        ],
        motion('rise', index * 160),
      ),
    ),
    group(
      [
        arrow(
          [
            [MODULE_W + 80, MODULE_Y + 67],
            [245, MODULE_Y + 67],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [MODULE_W + 249, MODULE_Y + 67],
            [414, MODULE_Y + 67],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 600),
    ),
    group(
      [
        line(150, 268, 490, 268, { dash: '5 5', stroke: 'accent', width: 1.6 }),
        label(320, 288, copy.forbidden, { size: 10.5, tone: 'accent' }),
      ],
      motion('draw', 900),
    ),
    heading(320, 60, copy.title, { size: 15 }),
  );
}
