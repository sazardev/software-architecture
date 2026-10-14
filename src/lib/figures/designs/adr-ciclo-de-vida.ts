import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

const W = 150;
const H = 44;

const states = [
  { accent: false, name: 'PROPUESTO', x: 40, y: 178 },
  { accent: true, name: 'ACEPTADO', x: 250, y: 178 },
  { accent: false, name: 'OBSOLETO', x: 460, y: 110 },
  { accent: false, name: 'REEMPLAZADO', x: 460, y: 246 },
  { accent: false, name: 'RECHAZADO', x: 250, y: 310 },
] as const;

/**
Un ADR no se borra cuando deja de aplicar. Pasa a obsoleto o lo reemplaza otro, y el registro
conserva lo que se pensó en cada momento.
*/
export function adrCicloDeVida(): Figure {
  return figure(
    heading(320, 60, 'Un ADR cambia de estado, no desaparece', { size: 15 }),
    states.map((state, index) =>
      group(
        [
          rect(state.x, state.y, W, H, {
            fill: state.accent ? 'accent' : 'paper',
            r: 6,
            stroke: state.accent ? undefined : 'ink',
            width: 1.5,
          }),
          label(state.x + W / 2, state.y + 27, state.name, {
            size: 10.5,
            tone: state.accent ? 'paper' : 'ink',
            tracking: 1.2,
          }),
        ],
        motion('rise', index * 120),
      ),
    ),
    group(
      [
        arrow(
          [
            [190, 200],
            [246, 200],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [115, 222],
            [115, 332],
            [246, 332],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [400, 190],
            [456, 132],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [400, 214],
            [456, 268],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 600),
    ),
    label(115, 358, 'se descarta', { anchor: 'start', size: 10, tone: 'muted' }),
  );
}
