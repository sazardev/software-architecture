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
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

// Carril superior: la llamada atraviesa el interruptor antes de llegar a la dependencia.
const LANE_Y = 118;
const PIVOT: Point = [292, LANE_Y];
const CONTACT: Point = [352, LANE_Y];

// Línea de tiempo inferior: intentos con espera creciente y, al final, el circuito abierto.
const AXIS_Y = 300;
const BAR_H = 22;
const OPEN_X = 382;

const attempts = [
  { at: 52, name: '#1' },
  { at: 152, name: '#2' },
  { at: 270, name: '#3' },
] as const;

const ATTEMPT_W = 74;

function attempt(at: number, name: string, delay: number) {
  const end = at + ATTEMPT_W;
  const top = AXIS_Y - BAR_H;

  return group(
    [
      rect(at, top, ATTEMPT_W, BAR_H, { fill: 'brandSoft', r: 2, width: 1.3 }),
      label(at + ATTEMPT_W / 2 - 6, top + 15, name, { size: 10.5, tone: 'ink', tracking: 1 }),
      line(end - 12, top + 6, end - 4, top + 14, { width: 1.4 }),
      line(end - 12, top + 14, end - 4, top + 6, { width: 1.4 }),
    ],
    motion('rise', delay),
  );
}

// Arranques alternativos del reintento: el jitter reparte a los clientes en el tiempo.
function jitterTicks(at: number) {
  return [-12, -6, 6, 12].map((offset) =>
    line(at + offset, AXIS_Y - BAR_H - 10, at + offset, AXIS_Y - BAR_H - 2, {
      dash: '2 2',
      stroke: 'muted',
      width: 1,
    }),
  );
}

export function resilienciaSistemasDistribuidos(): Figure {
  const flow = motion('flow');
  const failFast = [408, 434, 460, 486, 512, 538].map((x) =>
    line(x, AXIS_Y - 12, x, AXIS_Y - 2, { stroke: 'muted', width: 1.4 }),
  );

  return figure(
    // Llamante y dependencia degradada.
    group(
      [
        rect(32, LANE_Y - 30, 112, 60, { fill: 'paper', r: 5, width: 1.6 }),
        heading(88, LANE_Y + 6, 'API'),
        rect(496, LANE_Y - 30, 112, 60, { dash: '5 3', fill: 'brandSoft', r: 5, width: 1.6 }),
        heading(552, LANE_Y + 6, 'DB'),
        label(552, LANE_Y + 52, '503 · p99↑', { size: 11 }),
      ],
      motion('rise'),
    ),
    arrow(
      [
        [144, LANE_Y],
        [PIVOT[0] - 6, LANE_Y],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    line(CONTACT[0] + 6, LANE_Y, 496, LANE_Y, { dash: '4 4', stroke: 'muted', width: 1.4 }),
    // El interruptor abierto: la idea clave de la figura.
    group(
      [
        line(PIVOT[0], PIVOT[1], CONTACT[0] - 4, LANE_Y - 40, { stroke: 'accent', width: 2.8 }),
        node(PIVOT[0], PIVOT[1], 6, true),
        node(CONTACT[0], CONTACT[1], 6),
        label(322, LANE_Y + 34, 'BREAKER', { tone: 'ink' }),
        label(CONTACT[0] + 14, LANE_Y - 40, 'OPEN', { anchor: 'start', tone: 'accent' }),
      ],
      motion('fade', 500),
    ),
    pulse(PIVOT[0], PIVOT[1], 20, 1200),
    line(322, LANE_Y + 46, OPEN_X, AXIS_Y - 40, { dash: '2 4', stroke: 'accent', width: 1.3 }),
    // Línea de tiempo: intentos, espera creciente y fallo rápido.
    arrow(
      [
        [36, AXIS_Y],
        [612, AXIS_Y],
      ],
      { tone: 'muted', width: 1.2 },
    ),
    label(612, AXIS_Y + 22, 't', { anchor: 'end' }),
    attempts.map((item, index) => attempt(item.at, item.name, 300 + index * 180)),
    group([...jitterTicks(152), ...jitterTicks(270)], motion('fade', 800)),
    dimension([52, AXIS_Y - 46], [126, AXIS_Y - 46], 'TIMEOUT'),
    label(270, AXIS_Y - 38, 'JITTER', { size: 10 }),
    dimension([126, AXIS_Y + 20], [152, AXIS_Y + 20]),
    dimension([226, AXIS_Y + 20], [270, AXIS_Y + 20], 'BACKOFF', { offset: -14 }),
    group(
      [
        line(OPEN_X, AXIS_Y, 600, AXIS_Y, {
          dash: '5 7',
          motion: flow,
          stroke: 'accent',
          width: 2.2,
        }),
        ...failFast,
        node(OPEN_X, AXIS_Y, 5, true),
        label(491, AXIS_Y - 26, 'FAIL FAST', { tone: 'accent' }),
      ],
      motion('fade', 1000),
    ),
  );
}
