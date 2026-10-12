import {
  arrow,
  dimension,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure, Prim } from '../figure-types';

// Log particionado: tres carriles de celdas; las rellenas ya están escritas.
const CELL = 22;
const LANE_X = 352;
const LANE_CELLS = 9;
const LANE_END = LANE_X + CELL * LANE_CELLS;
const lanes = [
  { name: 'P0', written: 8, y: 140 },
  { name: 'P1', written: 6, y: 196 },
  { name: 'P2', written: 7, y: 252 },
] as const;

function lane(name: string, written: number, y: number, delay: number) {
  const cells: Prim[] = Array.from({ length: LANE_CELLS }, (_, index) =>
    rect(LANE_X + index * CELL, y, CELL, 28, {
      dash: index >= written ? '3 3' : undefined,
      fill: index < written ? 'brandSoft' : 'paper',
      r: 0,
      stroke: index < written ? 'ink' : 'muted',
      width: 1.2,
    }),
  );

  return group(
    [...cells, label(LANE_X - 12, y + 19, name, { anchor: 'end', size: 11, tone: 'ink' })],
    motion('rise', delay),
  );
}

function consumer(y: number, name: string, delay: number) {
  const x = 584;
  return group(
    [
      rect(x, y, 48, 32, { fill: 'paper', r: 5, width: 1.6 }),
      heading(x + 24, y + 21, name, { font: 'mono', size: 12, tracking: 1 }),
    ],
    motion('rise', delay),
  );
}

export function cachingColasStreaming(): Figure {
  return figure(
    // Aplicación: escribe en la base de datos y publica en el log.
    group(
      [
        rect(272, 24, 96, 48, { fill: 'paper', r: 6, width: 1.8 }),
        heading(320, 54, 'APP', { font: 'mono', size: 14, tracking: 2 }),
      ],
      motion('rise'),
    ),
    // Caché delante de la base de datos.
    group(
      [
        rect(64, 120, 128, 72, { fill: 'brandSoft', r: 6, width: 1.8 }),
        heading(128, 148, 'CACHE', { font: 'mono', size: 13, tracking: 2 }),
        label(128, 168, 'TTL', { size: 10 }),
      ],
      motion('rise', 150),
    ),
    group(
      [
        path('M64 276 A64 12 0 0 1 192 276 L192 336 A64 12 0 0 1 64 336 Z', {
          fill: 'brandSoft',
        }),
        path('M64 276 A64 12 0 0 0 192 276', { width: 1.2 }),
        heading(128, 318, 'DB', { font: 'mono', size: 13, tracking: 2 }),
      ],
      motion('rise', 300),
    ),
    arrow([
      [272, 60],
      [196, 124],
    ]),
    label(222, 80, 'GET', { anchor: 'end', size: 10 }),
    arrow([
      [300, 72],
      [300, 300],
      [196, 300],
    ]),
    label(250, 292, 'UPDATE', { size: 10 }),
    // Invalidación: el único acento de la figura.
    arrow(
      [
        [128, 262],
        [128, 205],
      ],
      { dash: '5 7', tone: 'accent', width: 1.8 },
    ),
    label(140, 234, 'DEL', { anchor: 'start', size: 11, tone: 'accent' }),
    node(128, 196, 5, true),
    pulse(128, 196, 16, 900),
    // Log particionado con grupos de consumidores.
    arrow(
      [
        [368, 48],
        [540, 48],
        [540, 132],
      ],
      { flow: true, tone: 'brand' },
    ),
    heading(446, 112, 'LOG', { font: 'mono', size: 13, tracking: 3 }),
    lanes.map((item, index) => lane(item.name, item.written, item.y, 400 + index * 120)),
    consumer(166, 'A1', 800),
    consumer(250, 'A2', 880),
    group(
      [
        line(LANE_END, 154, 584, 178, { stroke: 'muted', width: 1.2 }),
        line(LANE_END, 210, 584, 186, { stroke: 'muted', width: 1.2 }),
        line(LANE_END, 266, 584, 266, { stroke: 'muted', width: 1.2 }),
      ],
      motion('fade', 760),
    ),
    // Grupo B: lee el mismo log a su ritmo, con su propio offset.
    group(
      [
        line(418, 244, 418, 288, { stroke: 'ink', width: 1.6 }),
        node(418, 288, 4),
        label(404, 298, 'B1', { anchor: 'end', size: 11, tone: 'ink' }),
      ],
      motion('fade', 1000),
    ),
    dimension([418, 320], [506, 320], 'LAG', { offset: 12 }),
  );
}
