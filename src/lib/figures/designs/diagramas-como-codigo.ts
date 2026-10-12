import {
  arrow,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure, Tone } from '../figure-types';

type Segment = readonly [Tone, number];

// Cada fila del "código" es una lista de segmentos (tono, ancho): palabras clave y nombres.
const source: readonly (readonly Segment[])[] = [
  [
    ['brand', 44],
    ['ink', 70],
  ],
  [
    ['muted', 14],
    ['ink', 54],
    ['accent', 28],
    ['ink', 62],
  ],
  [
    ['muted', 14],
    ['ink', 54],
    ['accent', 28],
    ['ink', 80],
  ],
  [
    ['muted', 14],
    ['ink', 66],
    ['accent', 28],
    ['ink', 48],
  ],
  [
    ['brand', 44],
    ['ink', 86],
  ],
  [
    ['muted', 14],
    ['ink', 74],
    ['accent', 28],
    ['ink', 56],
  ],
  [
    ['muted', 14],
    ['ink', 40],
    ['accent', 28],
    ['ink', 70],
  ],
];

const boxes = [
  { fill: 'paper', name: 'API', x: 420, y: 78, w: 130 },
  { fill: 'paper', name: 'AUTH', x: 386, y: 150, w: 96 },
  { fill: 'accentSoft', name: 'ORDERS', x: 490, y: 150, w: 96 },
  { fill: 'brandSoft', name: 'DB', x: 420, y: 222, w: 130 },
] as const;

const center = (index: number, side: 'bottom' | 'top'): Point => {
  const box = boxes[index];

  return box === undefined ? [0, 0] : [box.x + box.w / 2, side === 'top' ? box.y : box.y + 30];
};

const links = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
] as const;

export function diagramasComoCodigo(): Figure {
  const connectors = links.map(([from, to]) => arrow([center(from, 'bottom'), center(to, 'top')]));
  const boxShapes = boxes.map((box) => rect(box.x, box.y, box.w, 30, { fill: box.fill, r: 4 }));
  const boxLabels = boxes.map((box) =>
    heading(box.x + box.w / 2, box.y + 19, box.name, { font: 'mono', size: 11.5 }),
  );

  return figure(
    // Editor con el texto fuente.
    group(
      [
        rect(40, 56, 240, 232, { fill: 'paper', r: 5, width: 1.6 }),
        line(40, 84, 280, 84, { width: 1.2 }),
        node(56, 70, 3.5, false, { width: 1.2 }),
        node(70, 70, 3.5, false, { width: 1.2 }),
        node(84, 70, 3.5, false, { width: 1.2 }),
        label(268, 74, 'DIAGRAM.MMD', { anchor: 'end', size: 10 }),
        ...source.flatMap((row, rowIndex) => {
          const y = 112 + rowIndex * 24;
          let x = 70;

          return [
            label(58, y + 4, String(rowIndex + 1), { size: 10, tone: 'faint' }),
            ...row.map(([tone, width]) => {
              const segment = line(x, y, x + width, y, { stroke: tone, width: 5 });

              x += width + 8;

              return segment;
            }),
          ];
        }),
      ],
      motion('rise'),
    ),
    // Render.
    group(
      [
        arrow(
          [
            [296, 172],
            [366, 172],
          ],
          { flow: true, width: 2 },
        ),
        label(331, 154, 'RENDER', { tone: 'accent' }),
      ],
      motion('fade', 500),
    ),
    // Diagrama resultante.
    group(
      [
        rect(366, 56, 244, 232, { fill: 'sunken', r: 5, width: 1.6 }),
        ...connectors,
        ...boxShapes,
        ...boxLabels,
      ],
      motion('rise', 700),
    ),
    // Historial versionado.
    line(40, 336, 610, 336, { stroke: 'muted', width: 1.2 }),
    [70, 150, 230, 310, 390, 470].map((x) => node(x, 336, 5.5, false, { width: 1.5 })),
    pulse(550, 336, 12, 1000),
    node(550, 336, 6, true),
    label(40, 366, 'GIT', { anchor: 'start', tone: 'ink', tracking: 3 }),
    label(610, 366, 'EVERY CHANGE, REVIEWED', { anchor: 'end' }),
  );
}
