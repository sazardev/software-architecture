import {
  circle,
  figure,
  group,
  label,
  line,
  motion,
  node,
  poly,
  pulse,
  type Point,
} from '../figure-kit';
import { regularPolygon } from '../figure-shapes';
import type { Figure } from '../figure-types';

const CX = 320;
const CY = 208;
const RADIUS = 132;

const axes = [
  { chosen: 0.5, name: 'PERF', target: 0.82 },
  { chosen: 0.9, name: 'SECURITY', target: 0.7 },
  { chosen: 0.72, name: 'AVAIL', target: 0.9 },
  { chosen: 0.84, name: 'MAINT', target: 0.62 },
  { chosen: 0.48, name: 'SCALE', target: 0.76 },
  { chosen: 0.62, name: 'COST', target: 0.58 },
] as const;

const angleOf = (index: number): number => -90 + index * 60;

function at(index: number, fraction: number): Point {
  const angle = (angleOf(index) * Math.PI) / 180;

  return [CX + RADIUS * fraction * Math.cos(angle), CY + RADIUS * fraction * Math.sin(angle)];
}

// Desplazamiento vertical del rótulo de cada eje: el de arriba sube y el de abajo baja.
const labelDy = [-2, 4, 4, 12, 4, 4] as const;

function axisLabel(index: number, name: string) {
  const [x, y] = at(index, 1.2);
  const isCentered = index === 0 || index === 3;
  const side = x > CX ? 'start' : 'end';

  return label(isCentered ? CX : x, y + (labelDy[index] ?? 4), name, {
    anchor: isCentered ? 'middle' : side,
    size: 11,
    tone: 'ink',
  });
}

export function atributosDeCalidad(): Figure {
  const chosen = axes.map((axis, index) => at(index, axis.chosen));
  const target = axes.map((axis, index) => at(index, axis.target));

  return figure(
    [0.25, 0.5, 0.75, 1].map((fraction) =>
      poly(regularPolygon(CX, CY, RADIUS * fraction, 6, -90), { stroke: 'faint', width: 1 }, true),
    ),
    axes.map((_, index) => {
      const [x, y] = at(index, 1);

      return line(CX, CY, x, y, { stroke: 'faint', width: 1 });
    }),
    group([poly(target, { dash: '6 5', stroke: 'brand', width: 1.8 }, true)], motion('fade', 300)),
    group(
      [
        poly(chosen, { fill: 'accentSoft', stroke: 'accent', width: 2.2 }, true),
        ...chosen.map(([x, y]) => node(x, y, 5, false, { stroke: 'accent' })),
      ],
      motion('rise', 500),
    ),
    pulse(chosen[0]?.[0] ?? CX, chosen[0]?.[1] ?? CY, 14, 900),
    axes.map((axis, index) => axisLabel(index, axis.name)),
    // Leyenda.
    group(
      [
        line(36, 44, 72, 44, { dash: '6 5', stroke: 'brand', width: 1.8 }),
        label(82, 48, 'TARGET', { anchor: 'start' }),
        line(36, 68, 72, 68, { stroke: 'accent', width: 2.2 }),
        circle(54, 68, 4, { fill: 'paper', stroke: 'accent', width: 1.6 }),
        label(82, 72, 'CHOSEN', { anchor: 'start' }),
      ],
      motion('fade', 1000),
    ),
  );
}
