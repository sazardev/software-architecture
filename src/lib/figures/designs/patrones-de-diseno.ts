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
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const families = [
  { isHot: false, name: 'CREATIONAL' },
  { isHot: false, name: 'STRUCTURAL' },
  { isHot: true, name: 'BEHAVIORAL' },
] as const;

const concretes = [
  { name: 'STRATEGY A', x: 116 },
  { name: 'STRATEGY B', x: 272 },
  { name: 'STRATEGY C', x: 428 },
] as const;

const INTERFACE_X = 336;

function umlBox(
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  isHot = false,
  stereotype?: string,
) {
  return group([
    rect(x, y, w, h, {
      dash: stereotype === undefined ? undefined : '5 4',
      fill: isHot ? 'accentSoft' : 'paper',
      r: 4,
      width: 1.6,
    }),
    ...(stereotype === undefined ? [] : [label(x + w / 2, y + 17, stereotype, { size: 10 })]),
    heading(x + w / 2, y + (stereotype === undefined ? 24 : 36), title, {
      font: 'mono',
      size: 12,
      tracking: 1.4,
    }),
    line(x + 10, y + h - 20, x + w - 10, y + h - 20, { stroke: 'faint', width: 1 }),
    line(x + 14, y + h - 10, x + w * 0.6, y + h - 10, { stroke: 'faint', width: 3 }),
  ]);
}

export function patronesDeDiseno(): Figure {
  const triangle: readonly Point[] = [
    [INTERFACE_X, 148],
    [INTERFACE_X - 9, 166],
    [INTERFACE_X + 9, 166],
  ];

  return figure(
    // Familias del catálogo GoF.
    families.map((family, index) =>
      group(
        [
          rect(456, 36 + index * 30, 154, 22, {
            fill: family.isHot ? 'accentSoft' : 'paper',
            r: 11,
            stroke: family.isHot ? 'accent' : 'faint',
            width: 1.4,
          }),
          label(533, 51 + index * 30, family.name, {
            size: 10.5,
            tone: family.isHot ? 'accent' : 'muted',
          }),
        ],
        motion('fade', 200 + index * 100),
      ),
    ),
    // Strategy: contexto → interfaz ◁-- implementaciones.
    group(
      [
        line(176, 112, 252, 112, { width: 1.6 }),
        poly(
          [
            [176, 112],
            [185, 105],
            [194, 112],
            [185, 119],
          ],
          { fill: 'ink', width: 1.2 },
          true,
        ),
        label(222, 102, 'HAS-A', { size: 10 }),
        path(
          `M${INTERFACE_X} 166V196M${concretes[0].x + 64} 196H${concretes[2].x + 64}M${concretes[0].x + 64} 196V242M${concretes[1].x + 64} 196V242M${concretes[2].x + 64} 196V242`,
          { dash: '4 4', width: 1.4 },
        ),
        poly(triangle, { fill: 'paper', width: 1.5 }, true),
      ],
      motion('fade', 600),
    ),
    group([umlBox(48, 84, 128, 56, 'CONTEXT')], motion('rise')),
    group([umlBox(252, 82, 168, 66, 'STRATEGY', false, '«interface»')], motion('rise', 150)),
    concretes.map((concrete, index) =>
      group(
        [umlBox(concrete.x, 242, 128, 62, concrete.name, index === 1)],
        motion('rise', 350 + index * 140),
      ),
    ),
    circle(concretes[1].x + 64, 242, 4.5, { fill: 'accent', width: 1.4 }),
    label(40, 360, 'ONE INTERFACE · MANY BEHAVIORS', { anchor: 'start' }),
  );
}
