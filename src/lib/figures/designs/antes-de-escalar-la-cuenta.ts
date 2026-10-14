import { arrow, figure, group, heading, label, motion, node, pulse, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

const PIPE_X = 120;
const PIPE_Y = 170;
const PIPE_W = 400;
const PIPE_H = 100;

/**
Little en una imagen: lo que entra por segundo por el tiempo que cada petición permanece dentro
es lo que hay en vuelo. Cada punto del tubo representa diez peticiones.
*/
export function antesDeEscalarLaCuenta(): Figure {
  return figure(
    heading(320, 60, 'Concurrencia = caudal × tiempo', { size: 15 }),
    group(
      [
        rect(PIPE_X, PIPE_Y, PIPE_W, PIPE_H, { fill: 'paper', r: 14, width: 1.6 }),
        label(PIPE_X + PIPE_W / 2, PIPE_Y - 14, 'EN VUELO', { size: 10.5, tracking: 2 }),
      ],
      motion('rise'),
    ),
    Array.from({ length: 10 }, (_, index) =>
      node(PIPE_X + 40 + index * 36, PIPE_Y + PIPE_H / 2, 7, index === 9, {
        width: 1.2,
      }),
    ),
    group(
      [
        arrow(
          [
            [30, PIPE_Y + PIPE_H / 2],
            [PIPE_X - 8, PIPE_Y + PIPE_H / 2],
          ],
          { tone: 'ink' },
        ),
        label(75, PIPE_Y + PIPE_H / 2 - 12, 'λ = 200/s', { size: 11 }),
      ],
      motion('fade', 300),
    ),
    group(
      [
        arrow(
          [
            [PIPE_X + PIPE_W + 8, PIPE_Y + PIPE_H / 2],
            [610, PIPE_Y + PIPE_H / 2],
          ],
          { tone: 'ink' },
        ),
        label(PIPE_X + PIPE_W + 40, PIPE_Y + PIPE_H / 2 - 12, 'W = 0,5 s', {
          size: 11,
        }),
      ],
      motion('fade', 500),
    ),
    pulse(PIPE_X + PIPE_W - 40, PIPE_Y + PIPE_H / 2, 14, 900),
    label(320, 330, 'L = λ × W  →  L = 100 peticiones en vuelo', { size: 12, tone: 'ink' }),
    label(320, 356, 'cada punto del tubo representa diez peticiones', { tone: 'muted' }),
  );
}
