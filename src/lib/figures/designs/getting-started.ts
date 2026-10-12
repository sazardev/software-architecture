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
  type Point,
} from '../figure-kit';
import { blob, smoothPath } from '../figure-shapes';
import type { Figure } from '../figure-types';

const route: readonly Point[] = [
  [64, 336],
  [150, 322],
  [214, 282],
  [262, 236],
  [336, 226],
  [392, 190],
  [420, 140],
  [468, 104],
];

const stops: readonly (readonly [Point, string])[] = [
  [[214, 282], '01'],
  [[336, 226], '02'],
  [[420, 140], '03'],
];

// Relleno de cada curva de nivel, de la más baja a la cima.
const contourFill = [undefined, 'sunken', undefined, 'brandSoft', undefined] as const;

export function gettingStarted(): Figure {
  return figure(
    // Curvas de nivel alrededor de la cima.
    [134, 110, 86, 62, 38].map((radius, index) =>
      group(
        [
          {
            ...blob(458, 132, radius, 0.6),
            fill: contourFill[index],
          },
        ],
        motion('fade', index * 120),
      ),
    ),
    // Sendero: puntos que avanzan hacia la cima.
    path(smoothPath(route), { dash: '0.1 9', stroke: 'ink', width: 3.2 }),
    path(smoothPath(route), {
      dash: '0.1 11.9',
      motion: motion('flow'),
      stroke: 'accent',
      width: 5,
    }),
    // Salida.
    circle(64, 336, 7, { fill: 'paper', width: 1.8 }),
    label(64, 362, 'START'),
    // Hitos numerados.
    stops.map(([[x, y], text], index) =>
      group(
        [
          circle(x, y, 13, { fill: 'paper', width: 1.7 }),
          heading(x, y + 4, text, { font: 'mono', size: 11.5, tracking: 0.5 }),
        ],
        motion('rise', 400 + index * 160),
      ),
    ),
    // Bandera en la cima.
    group(
      [
        pulse(468, 104, 16, 800),
        line(468, 104, 468, 54, { width: 1.8 }),
        poly(
          [
            [468, 54],
            [506, 66],
            [468, 80],
          ],
          { fill: 'accent', width: 1.5 },
          true,
        ),
        node(468, 104, 5, false),
      ],
      motion('rise', 900),
    ),
    label(486, 126, 'GOAL', { anchor: 'start' }),
    // Brújula.
    group(
      [
        circle(574, 330, 26, { stroke: 'faint', width: 1.2 }),
        circle(574, 330, 3, { fill: 'ink', width: 1 }),
        poly(
          [
            [574, 306],
            [580, 330],
            [568, 330],
          ],
          { fill: 'accent', stroke: 'accent', width: 1 },
          true,
        ),
        poly(
          [
            [574, 354],
            [580, 330],
            [568, 330],
          ],
          { fill: 'paper', width: 1.2 },
          true,
        ),
        label(574, 296, 'N', { size: 11 }),
      ],
      motion('fade', 1000),
    ),
  );
}
