import {
  arrow,
  circle,
  figure,
  group,
  label,
  line,
  motion,
  node,
  pulse,
  type Point,
} from '../figure-kit';
import { regularPolygon } from '../figure-shapes';
import type { Figure } from '../figure-types';

type Module = Readonly<{ cx: number; fill: 'brandSoft' | 'sunken'; rotation: number }>;

const CY = 196;
const RADIUS = 112;

const modules: readonly Module[] = [
  { cx: 170, fill: 'brandSoft', rotation: 0 },
  { cx: 470, fill: 'sunken', rotation: 36 },
];

// Malla densa: todos los nodos del módulo se conocen entre sí (alta cohesión).
function mesh(module: Module): Point[] {
  return [[module.cx, CY], ...regularPolygon(module.cx, CY, 60, 5, module.rotation)];
}

function moduleShape(module: Module, index: number) {
  const points = mesh(module);
  const links = points.flatMap((from, a) =>
    points
      .slice(a + 1)
      .map((to) => line(from[0], from[1], to[0], to[1], { stroke: 'muted', width: 1 })),
  );

  return group(
    [
      circle(module.cx, CY, RADIUS, { dash: '6 5', fill: module.fill, width: 1.6 }),
      ...links,
      ...points.map(([x, y]) => node(x, y, 5.5)),
      label(module.cx, 350, 'HIGH COHESION', { tone: 'ink', size: 11 }),
    ],
    motion('rise', index * 200),
  );
}

export function acoplamientoCohesion(): Figure {
  const left = 230;
  const right = 410;

  return figure(
    modules.map((module, index) => moduleShape(module, index)),
    // Único enlace entre módulos: un contrato estrecho (acoplamiento bajo).
    group(
      [
        arrow(
          [
            [left + 6, CY],
            [right - 6, CY],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
        circle(282, CY, 6, { fill: 'paper', width: 1.6 }),
        circle(358, CY, 6, { fill: 'paper', width: 1.6 }),
        label(320, CY - 34, 'LOW', { tone: 'ink', size: 11 }),
        label(320, CY - 20, 'COUPLING', { tone: 'ink', size: 11 }),
      ],
      motion('fade', 700),
    ),
    pulse(left, CY, 14, 900),
    node(left, CY, 6, true),
    node(right, CY, 6, true),
  );
}
