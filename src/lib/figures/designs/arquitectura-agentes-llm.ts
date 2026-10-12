import {
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
import { regularPolygon } from '../figure-shapes';
import type { Figure } from '../figure-types';

const CX = 320;
const CY = 200;
const RING = 120;

const onRing = (degrees: number): Point => [
  CX + RING * Math.cos((degrees * Math.PI) / 180),
  CY + RING * Math.sin((degrees * Math.PI) / 180),
];

const steps = [
  { angle: -90, name: 'PLAN' },
  { angle: 0, name: 'ACT' },
  { angle: 90, name: 'OBSERVE' },
  { angle: 180, name: 'REFLECT' },
] as const;

const satellites = [
  { angle: -135, name: 'TOOLS', x: 88, y: 74 },
  { angle: -45, name: 'MEMORY', x: 552, y: 74 },
  { angle: 135, name: 'EVALS', x: 88, y: 326 },
  { angle: 45, name: 'HUMAN', x: 552, y: 326 },
] as const;

type StepLabel = Readonly<{ anchor: 'end' | 'middle' | 'start'; x: number; y: number }>;

// Rótulo de cada paso: fuera del anillo, según el lado en el que cae.
function stepLabel(angle: number, x: number, y: number): StepLabel {
  if (angle === -90) {
    return { anchor: 'middle', x, y: y - 16 };
  }

  if (angle === 90) {
    return { anchor: 'middle', x, y: y + 24 };
  }

  return angle === 0
    ? { anchor: 'start', x: x + 16, y: y + 4 }
    : { anchor: 'end', x: x - 16, y: y + 4 };
}

export function arquitecturaAgentesLlm(): Figure {
  const core = poly(regularPolygon(CX, CY, 50, 6, -90), { fill: 'accentSoft', width: 1.8 }, true);

  return figure(
    // Anillo del bucle agéntico, recorrido en sentido horario.
    circle(CX, CY, RING, { dash: '3 5', fill: 'sunken', stroke: 'muted', width: 1.2 }),
    path(
      `M${CX - RING} ${CY}A${RING} ${RING} 0 1 1 ${CX + RING} ${CY}A${RING} ${RING} 0 1 1 ${CX - RING} ${CY}`,
      {
        dash: '0.1 11.9',
        motion: motion('flow'),
        stroke: 'accent',
        width: 4.5,
      },
    ),
    // Satélites conectados al anillo.
    satellites.map((satellite, index) => {
      const ring = onRing(satellite.angle);
      const toX = satellite.x + (satellite.x < CX ? 50 : -50);

      return group(
        [
          line(toX, satellite.y + (satellite.y < CY ? 17 : -17), ring[0], ring[1], {
            dash: '3 4',
            stroke: 'muted',
            width: 1.2,
          }),
          node(ring[0], ring[1], 4.5),
          rect(satellite.x - 50, satellite.y - 17, 100, 34, { fill: 'paper', r: 17, width: 1.6 }),
          label(satellite.x, satellite.y + 4, satellite.name, { size: 11.5, tone: 'ink' }),
        ],
        motion('fade', 400 + index * 140),
      );
    }),
    // Núcleo: el modelo.
    pulse(CX, CY, 56, 900),
    group(
      [core, heading(CX, CY + 8, 'LLM', { font: 'mono', size: 21, tracking: 2 })],
      motion('rise'),
    ),
    // Pasos del bucle.
    steps.map((step, index) => {
      const [x, y] = onRing(step.angle);
      const text = stepLabel(step.angle, x, y);

      return group(
        [
          circle(x, y, 8, { fill: 'paper', width: 1.7 }),
          label(text.x, text.y, step.name, { anchor: text.anchor, size: 11.5, tone: 'ink' }),
        ],
        motion('fade', 700 + index * 140),
      );
    }),
  );
}
