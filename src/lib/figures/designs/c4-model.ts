import { circle, figure, group, label, line, motion, poly, pulse } from '../figure-kit';
import { slab } from '../figure-shapes';
import type { Figure } from '../figure-types';

const CX = 250;
const HW = 126;
const HH = 40;

const levels = [
  { dots: 1, name: 'CONTEXT', tag: 'L1' },
  { dots: 3, name: 'CONTAINERS', tag: 'L2' },
  { dots: 5, name: 'COMPONENTS', tag: 'L3' },
  { dots: 8, name: 'CODE', tag: 'L4' },
] as const;

const CY0 = 62;
const STEP = 92;

// Distribución determinista de "elementos" sobre una losa: más detalle a cada nivel.
function dotsOn(cy: number, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * Math.PI * 2 + 0.4;
    const spread = count === 1 ? 0 : 1;

    return circle(
      CX + Math.cos(angle) * 64 * spread * 0.9,
      cy + Math.sin(angle) * 20 * spread,
      3.6,
      {
        fill: 'paper',
        width: 1.3,
      },
    );
  });
}

export function c4Model(): Figure {
  const ys = levels.map((_, index) => CY0 + index * STEP);
  const tones = [
    { side: 'brandMid', top: 'brandSoft' },
    { side: 'brandMid', top: 'brandSoft' },
    { side: 'brandMid', top: 'brandSoft' },
    { side: 'accentMid', top: 'accentSoft' },
  ] as const;

  return figure(
    levels.map((level, index) => {
      const cy = ys[index] ?? 0;
      const tone = tones[index] ?? tones[0];

      return group(
        [
          slab(CX, cy, HW, HH, 10, tone, motion('rise', index * 160)),
          // Zona que se amplía en el siguiente nivel.
          poly(
            [
              [CX, cy - 12],
              [CX + 32, cy],
              [CX, cy + 12],
              [CX - 32, cy],
            ],
            {
              dash: '3 3',
              fill: index === 3 ? undefined : 'accentSoft',
              stroke: 'accent',
              width: 1.4,
            },
            true,
          ),
          ...dotsOn(cy, level.dots),
          line(CX + HW + 10, cy + 2, CX + HW + 62, cy + 2, {
            dash: '2 4',
            stroke: 'muted',
            width: 1,
          }),
          label(CX + HW + 70, cy - 2, level.tag, { anchor: 'start', tone: 'accent' }),
          label(CX + HW + 70, cy + 14, level.name, { anchor: 'start', tone: 'ink' }),
        ],
        motion('fade', 300 + index * 160),
      );
    }),
    // Conos de zoom entre niveles.
    ys.slice(0, -1).map((y, index) => {
      const next = ys[index + 1] ?? y;

      return group(
        [
          line(CX - 32, y, CX - HW, next, { dash: '4 4', stroke: 'accent', width: 1.2 }),
          line(CX + 32, y, CX + HW, next, { dash: '4 4', stroke: 'accent', width: 1.2 }),
        ],
        motion('fade', 700 + index * 150),
      );
    }),
    pulse(CX, ys[0] ?? CY0, 14, 800),
  );
}
