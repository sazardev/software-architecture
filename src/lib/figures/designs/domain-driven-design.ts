import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  motion,
  rect,
  type Point,
} from '../figure-kit';
import { blob } from '../figure-shapes';
import type { Figure, Paint } from '../figure-types';

type Context = Readonly<{
  cx: number;
  cy: number;
  fill: Paint['fill'];
  name: string;
  phase: number;
  r: number;
}>;

const contexts: readonly Context[] = [
  { cx: 320, cy: 218, fill: 'accentSoft', name: 'SALES', phase: 0.4, r: 72 },
  { cx: 112, cy: 218, fill: 'brandSoft', name: 'BILLING', phase: 1.3, r: 60 },
  { cx: 528, cy: 218, fill: 'brandSoft', name: 'SHIPPING', phase: 2.1, r: 60 },
  { cx: 320, cy: 52, fill: 'sunken', name: 'CATALOG', phase: 0.9, r: 40 },
  { cx: 320, cy: 354, fill: 'paper', name: 'LEGACY', phase: 1.8, r: 36 },
];

function contextShape(context: Context, index: number) {
  return group(
    [
      blob(context.cx, context.cy, context.r, context.phase, {
        dash: context.name === 'LEGACY' ? '5 4' : undefined,
        fill: context.fill,
        stroke: 'ink',
        width: 1.6,
      }),
      heading(context.cx, context.cy + 4, context.name, {
        font: 'mono',
        size: context.r > 50 ? 12.5 : 11,
        tracking: 1.6,
      }),
    ],
    motion('rise', index * 140),
  );
}

// Insignia "U" (upstream) o "D" (downstream) en el extremo de una relación.
function badge(at: Point, letter: string) {
  return group([
    circle(at[0], at[1], 9, { fill: 'paper', width: 1.4 }),
    label(at[0], at[1] + 3.5, letter, { size: 9.5, tone: 'ink', tracking: 0 }),
  ]);
}

export function domainDrivenDesign(): Figure {
  return figure(
    contexts.map((context, index) => contextShape(context, index)),
    group(
      [
        // Catálogo (upstream) → Ventas (downstream).
        arrow(
          [
            [320, 100],
            [320, 146],
          ],
          { flow: true, tone: 'accent', width: 1.8 },
        ),
        badge([320, 106], 'U'),
        badge([320, 138], 'D'),
        // Ventas → Envíos.
        arrow(
          [
            [394, 218],
            [466, 218],
          ],
          { flow: true, tone: 'accent', width: 1.8 },
        ),
        badge([404, 218], 'U'),
        badge([456, 218], 'D'),
        // Facturación se protege con una capa anticorrupción.
        arrow(
          [
            [172, 218],
            [246, 218],
          ],
          { tone: 'ink' },
        ),
        rect(190, 206, 36, 24, { fill: 'paper', r: 3, width: 1.5 }),
        label(208, 222, 'ACL', { size: 9.5, tone: 'ink', tracking: 0.5 }),
        // El legado se traduce antes de entrar.
        arrow(
          [
            [320, 318],
            [320, 292],
          ],
          { dash: '4 4', tone: 'ink' },
        ),
        rect(302, 296, 36, 20, { fill: 'paper', r: 3, width: 1.5 }),
        label(320, 310, 'ACL', { size: 9.5, tone: 'ink', tracking: 0.5 }),
      ],
      motion('fade', 700),
    ),
    label(320, 244, 'CORE', { size: 10, tone: 'accent' }),
    label(40, 44, 'CONTEXT MAP', { anchor: 'start' }),
  );
}
