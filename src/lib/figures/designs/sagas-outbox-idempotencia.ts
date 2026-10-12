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
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const TABLE_X = 88;
const TABLE_W = 192;

/**
Tabla de negocio dentro de la transacción local: cabecera y dos filas.
*/
function ordersTable() {
  return group(
    [
      rect(TABLE_X, 80, TABLE_W, 104, { fill: 'paper', r: 4 }),
      rect(TABLE_X, 80, TABLE_W, 28, { fill: 'brandSoft', r: 4 }),
      heading(184, 99, 'Orders', { font: 'mono', size: 13, tracking: 1 }),
      line(TABLE_X, 146, TABLE_X + TABLE_W, 146, { stroke: 'muted', width: 1 }),
      label(102, 132, '#41', { anchor: 'start', size: 10.5 }),
      label(102, 170, '#42', { anchor: 'start', size: 10.5, tone: 'ink' }),
      label(266, 132, 'PAID', { anchor: 'end', size: 10.5 }),
      label(266, 170, 'NEW', { anchor: 'end', size: 10.5, tone: 'ink' }),
    ],
    motion('rise', 150),
  );
}

/**
La tabla outbox: el único acento de la figura, escrita en el mismo COMMIT.
*/
function outboxTable() {
  return group(
    [
      rect(TABLE_X, 216, TABLE_W, 112, { fill: 'paper', r: 4, stroke: 'accent', width: 1.9 }),
      rect(TABLE_X, 216, TABLE_W, 28, { fill: 'accentSoft', r: 4, stroke: 'accent', width: 1.9 }),
      heading(184, 235, 'Outbox', { font: 'mono', size: 13, tracking: 1 }),
      line(TABLE_X, 286, TABLE_X + TABLE_W, 286, { stroke: 'accent', width: 1 }),
      label(102, 270, 'OrderPlaced', { anchor: 'start', size: 10.5, tone: 'ink' }),
      label(102, 312, 'OrderPaid', { anchor: 'start', size: 10.5 }),
      node(264, 266, 5, true),
    ],
    motion('rise', 350),
  );
}

function broker() {
  return group(
    [
      rect(500, 204, 112, 124, { fill: 'paper', r: 6, width: 1.6 }),
      ...[0, 1, 2].map((index) =>
        rect(516, 220 + index * 32, 80, 20, {
          fill: index === 2 ? 'brandSoft' : 'paper',
          r: 3,
          width: 1.2,
        }),
      ),
      heading(556, 352, 'Broker', { size: 16 }),
    ],
    motion('rise', 750),
  );
}

export function sagasOutboxIdempotencia(): Figure {
  return figure(
    // Carril izquierdo: una sola transacción local escribe el negocio y el mensaje.
    group(
      [
        rect(60, 58, 248, 290, { dash: '5 7', r: 10, stroke: 'muted', width: 1.2 }),
        label(184, 44, 'TX', { tone: 'ink', tracking: 3 }),
      ],
      motion('fade'),
    ),
    ordersTable(),
    outboxTable(),
    pulse(264, 266, 13, 1100),
    dimension([42, 80], [42, 328], 'COMMIT', { offset: 16 }),
    // Separación entre lo síncrono y lo asíncrono.
    line(330, 40, 330, 372, { dash: '2 6', stroke: 'faint', width: 1 }),
    // Carril derecho: el relay publica después, al menos una vez.
    group(
      [
        rect(352, 238, 108, 54, { fill: 'paper', r: 6, width: 1.6 }),
        heading(406, 271, 'Relay', { size: 16 }),
        label(406, 314, 'POLL · CDC', { size: 10 }),
      ],
      motion('rise', 550),
    ),
    arrow(
      [
        [282, 266],
        [350, 266],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    arrow(
      [
        [462, 266],
        [498, 266],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    broker(),
    // El consumidor deduplica por id del mensaje.
    group(
      [
        rect(500, 64, 112, 62, { fill: 'paper', r: 6, width: 1.6 }),
        heading(556, 92, 'Consumer', { size: 15 }),
        label(556, 112, 'INBOX', { size: 10 }),
      ],
      motion('rise', 950),
    ),
    arrow(
      [
        [556, 202],
        [556, 128],
      ],
      { dash: '5 7', tone: 'ink', width: 1.4 },
    ),
    label(568, 170, 'ID', { anchor: 'start', size: 10.5, tone: 'ink' }),
  );
}
