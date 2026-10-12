import {
  arrow,
  dimension,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const LOG_X = 236;
const LOG_W = 156;
const CELL_H = 28;
const CELL_GAP = 6;
const LOG_TOP = 84;
const EVENTS = 7;
const SNAPSHOT_AT = 4;
const SNAPSHOT_GAP = 16;

const cellY = (index: number): number =>
  LOG_TOP + index * (CELL_H + CELL_GAP) + (index >= SNAPSHOT_AT ? SNAPSHOT_GAP : 0);
const snapshotY = cellY(SNAPSHOT_AT) - (CELL_GAP + SNAPSHOT_GAP) / 2;
const lastY = cellY(EVENTS - 1);
const logBottom = lastY + CELL_H;

const PROJECTION_X = 476;
const PROJECTION_W = 140;
const PROJECTION_H = 66;
const projections = [96, 184, 272] as const;

/**
Registro de eventos: celdas apiladas, solo se añade al final; la última es la recién escrita.
*/
function eventLog() {
  const cells = Array.from({ length: EVENTS }, (_, index) => {
    const y = cellY(index);
    const isNewest = index === EVENTS - 1;

    return group(
      [
        rect(LOG_X + 8, y, LOG_W - 16, CELL_H, {
          fill: isNewest ? 'accent' : 'brandSoft',
          r: 3,
          stroke: isNewest ? 'accent' : 'ink',
          width: 1.2,
        }),
        label(LOG_X + 24, y + 18.5, `e${String(index + 1)}`, {
          anchor: 'start',
          size: 11,
          tone: isNewest ? 'paper' : 'ink',
        }),
        label(LOG_X + LOG_W - 22, y + 18.5, `v${String(index + 1)}`, {
          anchor: 'end',
          size: 10,
          tone: isNewest ? 'paper' : 'muted',
        }),
      ],
      motion('rise', 200 + index * 90),
    );
  });

  return [
    rect(LOG_X, LOG_TOP - 10, LOG_W, logBottom - LOG_TOP + 20, {
      fill: 'paper',
      r: 6,
      stroke: 'accent',
      width: 1.8,
    }),
    ...cells,
    // Snapshot entre e4 y e5: punto de partida para no reproducir todo el registro.
    group(
      [
        line(LOG_X - 6, snapshotY, LOG_X + LOG_W / 2 - 38, snapshotY, {
          dash: '4 4',
          stroke: 'muted',
          width: 1.2,
        }),
        line(LOG_X + LOG_W / 2 + 38, snapshotY, LOG_X + LOG_W + 6, snapshotY, {
          dash: '4 4',
          stroke: 'muted',
          width: 1.2,
        }),
        label(LOG_X + LOG_W / 2, snapshotY + 3.5, 'snapshot', { size: 9.5, tracking: 1.2 }),
      ],
      motion('fade', 1000),
    ),
    pulse(LOG_X + LOG_W / 2, lastY + CELL_H / 2, 22, 1300),
  ];
}

function projection(y: number, index: number) {
  const x = PROJECTION_X;

  return group(
    [
      rect(x, y, PROJECTION_W, PROJECTION_H, { fill: 'paper', r: 5, width: 1.5 }),
      rect(x, y, PROJECTION_W, 20, { fill: 'brandSoft', r: 5, stroke: undefined }),
      line(x, y + 20, x + PROJECTION_W, y + 20, { stroke: 'ink', width: 1 }),
      label(x + 12, y + 14.5, `P${String(index + 1)}`, {
        anchor: 'start',
        size: 10.5,
        tone: 'ink',
      }),
      line(x + 12, y + 34, x + PROJECTION_W - 40, y + 34, { stroke: 'muted', width: 1 }),
      line(x + 12, y + 46, x + PROJECTION_W - 24, y + 46, { stroke: 'muted', width: 1 }),
      line(x + 12, y + 58, x + PROJECTION_W - 56, y + 58, { stroke: 'muted', width: 1 }),
    ],
    motion('rise', 700 + index * 140),
  );
}

export function eventDrivenCqrsEventSourcing(): Figure {
  const commandY = lastY + CELL_H / 2;

  return figure(
    // Escritura: el comando valida y añade un evento nuevo al final del registro.
    group(
      [
        rect(24, commandY - 34, 150, 68, { fill: 'brandSoft', r: 6, width: 1.6 }),
        heading(99, commandY + 6, 'Command'),
      ],
      motion('rise'),
    ),
    // Replay: las proyecciones se reconstruyen recorriendo el registro desde el principio.
    group(
      [
        arrow(
          [
            [206, LOG_TOP],
            [206, snapshotY],
          ],
          { dash: '3 5', tone: 'muted', width: 1.3 },
        ),
        label(192, (LOG_TOP + snapshotY) / 2, 'replay', { rotate: -90, size: 9.5, tracking: 1.2 }),
      ],
      motion('fade', 1100),
    ),
    eventLog(),
    arrow(
      [
        [174, commandY],
        [LOG_X + 8, commandY],
      ],
      { tone: 'brand', width: 1.8 },
    ),
    label(205, commandY - 10, 'append', { size: 9.5, tracking: 1 }),
    label(LOG_X + LOG_W / 2, LOG_TOP - 22, 'EVENT STORE', { size: 11, tone: 'ink', tracking: 2 }),
    // Lectura: cada proyección es una vista desnormalizada para una consulta concreta.
    projections.map((y) =>
      arrow(
        [
          [LOG_X + LOG_W, y + PROJECTION_H / 2],
          [PROJECTION_X, y + PROJECTION_H / 2],
        ],
        { tone: 'ink', width: 1.4 },
      ),
    ),
    projections.map((y, index) => projection(y, index)),
    label(PROJECTION_X + PROJECTION_W / 2, 80, 'Query', { size: 11, tone: 'ink', tracking: 2 }),
    label(99, commandY - 50, 'CQRS', { size: 11, tone: 'ink', tracking: 3 }),
    dimension([LOG_X + LOG_W, 372], [PROJECTION_X, 372], 'Δt', { offset: 12 }),
  );
}
