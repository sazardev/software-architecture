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
  type Point,
} from '../figure-kit';
import { smoothPath } from '../figure-shapes';
import type { Figure } from '../figure-types';

// Bucle de refuerzo: BUGS → HOTFIX → BACKLOG → BUGS, en sentido horario alrededor de `center`.
const center: Point = [220, 198];
const radius = 118;

function onLoop(degrees: number, distance = radius): Point {
  const angle = (degrees * Math.PI) / 180;

  return [center[0] + distance * Math.cos(angle), center[1] + distance * Math.sin(angle)];
}

function arc(from: number, to: number, distance = radius): Point[] {
  const steps = 28;

  return Array.from({ length: steps + 1 }, (_, index) =>
    onLoop(from + ((to - from) * index) / steps, distance),
  );
}

const stations = [
  { at: onLoop(-90), name: 'BUGS', width: 92 },
  { at: onLoop(30), name: 'HOTFIX', width: 100 },
  { at: onLoop(150), name: 'BACKLOG', width: 108 },
] as const;

// Tramos del bucle (grados) y posición del signo de polaridad junto a cada cabeza de flecha.
const links = [
  { from: -58, sign: 4, to: 10 },
  { from: 55, sign: 119, to: 125 },
  { from: 170, sign: 232, to: 238 },
] as const;

function station(at: Point, name: string, width: number, delay: number) {
  return group(
    [
      rect(at[0] - width / 2, at[1] - 17, width, 34, { fill: 'paper', r: 17, width: 1.6 }),
      heading(at[0], at[1] + 4.5, name, { font: 'mono', size: 12, tracking: 1.6 }),
    ],
    motion('rise', delay),
  );
}

// Retraso: doble marca cruzando el tramo BACKLOG → BUGS, como en los diagramas causales.
function delayMark(degrees: number) {
  const marks = [-3.2, 3.2].map((offset) => {
    const inner = onLoop(degrees + offset, radius - 9);
    const outer = onLoop(degrees + offset, radius + 9);

    return line(inner[0], inner[1], outer[0], outer[1], { stroke: 'ink', width: 2 });
  });
  const tag = onLoop(degrees, radius + 34);

  return group(
    [...marks, label(tag[0], tag[1] + 4, 'Δt', { size: 13, tone: 'ink', tracking: 0.5 })],
    motion('fade', 700),
  );
}

// Curvas de BUGS en el tiempo: el efecto de la intervención llega con retraso.
const axisX = 420;
const axisY = 300;
const shared: Point[] = [
  [axisX, 272],
  [470, 268],
  [530, 260],
];
const runaway: Point[] = [
  [530, 260],
  [562, 236],
  [584, 196],
  [600, 134],
];
const damped: Point[] = [
  [530, 260],
  [565, 256],
  [600, 254],
];

function loopArrow() {
  return arrow(arc(-40, 245, 30), { tone: 'muted', width: 1.3 });
}

const sharedCurve = smoothPath(shared);
const runawayCurve = smoothPath(runaway);
const dampedCurve = smoothPath(damped);
const flowMotion = motion('flow');

export function pensamientoSistemicoYSesgos(): Figure {
  const intervention = onLoop(90);

  return figure(
    // Bucle de refuerzo.
    links.map((link, index) => {
      const signAt = onLoop(link.sign, radius + 18);

      return group(
        [
          arrow(arc(link.from, link.to), { flow: true, tone: 'brand', width: 1.7 }),
          label(signAt[0], signAt[1] + 4, '+', { size: 14, tone: 'ink', tracking: 0 }),
        ],
        motion('fade', 200 + index * 160),
      );
    }),
    stations.map((item, index) => station(item.at, item.name, item.width, 100 + index * 140)),
    group([loopArrow(), heading(center[0], center[1] + 8, 'R', { size: 24 })], motion('fade', 500)),
    delayMark(204),
    // Punto de intervención: reducir la ganancia del bucle (capacidad reservada).
    pulse(intervention[0], intervention[1], 16, 900),
    node(intervention[0], intervention[1], 6.5, true),
    line(intervention[0], intervention[1] + 10, intervention[0], 340, {
      dash: '2 4',
      stroke: 'muted',
      width: 1.2,
    }),
    label(intervention[0], 360, '20%', { size: 13, tone: 'ink', tracking: 1 }),
    // Serie temporal.
    group(
      [
        rect(396, 72, 222, 274, { fill: 'brandSoft', r: 5, stroke: undefined }),
        line(axisX, axisY, 604, axisY, { width: 1.2 }),
        line(axisX, axisY, axisX, 104, { width: 1.2 }),
        label(axisX, 94, 'BUGS', { size: 11 }),
        label(604, 318, 't', { anchor: 'end', size: 12 }),
      ],
      motion('rise', 300),
    ),
    group(
      [
        line(470, axisY, 470, 160, { dash: '3 4', stroke: 'muted', width: 1 }),
        path(sharedCurve, { width: 1.8 }),
        path(runawayCurve, { width: 1.8 }),
        path(dampedCurve, {
          dash: '5 7',
          motion: flowMotion,
          stroke: 'brand',
          width: 2,
        }),
        node(470, 268, 4),
        label(596, 128, 'R', { anchor: 'end', size: 12, tone: 'ink' }),
        label(600, 244, '20%', { anchor: 'end', size: 11, tone: 'brand' }),
      ],
      motion('rise', 600),
    ),
    dimension([470, 330], [530, 330], 'Δt', { offset: 12 }),
  );
}
