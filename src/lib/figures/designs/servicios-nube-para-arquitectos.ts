import {
  arrowHead,
  figure,
  group,
  label,
  line,
  motion,
  node,
  poly,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const COLUMN_X = 112;
const COLUMN_W = 88;
const COLUMN_STEP = 100;
const ROW_Y = 72;
const ROW_H = 46;
const ROW_STEP = 54;

const rows = ['IAM', 'APP', 'RUNTIME', 'VM', 'HW'] as const;

// Capas que opera el cliente (desde arriba) en cada modelo de servicio.
const models = [
  { name: 'IaaS', yours: 4 },
  { name: 'CaaS', yours: 3 },
  { name: 'PaaS', yours: 2 },
  { name: 'FaaS', yours: 2 },
  { name: 'SaaS', yours: 1 },
] as const;

const columnX = (index: number): number => COLUMN_X + index * COLUMN_STEP;
const boundaryY = (layers: number): number => ROW_Y + layers * ROW_STEP - 4;

function column(index: number, name: string, yours: number) {
  const x = columnX(index);

  return group(
    [
      label(x + COLUMN_W / 2, 52, name, { font: 'mono', size: 13, tone: 'ink', tracking: 1.2 }),
      ...rows.map((_, row) =>
        rect(x, ROW_Y + row * ROW_STEP, COLUMN_W, ROW_H, {
          // En CaaS, el SO de los nodos depende de la variante: celda punteada.
          dash: name === 'CaaS' && row === yours ? '4 4' : undefined,
          fill: row < yours ? 'paper' : 'brandSoft',
          r: 4,
          stroke: row < yours ? 'ink' : 'muted',
          width: row < yours ? 1.5 : 1,
        }),
      ),
    ],
    motion('rise', 120 + index * 110),
  );
}

// Frontera de responsabilidad: escalón que sube a medida que el proveedor opera más capas.
const frontier: Point[] = models.flatMap((model, index) => {
  const y = boundaryY(model.yours);
  const left = index === 0 ? columnX(0) - 8 : columnX(index) - 6;
  const right = index === models.length - 1 ? columnX(index) + COLUMN_W + 8 : columnX(index) + 94;

  return [
    [left, y],
    [right, y],
  ];
});

const first = frontier[0] ?? [0, 0];
const last = frontier.at(-1) ?? [0, 0];

export function serviciosNubeParaArquitectos(): Figure {
  const flow = motion('flow');
  const left = columnX(0);
  const right = columnX(4) + COLUMN_W;

  return figure(
    // Rótulos de las capas, de lo que siempre es tuyo (arriba) a lo físico (abajo).
    group(
      rows.map((row, index) =>
        label(58, ROW_Y + index * ROW_STEP + ROW_H / 2 + 4, row, { size: 11, tone: 'muted' }),
      ),
      motion('fade', 60),
    ),
    models.map((model, index) => column(index, model.name, model.yours)),
    group(
      [
        poly(frontier, { stroke: 'accent', width: 2.6 }),
        poly(frontier, { dash: '5 7', motion: flow, stroke: 'paper', width: 1.2 }),
        node(first[0], first[1], 4.5, true),
        node(last[0], last[1], 4.5, true),
      ],
      motion('fade', 800),
    ),
    // Cota inferior: control a la izquierda, dependencia del SLA a la derecha.
    group(
      [
        line(left + 8, 362, right - 8, 362, { stroke: 'muted', width: 1 }),
        arrowHead([right - COLUMN_W, 362], [left, 362], 'muted', 7),
        arrowHead([left, 362], [right, 362], 'muted', 7),
        label(left + 4, 384, 'CONTROL', { anchor: 'start', size: 10.5, tone: 'ink' }),
        label(right - 4, 384, 'SLA', { anchor: 'end', size: 10.5, tone: 'ink' }),
      ],
      motion('fade', 1000),
    ),
  );
}
