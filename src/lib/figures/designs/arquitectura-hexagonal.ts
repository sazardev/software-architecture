import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  poly,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import { regularPolygon } from '../figure-shapes';
import type { Figure } from '../figure-types';

const CX = 320;
const CY = 200;
const OUTER = 118;
const APOTHEM = OUTER * Math.cos(Math.PI / 6);

type Adapter = Readonly<{ angle: number; driving: boolean; name: string }>;

const adapters: readonly Adapter[] = [
  { angle: 240, driving: true, name: 'HTTP' },
  { angle: 180, driving: true, name: 'CLI' },
  { angle: 120, driving: true, name: 'TEST' },
  { angle: -60, driving: false, name: 'DB' },
  { angle: 0, driving: false, name: 'QUEUE' },
  { angle: 60, driving: false, name: 'MAIL' },
];

const polar = (radius: number, angle: number): Point => [
  CX + radius * Math.cos((angle * Math.PI) / 180),
  CY + radius * Math.sin((angle * Math.PI) / 180),
];

// Adaptador (cápsula) conectado por una flecha al puerto de su arista del hexágono.
function adapterAt({ angle, driving, name }: Adapter, index: number) {
  const portPoint = polar(APOTHEM, angle);
  const [ax, ay] = polar(angle % 180 === 0 ? 212 : 188, angle);
  const side = ax < portPoint[0] ? 1 : -1;
  const edge: Point = [ax + side * 40, ay + (ay < portPoint[1] ? 4 : -4) * (ay === CY ? 0 : 1)];
  const path = driving ? [edge, portPoint] : [portPoint, edge];

  return group(
    [
      arrow(path, { flow: driving }),
      rect(ax - 40, ay - 15, 80, 30, { fill: driving ? 'brandSoft' : 'paper', r: 15 }),
      label(ax, ay + 4, name, { size: 12, tone: 'ink' }),
      circle(portPoint[0], portPoint[1], 6, { fill: 'paper', width: 1.6 }),
    ],
    motion('fade', 500 + index * 120),
  );
}

export function arquitecturaHexagonal(): Figure {
  const hexagon = (radius: number) => regularPolygon(CX, CY, radius, 6, -90);
  const halo = poly(hexagon(OUTER + 26), { dash: '2 5', stroke: 'faint', width: 1 }, true);
  const shell = poly(hexagon(OUTER), { fill: 'sunken', width: 1.6 }, true);
  const core = poly(hexagon(66), { fill: 'accentSoft', width: 1.6 }, true);

  return figure(
    line(CX, 12, CX, 388, { dash: '14 4 2 4', stroke: 'faint', width: 1 }),
    halo,
    group([shell, core], motion('rise', 150)),
    adapters.map((adapter, index) => adapterAt(adapter, index)),
    group(
      [
        poly(
          [
            [CX - 28, CY + 12],
            [CX + 4, CY - 14],
            [CX + 32, CY + 14],
          ],
          { stroke: 'muted', width: 1 },
        ),
        node(CX - 28, CY + 12, 4.5),
        node(CX + 32, CY + 14, 4.5),
        pulse(CX + 4, CY - 14),
        node(CX + 4, CY - 14, 6, true),
      ],
      motion('fade', 900),
    ),
    heading(CX, CY + 46, 'DOMAIN', { font: 'mono', size: 11.5, tracking: 2 }),
    label(100, 44, 'DRIVING'),
    label(540, 44, 'DRIVEN'),
  );
}
