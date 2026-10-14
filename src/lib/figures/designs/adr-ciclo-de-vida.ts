import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const W = 150;
const H = 44;

const states = [
  { accent: false, x: 40, y: 178 },
  { accent: true, x: 250, y: 178 },
  { accent: false, x: 460, y: 110 },
  { accent: false, x: 460, y: 246 },
  { accent: false, x: 250, y: 310 },
] as const;

const COPY = {
  en: {
    discarded: 'discarded',
    names: ['PROPOSED', 'ACCEPTED', 'DEPRECATED', 'SUPERSEDED', 'REJECTED'],
    title: 'An ADR changes state, it is never deleted',
  },
  es: {
    discarded: 'se descarta',
    names: ['PROPUESTO', 'ACEPTADO', 'OBSOLETO', 'REEMPLAZADO', 'RECHAZADO'],
    title: 'Un ADR cambia de estado, no desaparece',
  },
} as const;

/**
Un ADR no se borra cuando deja de aplicar. Pasa a obsoleto o lo reemplaza otro, y el registro
conserva lo que se pensó en cada momento.
*/
export function adrCicloDeVida(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    states.map((state, index) =>
      group(
        [
          rect(state.x, state.y, W, H, {
            fill: state.accent ? 'accent' : 'paper',
            r: 6,
            stroke: state.accent ? undefined : 'ink',
            width: 1.5,
          }),
          label(state.x + W / 2, state.y + 27, copy.names[index] ?? '', {
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
    label(115, 358, copy.discarded, { anchor: 'start', size: 10, tone: 'muted' }),
  );
}
