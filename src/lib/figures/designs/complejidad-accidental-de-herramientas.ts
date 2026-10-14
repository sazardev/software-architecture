import { figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BAR_X = 60;
const BAR_Y = 150;
const BAR_W = 520;
const BAR_H = 90;
const ESSENTIAL_W = 200;

const COPY = {
  en: {
    accidental: 'ACCIDENTAL',
    actions: ['ELIMINATE', 'HIDE', 'BUY', 'DEFER'],
    essential: 'ESSENTIAL',
    note: 'four questions before adding one more piece',
    stack: 'THE COST OF YOUR STACK',
    title: 'Essential stays; accidental shrinks',
  },
  es: {
    accidental: 'ACCIDENTAL',
    actions: ['ELIMINAR', 'OCULTAR', 'COMPRAR', 'POSPONER'],
    essential: 'ESENCIAL',
    note: 'cuatro preguntas antes de añadir una pieza más',
    stack: 'EL COSTO DE TU STACK',
    title: 'Lo esencial no se toca; lo accidental se reduce',
  },
} as const;

/**
La complejidad del problema (esencial) es lo que el usuario necesita. Lo que añaden tus
herramientas (accidental) es lo que conviene atacar, con cuatro acciones posibles.
*/
export function complejidadAccidentalDeHerramientas(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 70, copy.title, { size: 15 }),
    group(
      [
        rect(BAR_X, BAR_Y, ESSENTIAL_W, BAR_H, { fill: 'paper', r: 8, width: 1.6 }),
        label(BAR_X + ESSENTIAL_W / 2, BAR_Y + 46, copy.essential, { size: 11, tracking: 1.6 }),
      ],
      motion('rise'),
    ),
    group(
      [
        rect(BAR_X + ESSENTIAL_W, BAR_Y, BAR_W - ESSENTIAL_W, BAR_H, {
          fill: 'accentSoft',
          r: 8,
          stroke: 'accent',
          width: 1.6,
        }),
        label(BAR_X + ESSENTIAL_W + (BAR_W - ESSENTIAL_W) / 2, BAR_Y + 46, copy.accidental, {
          size: 11,
          tone: 'accent',
          tracking: 1.6,
        }),
      ],
      motion('rise', 250),
    ),
    label(320, BAR_Y - 14, copy.stack, { size: 10, tone: 'muted', tracking: 2 }),
    copy.actions.map((action, index) => {
      const x = 60 + index * 136;

      return group(
        [
          rect(x, 290, 120, 40, { fill: 'paper', r: 6, width: 1.4 }),
          label(x + 60, 315, action, { size: 10.5, tracking: 1.4 }),
        ],
        motion('rise', 500 + index * 120),
      );
    }),
    label(320, 362, copy.note, { tone: 'muted' }),
  );
}
