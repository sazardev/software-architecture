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
} from '../figure-kit';
import type { Figure } from '../figure-types';

// Ejemplo del artículo: valor bruto (R×I×C) frente a puntuación RICE (÷ esfuerzo).
const items = [
  { id: 'A', raw: 600, rice: 1200 },
  { id: 'B', raw: 720, rice: 180 },
  { id: 'C', raw: 1000, rice: 333 },
  { id: 'D', raw: 800, rice: 800 },
  { id: 'E', raw: 1200, rice: 600 },
] as const;

const LEFT_X = 200;
const RIGHT_X = 440;
const TOP_Y = 100;
const STEP = 58;
const BAR_MAX = 100;
const MAX_SCORE = 1200;

const rowY = (rank: number): number => TOP_Y + rank * STEP;
const barLength = (score: number): number => Math.round((score / MAX_SCORE) * BAR_MAX);
const rawRank = (id: string): number =>
  items.toSorted((a, b) => b.raw - a.raw).findIndex((item) => item.id === id);
const riceRank = (id: string): number =>
  items.toSorted((a, b) => b.rice - a.rice).findIndex((item) => item.id === id);

function side(isLeft: boolean, delay: number) {
  const x = isLeft ? LEFT_X : RIGHT_X;

  return group(
    items.flatMap((item) => {
      const score = isLeft ? item.raw : item.rice;
      const y = rowY(isLeft ? rawRank(item.id) : riceRank(item.id));
      const length = barLength(score);
      const isHot = !isLeft && item.id === 'A';
      const barX = isLeft ? x - 24 - length : x + 24;
      const valueX = isLeft ? barX - 6 : barX + length + 6;

      return [
        rect(barX, y - 6, length, 12, {
          fill: isHot ? 'accentSoft' : 'brandSoft',
          r: 2,
          stroke: undefined,
        }),
        circle(x, y, 16, { fill: isHot ? 'accent' : 'paper', width: 1.6 }),
        heading(x, y + 6, item.id, { size: 16 }),
        label(valueX, y + 4, String(score), {
          anchor: isLeft ? 'end' : 'start',
          size: 10.5,
          tone: isHot ? 'ink' : 'muted',
        }),
      ];
    }),
    motion('rise', delay),
  );
}

export function marcosDePriorizacion(): Figure {
  const links = items.filter((item) => item.id !== 'A');
  const hotFrom = rowY(rawRank('A'));
  const hotTo = rowY(riceRank('A'));

  return figure(
    // Cabeceras: valor bruto a la izquierda, puntuación tras dividir por el esfuerzo a la derecha.
    label(LEFT_X, 52, 'R × I × C', { tone: 'ink', tracking: 2 }),
    label(RIGHT_X, 52, 'RICE', { tone: 'ink', tracking: 3 }),
    label(320, 52, '÷ EFFORT', { size: 11 }),
    line(LEFT_X - 120, 68, RIGHT_X + 120, 68, { stroke: 'muted', width: 1 }),
    // Cruces: cada iniciativa cambia de puesto al dividir por el esfuerzo.
    links.map((item, index) =>
      poly(
        [
          [LEFT_X + 18, rowY(rawRank(item.id))],
          [RIGHT_X - 18, rowY(riceRank(item.id))],
        ],
        { dash: '3 3', motion: motion('draw', 400 + index * 90), stroke: 'muted', width: 1.2 },
      ),
    ),
    arrow(
      [
        [LEFT_X + 18, hotFrom],
        [RIGHT_X - 18, hotTo],
      ],
      { flow: true, width: 2 },
    ),
    side(true, 0),
    side(false, 700),
    pulse(RIGHT_X, hotTo, 24, 1200),
    label(RIGHT_X + 24, hotTo - 18, '#1', { anchor: 'start', size: 10.5, tone: 'accent' }),
    label(LEFT_X, hotFrom + 34, 'EFFORT 0.5', { size: 10.5 }),
  );
}
