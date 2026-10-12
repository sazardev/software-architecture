import {
  arrow,
  arrowHead,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  path,
  poly,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import type { CirclePrim, Figure, PathPrim, Tone } from '../figure-types';

const MID = 146;
const TRACE_Y = 318;
const TRACE_FLOW = motion('flow');

function diamond(cx: number, fill: Tone): PathPrim {
  const half = 24;
  const points: Point[] = [
    [cx, MID - half],
    [cx + half, MID],
    [cx, MID + half],
    [cx - half, MID],
  ];

  return poly(points, { fill, width: 1.6 }, true);
}

function traceTicks(): CirclePrim[] {
  return [135, 285, 404, 490, 582].map((x) =>
    circle(x, TRACE_Y, 3.5, { fill: 'paper', stroke: 'muted', width: 1.2 }),
  );
}

function step(x: number, title: string, sub: string, fill: Tone, delay: number) {
  return group(
    [
      rect(x, MID - 32, 110, 64, { fill, r: 5, width: 1.6 }),
      heading(x + 55, MID - 2, title, { font: 'mono', size: 13, tracking: 2 }),
      label(x + 55, MID + 18, sub, { size: 11 }),
    ],
    motion('rise', delay),
  );
}

export function disenarFlujosConAgentes(): Figure {
  return figure(
    // Índices de paso, como en un plano.
    group(
      [
        label(135, 74, '01', { size: 10 }),
        label(285, 68, '02', { size: 10 }),
        label(404, 74, '03', { size: 10 }),
        label(490, 74, '04', { size: 10 }),
        label(582, 74, '05', { size: 10 }),
      ],
      motion('fade', 200),
    ),
    // Entrada y paso determinista.
    group([node(40, MID, 6), label(40, MID - 20, 'IN', { size: 10 })], motion('fade', 100)),
    arrow([
      [46, MID],
      [80, MID],
    ]),
    step(80, 'RULES', 'f(x)', 'paper', 150),
    arrow([
      [190, MID],
      [230, MID],
    ]),
    // Paso de agente: el bucle que decide su propio camino.
    step(230, 'AGENT', 'LLM', 'brandSoft', 300),
    group(
      [
        path('M262 114C262 76 308 76 308 110', { stroke: 'brand', width: 1.4 }),
        arrowHead([308, 96], [308, 114], 'brand', 7),
      ],
      motion('float', 600),
    ),
    arrow([
      [340, MID],
      [380, MID],
    ]),
    // Punto de control 1: validación automática.
    group(
      [diamond(404, 'paper'), label(404, MID - 36, 'CHECK', { size: 11, tone: 'ink' })],
      motion('rise', 450),
    ),
    arrow([
      [428, MID],
      [466, MID],
    ]),
    // Punto de control 2: aprobación humana antes de lo irreversible (el de mayor riesgo).
    pulse(490, MID, 32, 900),
    group(
      [diamond(490, 'accent'), label(490, MID - 36, 'HITL', { size: 11, tone: 'accent' })],
      motion('rise', 600),
    ),
    arrow([
      [514, MID],
      [554, MID],
    ]),
    group(
      [
        rect(554, MID - 24, 56, 48, { fill: 'paper', r: 4, width: 1.8 }),
        heading(582, MID + 5, 'API', { font: 'mono', size: 13, tracking: 2 }),
        label(582, MID - 36, 'IRREVERSIBLE', { size: 9, tracking: 1.2 }),
      ],
      motion('rise', 750),
    ),
    // Salida de parada: ambos puntos de control pueden detener el caso.
    group(
      [
        arrow(
          [
            [404, MID + 24],
            [404, 226],
          ],
          { dash: '4 4', tone: 'muted' },
        ),
        poly(
          [
            [490, MID + 24],
            [490, 244],
            [450, 244],
          ],
          { dash: '4 4', stroke: 'muted', width: 1.4 },
        ),
        arrowHead([456, 244], [444, 244], 'muted', 7),
        rect(364, 226, 80, 36, { dash: '4 4', fill: 'paper', r: 4, stroke: 'muted', width: 1.4 }),
        label(404, 249, 'STOP', { size: 11, tone: 'ink' }),
      ],
      motion('fade', 900),
    ),
    // Traza: un registro por paso con tiempo y costo.
    group(
      [
        line(135, MID + 32, 135, TRACE_Y - 4, { dash: '2 4', stroke: 'faint', width: 1 }),
        line(285, MID + 32, 285, TRACE_Y - 4, { dash: '2 4', stroke: 'faint', width: 1 }),
        line(404, 262, 404, TRACE_Y - 4, { dash: '2 4', stroke: 'faint', width: 1 }),
        line(582, MID + 24, 582, TRACE_Y - 4, { dash: '2 4', stroke: 'faint', width: 1 }),
        line(40, TRACE_Y, 610, TRACE_Y, { stroke: 'muted', width: 1 }),
        poly(
          [
            [40, TRACE_Y],
            [610, TRACE_Y],
          ],
          { dash: '5 7', motion: TRACE_FLOW, stroke: 'brand', width: 1.6 },
        ),
        ...traceTicks(),
        label(40, TRACE_Y + 24, 'TRACE', { anchor: 'start', size: 10 }),
        label(610, TRACE_Y + 24, 'ms · €', { anchor: 'end', size: 10 }),
      ],
      motion('fade', 1000),
    ),
  );
}
