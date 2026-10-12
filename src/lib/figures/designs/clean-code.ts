import { figure, group, label, line, motion, path, rect, type Point } from '../figure-kit';
import type { Figure, Tone } from '../figure-types';

const GATE_X = 300;
const START_X = 44;
const END_X = 356;

// Alturas de salida de los hilos (ordenadas) y de entrada (enredadas).
const rows = [104, 136, 168, 200, 232, 264, 296] as const;
const tangled = [236, 112, 288, 150, 262, 100, 190] as const;
const indent = [0, 0, 24, 24, 48, 24, 0] as const;
const lengths = [150, 120, 96, 132, 84, 108, 70] as const;
const tones: readonly Tone[] = ['brand', 'ink', 'ink', 'brand', 'ink', 'ink', 'accent'];

function strand(index: number): string {
  const from: Point = [START_X, tangled[index] ?? 0];
  const to: Point = [GATE_X, rows[index] ?? 0];
  const swing = index % 2 === 0 ? 96 : -96;

  return `M${from[0]} ${from[1]}C${from[0] + 120} ${from[1] + swing} ${to[0] - 120} ${to[1] - swing} ${to[0]} ${to[1]}`;
}

export function cleanCode(): Figure {
  return figure(
    // Hilos enredados que entran por la izquierda.
    rows.map((_, index) =>
      group(
        [
          path(strand(index), {
            stroke: index === 6 ? 'accent' : 'muted',
            width: index === 6 ? 2 : 1.5,
          }),
        ],
        motion('fade', index * 90),
      ),
    ),
    // Puerta de refactorización.
    group(
      [
        rect(GATE_X - 12, 72, 24, 252, {
          dash: '4 4',
          fill: 'sunken',
          r: 4,
          stroke: 'muted',
          width: 1.2,
        }),
        line(GATE_X, 72, GATE_X, 324, { stroke: 'faint', width: 1 }),
        label(GATE_X, 52, 'REFACTOR', { tone: 'accent', tracking: 3 }),
      ],
      motion('rise', 400),
    ),
    // Código ordenado: sangría coherente, nombres claros.
    rows.map((y, index) => {
      const x = END_X + (indent[index] ?? 0);

      return group(
        [
          line(GATE_X + 12, y, END_X - 10, y, { stroke: 'muted', width: 1.5 }),
          label(END_X - 4, y + 4, String(index + 1), { anchor: 'end', size: 10, tone: 'faint' }),
          line(x + 8, y, x + 8 + (lengths[index] ?? 80), y, {
            stroke: tones[index] ?? 'ink',
            width: 5,
          }),
          line(x + 16 + (lengths[index] ?? 80), y, x + 16 + (lengths[index] ?? 80) + 40, y, {
            stroke: 'faint',
            width: 5,
          }),
        ],
        motion('rise', 600 + index * 90),
      );
    }),
    // Margen de lectura: el punto de referencia del código limpio.
    line(END_X + 2, 84, END_X + 2, 316, { dash: '2 4', stroke: 'brand', width: 1 }),
    label(END_X + 140, 344, 'READABLE · SMALL · CLEAR', { size: 11 }),
  );
}
