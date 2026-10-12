import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  poly,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const top: Point = [196, 84];
const left: Point = [66, 298];
const right: Point = [326, 298];

const vertices = [
  { at: top, isHot: false, letter: 'C', name: 'CONSISTENCY', labelAt: [196, 40] as Point },
  { at: left, isHot: false, letter: 'A', name: 'AVAILABILITY', labelAt: [66, 350] as Point },
  { at: right, isHot: true, letter: 'P', name: 'PARTITION', labelAt: [326, 350] as Point },
] as const;

function panel(y: number, title: string, choice: string, delay: number) {
  return group(
    [
      rect(396, y, 214, 66, { fill: 'paper', r: 5, width: 1.6 }),
      heading(503, y + 28, title, { font: 'mono', size: 12, tracking: 2 }),
      label(503, y + 49, choice, { size: 11.5, tone: 'accent' }),
    ],
    motion('rise', delay),
  );
}

export function capPacelc(): Figure {
  return figure(
    // Triángulo CAP: dos de tres, pero la partición no es opcional.
    group(
      [
        poly([top, left, right], { fill: 'brandSoft', stroke: undefined }, true),
        poly([left, right, top], { width: 1.6 }),
        line(top[0], top[1], left[0], left[1], { dash: '5 5', stroke: 'muted', width: 1.4 }),
      ],
      motion('rise'),
    ),
    label(116, 176, 'CA', { anchor: 'end' }),
    label(276, 176, 'CP', { anchor: 'start', tone: 'ink' }),
    label(196, 322, 'AP', { tone: 'ink' }),
    vertices.map((vertex, index) =>
      group(
        [
          circle(vertex.at[0], vertex.at[1], 22, {
            fill: vertex.isHot ? 'accent' : 'paper',
            width: 1.8,
          }),
          heading(vertex.at[0], vertex.at[1] + 7, vertex.letter, { size: 21 }),
          label(vertex.labelAt[0], vertex.labelAt[1], vertex.name, { size: 11, tone: 'ink' }),
        ],
        motion('fade', 300 + index * 140),
      ),
    ),
    pulse(right[0], right[1], 24, 900),
    // PACELC: lo que pasa con y sin partición.
    panel(88, 'PARTITION', 'A  vs  C', 600),
    panel(226, 'ELSE', 'LATENCY  vs  C', 800),
    arrow(
      [
        [503, 154],
        [503, 224],
      ],
      { flow: true, width: 2 },
    ),
    line(272, 190, 394, 124, { dash: '2 4', stroke: 'accent', width: 1.4 }),
    label(503, 70, 'PACELC', { tone: 'ink', tracking: 3 }),
  );
}
