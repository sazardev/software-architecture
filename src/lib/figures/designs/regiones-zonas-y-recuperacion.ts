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
  poly,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const AXIS_Y = 300;
const LAST_SYNCED = 240;
const FAILURE = 368;
const RECOVERED = 560;

/**
Zona de disponibilidad con su base de datos (o un hueco apagado, si `isIdle`).
*/
function zone(x: number, w: number, name: string, inner: string, isIdle = false) {
  const cx = x + w / 2;

  return [
    rect(x, 72, w, 112, {
      dash: '4 4',
      fill: isIdle ? undefined : 'brandSoft',
      r: 4,
      stroke: isIdle ? 'muted' : 'brand',
      width: 1,
    }),
    label(cx, 92, name, { size: 10.5 }),
    rect(cx - 30, 112, 60, 44, {
      dash: isIdle ? '3 5' : undefined,
      fill: 'paper',
      r: 4,
      stroke: isIdle ? 'muted' : 'ink',
      width: isIdle ? 1.2 : 1.5,
    }),
    heading(cx, 140, inner, {
      font: 'mono',
      size: 13,
      tone: isIdle ? 'muted' : 'ink',
      tracking: 1,
    }),
  ];
}

function region(x: number, w: number, name: string) {
  return [
    rect(x, 28, w, 176, { fill: 'paper', r: 6, width: 1.6 }),
    heading(x + 16, 54, name, { anchor: 'start', font: 'mono', size: 13, tracking: 2 }),
  ];
}

const replicated = [64, 104, 144, 184, 224];
const lost = [264, 296, 328];

export function regionesZonasYRecuperacion(): Figure {
  return figure(
    // Región primaria: dos zonas con réplica síncrona entre ellas.
    group(
      [
        ...region(24, 276, 'R1'),
        ...zone(40, 116, 'AZ-a', 'DB'),
        ...zone(168, 116, 'AZ-b', 'DB'),
        rect(144, 113, 40, 15, { fill: 'paper', r: 2, stroke: undefined }),
        label(164, 124, 'SYNC', { size: 10, tone: 'ink' }),
      ],
      motion('rise'),
    ),
    arrow(
      [
        [128, 134],
        [196, 134],
      ],
      { width: 1.4 },
    ),
    // Región secundaria: réplica asíncrona y aplicación apagada (piloto).
    group(
      [
        ...region(356, 260, 'R2'),
        ...zone(372, 116, 'AZ-a', 'DB'),
        ...zone(500, 104, 'AZ-b', 'APP', true),
      ],
      motion('rise', 200),
    ),
    arrow(
      [
        [256, 134],
        [400, 134],
      ],
      { dash: '5 7', flow: true, tone: 'brand', width: 1.4 },
    ),
    label(328, 124, 'ASYNC', { size: 10, tone: 'ink' }),
    // Lo último que llegó a R2 marca el inicio del hueco.
    poly(
      [
        [430, 184],
        [430, 244],
        [LAST_SYNCED, 244],
        [LAST_SYNCED, 282],
      ],
      { dash: '3 5', motion: motion('fade', 600), stroke: 'muted', width: 1 },
    ),
    // Línea de tiempo: escrituras replicadas, escrituras perdidas, caída y recuperación.
    group(
      [
        rect(LAST_SYNCED, 282, FAILURE - LAST_SYNCED, 36, {
          fill: 'accent',
          opacity: 0.14,
          r: 2,
          stroke: undefined,
        }),
        line(32, AXIS_Y, 604, AXIS_Y, { stroke: 'muted', width: 1.2 }),
        label(612, AXIS_Y + 4, 't', { anchor: 'start', size: 11 }),
        ...replicated.map((x) => node(x, AXIS_Y, 5)),
        ...lost.map((x) => node(x, AXIS_Y, 5, true)),
        line(FAILURE - 8, AXIS_Y - 8, FAILURE + 8, AXIS_Y + 8, { width: 2.2 }),
        line(FAILURE - 8, AXIS_Y + 8, FAILURE + 8, AXIS_Y - 8, { width: 2.2 }),
        node(RECOVERED, AXIS_Y, 6, false, { fill: 'brand', stroke: 'brand' }),
        label(RECOVERED, AXIS_Y - 16, 'R2', { size: 10.5, tone: 'ink' }),
        label(FAILURE, AXIS_Y - 16, 'R1', { size: 10.5, tone: 'ink' }),
      ],
      motion('rise', 400),
    ),
    pulse(296, AXIS_Y, 20, 1000),
    // Cotas: RPO es el hueco de datos (acento); RTO, el tiempo sin servicio.
    group(
      [
        line(LAST_SYNCED, 334, FAILURE, 334, { stroke: 'accent', width: 1.6 }),
        line(LAST_SYNCED - 5, 339, LAST_SYNCED + 5, 329, { stroke: 'accent', width: 1.6 }),
        line(FAILURE - 5, 339, FAILURE + 5, 329, { stroke: 'accent', width: 1.6 }),
        label((LAST_SYNCED + FAILURE) / 2, 358, 'RPO', { size: 13, tone: 'accent', tracking: 2 }),
      ],
      motion('fade', 800),
    ),
    dimension([FAILURE, 334], [RECOVERED, 334], 'RTO', { offset: -20 }),
  );
}
