import {
  arrow,
  circle,
  figure,
  group,
  label,
  line,
  motion,
  node,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure, Prim } from '../figure-types';

// Retícula de 3×3 teselas: cada una es un estilo dibujado con cajas y conectores.
const TILE_W = 192;
const TILE_H = 112;
const COLS = [20, 224, 428] as const;
const ROWS = [20, 144, 268] as const;

type Sketch = (x: number, y: number) => Prim[];

const box = (x: number, y: number, w: number, h: number, isSoft = false): Prim =>
  rect(x, y, w, h, { fill: isSoft ? 'brandSoft' : 'paper', r: 2, width: 1.3 });

// Capas: cada una solo habla con la de debajo.
const layered: Sketch = (x, y) =>
  [0, 1, 2, 3].map((index) => box(x + 36, y + 12 + index * 18, 120, 12, index === 0));

// Tubería: filtros independientes unidos por tuberías.
const pipeline: Sketch = (x, y) => [
  ...[0, 1, 2, 3].map((index) => box(x + 14 + index * 44, y + 34, 26, 22, index === 0)),
  ...[0, 1, 2].map((index) =>
    arrow(
      [
        [x + 40 + index * 44, y + 45],
        [x + 58 + index * 44, y + 45],
      ],
      { width: 1.3 },
    ),
  ),
];

// Microkernel: un núcleo pequeño y plug-ins conectados por un contrato.
const microkernel: Sketch = (x, y) => {
  const cx = x + 96;
  const cy = y + 46;
  const plugs = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ] as const;

  return [
    ...plugs.map(([sx, sy]) =>
      line(cx + sx * 30, cy + sy * 8, cx + sx * 56, cy + sy * 20, { width: 1.2 }),
    ),
    rect(cx - 30, cy - 17, 60, 34, { fill: 'brandSoft', r: 3, width: 1.5 }),
    ...plugs.map(([sx, sy]) => box(cx + sx * 70 - 13, cy + sy * 20 - 8, 26, 16)),
  ];
};

// Basada en servicios: pocos servicios gruesos y una base compartida (el acento).
const serviceBased: Sketch = (x, y) => {
  const columns = [x + 44, x + 96, x + 148];

  return [
    rect(x + 26, y + 10, 140, 12, { fill: 'paper', r: 2, width: 1.3 }),
    ...columns.flatMap((cx) => [
      line(cx, y + 22, cx, y + 34, { stroke: 'muted', width: 1.1 }),
      line(cx, y + 54, cx, y + 66, { stroke: 'muted', width: 1.1 }),
      rect(cx - 18, y + 34, 36, 20, { fill: 'paper', r: 2, stroke: 'accent', width: 1.7 }),
    ]),
    rect(x + 26, y + 66, 140, 14, { fill: 'brandSoft', r: 7, width: 1.3 }),
  ];
};

// Orientada a eventos: productores y consumidores no se conocen; solo el canal.
const eventDriven: Sketch = (x, y) => [
  rect(x + 22, y + 42, 148, 8, { fill: 'brandSoft', r: 4, width: 1.2 }),
  path(`M${x + 26} ${y + 46}L${x + 166} ${y + 46}`, {
    dash: '5 7',
    motion: motion('flow'),
    stroke: 'brand',
    width: 1.6,
  }),
  ...[x + 58, x + 134].flatMap((cx) => [
    line(cx, y + 30, cx, y + 42, { width: 1.1 }),
    box(cx - 15, y + 12, 30, 18),
  ]),
  ...[x + 44, x + 96, x + 148].flatMap((cx) => [
    line(cx, y + 50, cx, y + 62, { width: 1.1 }),
    box(cx - 15, y + 62, 30, 18),
  ]),
];

// Basada en espacio: unidades de proceso con datos en memoria; la base queda detrás.
const spaceBased: Sketch = (x, y) => [
  ...[x + 30, x + 80, x + 130].map((bx) => box(bx, y + 12, 34, 22)),
  rect(x + 22, y + 46, 148, 10, {
    dash: '4 4',
    fill: 'brandSoft',
    r: 2,
    stroke: 'muted',
    width: 1.1,
  }),
  ...[x + 47, x + 97, x + 147].map((cx) => line(cx, y + 34, cx, y + 46, { width: 1.1 })),
  line(x + 96, y + 56, x + 96, y + 68, { dash: '2 4', stroke: 'muted', width: 1.1 }),
  rect(x + 76, y + 68, 40, 12, { fill: 'paper', r: 6, width: 1.2 }),
];

// Microservicios: cada servicio con sus propios datos.
const microservices: Sketch = (x, y) => [
  line(x + 48, y + 23, x + 144, y + 23, { stroke: 'muted', width: 1.1 }),
  ...[x + 30, x + 72, x + 114, x + 156].flatMap((cx) => [
    line(cx, y + 32, cx, y + 58, { stroke: 'muted', width: 1.1 }),
    box(cx - 14, y + 14, 28, 18),
    circle(cx, y + 66, 8, { fill: 'brandSoft', width: 1.2 }),
  ]),
];

// Cliente-servidor: muchos clientes conocen al servidor; él no los conoce.
const clientServer: Sketch = (x, y) => [
  ...[y + 14, y + 38, y + 62].flatMap((cy) => [
    box(x + 24, cy, 32, 16),
    arrow(
      [
        [x + 56, cy + 8],
        [x + 126, y + 46 + (cy - y - 38) / 2],
      ],
      { width: 1.2 },
    ),
  ]),
  rect(x + 126, y + 18, 42, 56, { fill: 'brandSoft', r: 3, width: 1.5 }),
];

// Peer-to-peer: todos los nodos ofrecen y piden recursos.
const peerToPeer: Sketch = (x, y) => {
  const cx = x + 96;
  const cy = y + 46;
  const points = [0, 1, 2, 3, 4].map((index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 5;

    return [Math.round(cx + 34 * Math.cos(angle)), Math.round(cy + 32 * Math.sin(angle))] as const;
  });
  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 0],
    [0, 2],
    [1, 3],
    [2, 4],
  ] as const;

  return [
    ...links.map(([from, to]) => {
      const a = points[from] ?? [cx, cy];
      const b = points[to] ?? [cx, cy];

      return line(a[0], a[1], b[0], b[1], { stroke: 'muted', width: 1.1 });
    }),
    ...points.map(([px, py]) => node(px, py, 6)),
  ];
};

const styles = [
  { name: 'N-TIER', sketch: layered },
  { name: 'PIPE', sketch: pipeline },
  { name: 'PLUG-IN', sketch: microkernel },
  { isHot: true, name: 'SERVICE', sketch: serviceBased },
  { name: 'EVENT', sketch: eventDriven },
  { name: 'GRID', sketch: spaceBased },
  { name: 'MICRO', sketch: microservices },
  { name: 'C/S', sketch: clientServer },
  { name: 'P2P', sketch: peerToPeer },
] as const;

function tile(index: number): Prim {
  const style = styles[index];
  if (style === undefined) {
    return group([]);
  }

  const x = COLS[index % 3] ?? 0;
  const y = ROWS[Math.floor(index / 3)] ?? 0;

  const isHot = 'isHot' in style;

  return group(
    [
      rect(x, y, TILE_W, TILE_H, {
        r: 6,
        stroke: isHot ? 'accent' : 'faint',
        width: isHot ? 1.8 : 1.2,
      }),
      ...style.sketch(x, y),
      label(x + TILE_W / 2, y + 101, style.name, {
        size: 11,
        tone: isHot ? 'accent' : 'muted',
      }),
    ],
    motion('rise', 120 + index * 90),
  );
}

export function estilosArquitectonicos(): Figure {
  return figure(
    styles.map((_, index) => tile(index)),
    pulse(COLS[0] + TILE_W, ROWS[1], 10, 1200),
    node(COLS[0] + TILE_W, ROWS[1], 4, true, { stroke: 'accent' }),
  );
}
