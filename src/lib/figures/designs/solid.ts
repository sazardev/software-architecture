import {
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  path,
  poly,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const columns = [
  { code: 'SRP', letter: 'S', x: 120 },
  { code: 'OCP', letter: 'O', x: 220 },
  { code: 'LSP', letter: 'L', x: 320 },
  { code: 'ISP', letter: 'I', x: 420 },
  { code: 'DIP', letter: 'D', x: 520 },
] as const;

const GROUND = 330;

// Tramado del terreno bajo la línea de suelo, como en los cortes de un plano.
const hatch = Array.from({ length: 29 }, (_, index) => {
  const x = 40 + index * 20;

  return `M${x} ${GROUND}l-12 14`;
}).join('');

export function solid(): Figure {
  return figure(
    path(hatch, { stroke: 'faint', width: 1 }),
    line(30, GROUND, 610, GROUND, { width: 1.8 }),
    // Frontón y viga: el diseño que sostienen los cinco principios.
    group(
      [
        poly(
          [
            [78, 112],
            [320, 44],
            [562, 112],
          ],
          { fill: 'accentSoft', width: 1.6 },
          true,
        ),
        rect(70, 112, 500, 34, { fill: 'sunken', r: 2, width: 1.6 }),
        label(320, 134, 'DESIGN', { size: 11, tone: 'ink', tracking: 4 }),
        circle(320, 86, 7, { fill: 'accent', width: 1.5 }),
      ],
      motion('fade', 700),
    ),
    columns.map((column, index) =>
      group(
        [
          rect(column.x - 36, 146, 72, 12, { fill: 'paper', r: 2 }),
          rect(column.x - 28, 158, 56, 160, { fill: 'brandSoft', r: 2 }),
          line(column.x - 10, 168, column.x - 10, 308, { stroke: 'brandMid', width: 1.2 }),
          line(column.x + 10, 168, column.x + 10, 308, { stroke: 'brandMid', width: 1.2 }),
          rect(column.x - 36, 318, 72, 12, { fill: 'paper', r: 2 }),
          circle(column.x, 232, 19, { fill: 'paper', width: 1.6 }),
          heading(column.x, 240, column.letter, { size: 22 }),
          label(column.x, 362, column.code, { tone: 'ink', tracking: 2 }),
        ],
        motion('rise', 100 + index * 110),
      ),
    ),
  );
}
