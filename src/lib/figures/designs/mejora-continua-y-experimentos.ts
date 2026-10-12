import {
  arrow,
  arrowHead,
  circle,
  dimension,
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
import type { Figure, Prim } from '../figure-types';

const round = (value: number): number => Math.round(value * 100) / 100;

// Ciclo PDSA en sentido horario: Plan abajo, Do a la izquierda, Study arriba, Act a la derecha.
const center: Point = [190, 190];
const radius = 112;
const nodeRadius = 22;

const phases = [
  { anchor: 'middle', angle: 90, letter: 'P', name: 'PLAN', nameAt: [190, 344] as Point },
  { anchor: 'end', angle: 180, letter: 'D', name: 'DO', nameAt: [44, 230] as Point },
  { anchor: 'middle', angle: 270, letter: 'S', name: 'STUDY', nameAt: [190, 44] as Point },
  { anchor: 'start', angle: 360, letter: 'A', name: 'ACT', nameAt: [336, 230] as Point },
] as const;

function onRing(degrees: number): Point {
  const rad = (degrees * Math.PI) / 180;

  return [round(center[0] + radius * Math.cos(rad)), round(center[1] + radius * Math.sin(rad))];
}

/**
Arco del anillo entre dos fases, con la cabeza de flecha tangente al llegar.
*/
function ringArc(from: number, to: number): Prim[] {
  const gap = ((nodeRadius + 6) / radius) * (180 / Math.PI);
  const start = onRing(from + gap);
  const end = onRing(to - gap);
  const rad = ((to - gap) * Math.PI) / 180;
  const before: Point = [end[0] + 5 * Math.sin(rad), end[1] - 5 * Math.cos(rad)];

  return [
    path(`M${start[0]} ${start[1]}A${radius} ${radius} 0 0 1 ${end[0]} ${end[1]}`, { width: 1.5 }),
    arrowHead(before, end),
  ];
}

// El experimento vive dentro del ciclo: hipótesis, dos variantes y el umbral fijado antes.
function experimentCard(): Prim {
  return group(
    [
      rect(142, 134, 96, 116, { fill: 'paper', r: 5, width: 1.4 }),
      label(190, 156, 'H1', { size: 12, tone: 'ink', tracking: 2 }),
      rect(158, 182, 24, 46, { fill: 'brandSoft', width: 1.2 }),
      rect(198, 168, 24, 60, { fill: 'brand', stroke: 'brand', width: 1.2 }),
      line(152, 176, 228, 176, { dash: '3 3', stroke: 'muted', width: 1.2 }),
      line(152, 228, 228, 228, { width: 1.2 }),
      label(170, 242, 'A', { size: 10 }),
      label(210, 242, 'B', { size: 10 }),
    ],
    motion('rise', 500),
  );
}

const decision: Point = [404, 190];
const next: Point = [548, 190];

export function mejoraContinuaYExperimentos(): Figure {
  return figure(
    label(28, 30, 'PDSA', { anchor: 'start', tone: 'ink', tracking: 3 }),
    group(
      [circle(center[0], center[1], radius, { dash: '2 6', stroke: 'faint', width: 1 })],
      motion('fade', 100),
    ),
    group(
      phases.flatMap((phase) => ringArc(phase.angle, phase.angle + 90)),
      motion('fade', 300),
    ),
    phases.map((phase, index) => {
      const [cx, cy] = onRing(phase.angle);

      return group(
        [
          circle(cx, cy, nodeRadius, { fill: 'paper', width: 1.8 }),
          heading(cx, cy + 7, phase.letter, { size: 20 }),
          label(phase.nameAt[0], phase.nameAt[1], phase.name, {
            anchor: phase.anchor,
            size: 11,
            tone: 'ink',
          }),
        ],
        motion('rise', 200 + index * 140),
      );
    }),
    experimentCard(),
    // De Act sale la decisión: lo único en acento.
    arrow(
      [
        [326, 190],
        [372, 190],
      ],
      { flow: true, width: 2 },
    ),
    group(
      [
        poly(
          [
            [decision[0], decision[1] - 32],
            [decision[0] + 32, decision[1]],
            [decision[0], decision[1] + 32],
            [decision[0] - 32, decision[1]],
          ],
          { fill: 'accent', width: 1.8 },
          true,
        ),
        heading(decision[0], decision[1] + 7, '?', { size: 20 }),
        label(decision[0], 140, 'GO · NO-GO', { size: 10.5, tone: 'ink' }),
      ],
      motion('rise', 900),
    ),
    pulse(decision[0], decision[1], 38, 1200),
    // El siguiente ciclo arranca con la decisión tomada.
    arrow(
      [
        [438, 190],
        [478, 190],
      ],
      { width: 1.6 },
    ),
    group(
      [
        circle(next[0], next[1], 62, { dash: '5 7', stroke: 'muted', width: 1.4 }),
        node(next[0] - 62, next[1], 5),
        node(next[0], next[1] - 62, 5),
        node(next[0] + 62, next[1], 5),
        node(next[0], next[1] + 62, 5),
        heading(next[0], next[1] + 6, 'H2', { size: 18 }),
        label(next[0], 284, 'n+1', { size: 11 }),
      ],
      motion('rise', 1100),
    ),
    dimension([78, 380], [302, 380], '14 d'),
  );
}
