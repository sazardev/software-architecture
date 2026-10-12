import {
  arrow,
  dimension,
  figure,
  group,
  heading,
  label,
  motion,
  node,
  poly,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const lb = { h: 110, w: 40, x: 150, y: 145 } as const;
const hash: Point = [392, 200];
const apiRows = [100, 178, 256] as const;

// Particiones con su ocupación: la última recibe la clave caliente y se satura.
const shards = [
  { isHot: false, load: 22, name: 'P0', y: 70 },
  { isHot: false, load: 30, name: 'P1', y: 140 },
  { isHot: false, load: 18, name: 'P2', y: 210 },
  { isHot: true, load: 56, name: 'P3', y: 280 },
] as const;

function api(y: number, index: number) {
  return group(
    [
      rect(244, y, 96, 44, { fill: 'paper', r: 5, width: 1.6 }),
      heading(292, y + 28, 'API', { font: 'mono', size: 13, tracking: 2 }),
    ],
    motion('rise', 300 + index * 90),
  );
}

function shard(item: (typeof shards)[number], index: number) {
  return group(
    [
      rect(470, item.y, 124, 50, {
        fill: 'paper',
        r: 5,
        stroke: item.isHot ? 'accent' : 'ink',
        width: item.isHot ? 2.2 : 1.6,
      }),
      heading(496, item.y + 31, item.name, { font: 'mono', size: 13, tracking: 1 }),
      rect(526, item.y + 20, 56, 10, { r: 2, stroke: 'muted', width: 1 }),
      rect(526, item.y + 20, item.load, 10, {
        fill: item.isHot ? 'accent' : 'brandSoft',
        r: 2,
        stroke: undefined,
        width: undefined,
      }),
    ],
    motion('rise', 700 + index * 90),
  );
}

export function escalabilidadCasosClasicos(): Figure {
  return figure(
    // Embudo de entrada: mucho tráfico que converge en el balanceador.
    group(
      [
        poly(
          [
            [24, 74],
            [lb.x, lb.y + 20],
            [lb.x, lb.y + lb.h - 20],
            [24, 326],
          ],
          { fill: 'brandSoft', stroke: undefined },
          true,
        ),
        poly(
          [
            [24, 74],
            [lb.x, lb.y + 20],
          ],
          { dash: '4 4', stroke: 'muted', width: 1.2 },
        ),
        poly(
          [
            [24, 326],
            [lb.x, lb.y + lb.h - 20],
          ],
          { dash: '4 4', stroke: 'muted', width: 1.2 },
        ),
      ],
      motion('rise'),
    ),
    [110, 200, 290].map((y, index) =>
      group(
        [
          arrow(
            [
              [34, y],
              [lb.x, 200 + (y - 200) * 0.3],
            ],
            { tone: 'brand', width: 1.4 },
          ),
        ],
        motion('fade', 120 + index * 80),
      ),
    ),
    group(
      [
        rect(lb.x, lb.y, lb.w, lb.h, { fill: 'paper', r: 5, width: 1.6 }),
        heading(lb.x + lb.w / 2, 205, 'LB', { font: 'mono', size: 13, tracking: 1 }),
      ],
      motion('rise', 200),
    ),
    // Servicios sin estado: se clonan en horizontal.
    apiRows.map((y, index) => api(y, index)),
    apiRows.map((y) =>
      arrow(
        [
          [lb.x + lb.w, 200],
          [244, y + 22],
        ],
        { width: 1.3 },
      ),
    ),
    dimension([244, 330], [340, 330], '×N', { offset: 12 }),
    // Enrutado por clave hacia las particiones.
    apiRows.map((y) =>
      arrow(
        [
          [340, y + 22],
          [hash[0] - 14, hash[1] + (y + 22 - 200) * 0.15],
        ],
        { width: 1.3 },
      ),
    ),
    group(
      [node(hash[0], hash[1], 14, false, { width: 1.6 }), heading(hash[0], 206, '#', { size: 15 })],
      motion('fade', 600),
    ),
    label(hash[0], 250, 'hash(key)', { size: 10.5 }),
    shards
      .filter((item) => !item.isHot)
      .map((item) =>
        arrow(
          [
            [hash[0] + 14, hash[1]],
            [470, item.y + 25],
          ],
          { tone: 'muted', width: 1.2 },
        ),
      ),
    arrow(
      [
        [hash[0] + 12, hash[1] + 8],
        [470, 305],
      ],
      { flow: true, width: 2 },
    ),
    shards.map((item, index) => shard(item, index)),
    pulse(582, 305, 12, 1100),
    // Rótulos de capa.
    label(80, 44, 'QPS', { tone: 'ink', tracking: 3 }),
    label(170, 44, 'LB', { tone: 'ink', tracking: 3 }),
    label(292, 44, 'STATELESS', { tone: 'ink', tracking: 3 }),
    label(532, 44, 'SHARDS', { tone: 'ink', tracking: 3 }),
    label(532, 362, 'HOT KEY', { tone: 'accent', tracking: 3 }),
  );
}
