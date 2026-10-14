import { arrow, circle, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const ZONE_Y = 96;
const ZONE_H = 200;
const zoneX = [40, 235, 430] as const;

const COPY = {
  en: {
    allowed: 'allowed',
    forbidden: 'forbidden',
    status: 'bun run check · FAILS',
    title: 'A rule that blocks the change',
    zones: ['LIB', 'COMPONENTS', 'ROUTES'],
  },
  es: {
    allowed: 'permitido',
    forbidden: 'prohibido',
    status: 'bun run check · FALLA',
    title: 'Una regla que bloquea el cambio',
    zones: ['LIB', 'COMPONENTES', 'RUTAS'],
  },
} as const;

/**
Un import que sube de capa cruza una frontera prohibida. La regla lo detecta, y el pipeline
falla antes de que el cambio llegue a producción.
*/
export function fitnessEnElCi(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    zoneX.map((x, index) =>
      group(
        [
          rect(x, ZONE_Y, 170, ZONE_H, { fill: 'paper', r: 10, width: 1.5 }),
          label(x + 12, ZONE_Y + 22, copy.zones[index] ?? '', { anchor: 'start', size: 10.5 }),
          circle(x + 85, ZONE_Y + 110, 16, { fill: index === 0 ? 'brandSoft' : 'paper' }),
        ],
        motion('rise', index * 150),
      ),
    ),
    group(
      [
        arrow(
          [
            [300, 150],
            [212, 150],
          ],
          { tone: 'ink' },
        ),
        label(256, 136, copy.allowed, { tone: 'muted', size: 10.5 }),
      ],
      motion('fade', 500),
    ),
    group(
      [
        line(152, 200, 298, 200, { dash: '5 5', stroke: 'accent', width: 1.8 }),
        line(248, 192, 264, 208, { stroke: 'accent', width: 2.2 }),
        line(264, 192, 248, 208, { stroke: 'accent', width: 2.2 }),
        label(256, 228, copy.forbidden, { tone: 'accent', size: 10.5 }),
      ],
      motion('draw', 800),
    ),
    group(
      [
        rect(190, 326, 260, 40, { fill: 'accent', r: 6, stroke: undefined }),
        heading(320, 352, copy.status, { size: 14, tone: 'paper' }),
      ],
      motion('rise', 1100),
    ),
    heading(320, 60, copy.title, { size: 15 }),
  );
}
