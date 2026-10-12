import {
  arrow,
  circle,
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
import type { Figure, PathPrim } from '../figure-types';

// Eje de evolución de Wardley: cuatro etapas de igual ancho sobre el lienzo.
const AXIS_LEFT = 80;
const AXIS_RIGHT = 608;
const AXIS_Y = 340;
const TOP = 30;
const STAGE_WIDTH = (AXIS_RIGHT - AXIS_LEFT) / 4;
const stages = ['GENESIS', 'CUSTOM', 'PRODUCT', 'COMMODITY'] as const;

const NODE_R = 8;
const anchor: Point = [262, 56];
const agenda: Point = [262, 126];
const ml: Point = [150, 206];
const crm: Point = [420, 200];
const videoFrom: Point = [300, 272];
const videoTo: Point = [544, 272];

function stageX(index: number): number {
  return AXIS_LEFT + STAGE_WIDTH * index;
}

/**
Dependencia de la cadena de valor: une dos nodos sin pisar su contorno.
*/
function link(from: Point, to: Point): PathPrim {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const gap = NODE_R + 3;

  return line(
    from[0] + gap * Math.cos(angle),
    from[1] + gap * Math.sin(angle),
    to[0] - gap * Math.cos(angle),
    to[1] - gap * Math.sin(angle),
    { stroke: 'muted', width: 1.2 },
  );
}

function component(at: Point, name: string, delay: number) {
  return group(
    [
      node(at[0], at[1], NODE_R, false, { width: 1.7 }),
      heading(at[0] + 16, at[1] + 5, name, {
        anchor: 'start',
        font: 'mono',
        size: 13,
        tracking: 1.5,
      }),
    ],
    motion('rise', delay),
  );
}

function band(index: number) {
  return rect(stageX(index), TOP, STAGE_WIDTH, AXIS_Y - TOP, {
    fill: 'brandSoft',
    r: 0,
    stroke: undefined,
  });
}

export function marcosDeDecisionEstrategica(): Figure {
  return figure(
    // Franjas de etapa y ejes del mapa.
    group(
      [
        band(0),
        band(2),
        ...[1, 2, 3].map((index) =>
          line(stageX(index), TOP, stageX(index), AXIS_Y, {
            dash: '2 4',
            stroke: 'muted',
            width: 1,
          }),
        ),
      ],
      motion('fade'),
    ),
    arrow(
      [
        [AXIS_LEFT, AXIS_Y],
        [AXIS_RIGHT + 18, AXIS_Y],
      ],
      { width: 1.6 },
    ),
    arrow(
      [
        [AXIS_LEFT, AXIS_Y],
        [AXIS_LEFT, TOP - 6],
      ],
      { width: 1.6 },
    ),
    stages.map((stage, index) =>
      label(stageX(index) + STAGE_WIDTH / 2, AXIS_Y + 26, stage, { size: 11, tone: 'ink' }),
    ),
    label(AXIS_LEFT - 22, 96, 'VISIBLE', { rotate: -90, size: 10 }),
    label(AXIS_LEFT - 22, 262, 'INVISIBLE', { rotate: -90, size: 10 }),
    // Cadena de valor: del ancla (la necesidad del usuario) hacia abajo.
    group(
      [link(anchor, agenda), link(agenda, ml), link(agenda, crm), link(agenda, videoFrom)],
      motion('fade', 300),
    ),
    group([circle(anchor[0], anchor[1], 6, { fill: 'ink' })], motion('rise', 100)),
    component(agenda, 'Agenda', 400),
    component(ml, 'ML', 550),
    component(crm, 'CRM', 700),
    // Video: construido a medida, hoy disponible como servicio de utilidad.
    group(
      [
        circle(videoFrom[0], videoFrom[1], NODE_R, {
          dash: '3 3',
          fill: 'paper',
          stroke: 'muted',
        }),
        heading(videoFrom[0], videoFrom[1] + 30, 'Video', {
          font: 'mono',
          size: 13,
          tone: 'muted',
          tracking: 1.5,
        }),
      ],
      motion('rise', 850),
    ),
    arrow(
      [
        [videoFrom[0] + 14, videoFrom[1]],
        [videoTo[0] - 14, videoTo[1]],
      ],
      { dash: '4 4', flow: true, width: 1.8 },
    ),
    pulse(videoTo[0], videoTo[1], 20, 1200),
    group(
      [
        node(videoTo[0], videoTo[1], 9, true, { width: 1.8 }),
        heading(videoTo[0], videoTo[1] + 36, 'Video', {
          font: 'mono',
          size: 13,
          tone: 'accent',
          tracking: 1.5,
        }),
      ],
      motion('rise', 1000),
    ),
  );
}
