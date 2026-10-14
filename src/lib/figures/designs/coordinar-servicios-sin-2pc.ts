import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const STEP_Y = 128;
const COMP_Y = 262;
const STEP_W = 150;
const STEP_H = 60;
const stepX = [60, 245, 430] as const;
const compX = [60, 245] as const;

const COPY = {
  en: {
    comps: ['C1 CANCEL', 'C2 REFUND'],
    note: 'compensating is not deleting: a refund is a new event',
    steps: ['T1 ORDER', 'T2 PAYMENT', 'T3 SHIPPING'],
    title: 'If shipping fails, earlier steps get compensated',
  },
  es: {
    comps: ['C1 CANCELAR', 'C2 REEMBOLSAR'],
    note: 'compensar no es borrar: el reembolso es un evento nuevo',
    steps: ['T1 PEDIDO', 'T2 PAGO', 'T3 ENVÍO'],
    title: 'Si falla el envío, se compensa lo anterior',
  },
} as const;

/**
Una saga avanza con transacciones locales. Cuando el paso 3 falla, las compensaciones deshacen
lo confirmado en orden inverso.
*/
export function coordinarServiciosSin2pc(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 70, copy.title, { size: 15 }),
    stepX.map((x, index) => {
      const isFailed = index === stepX.length - 1;

      return group(
        [
          rect(x, STEP_Y, STEP_W, STEP_H, {
            fill: isFailed ? 'accent' : 'paper',
            r: 8,
            stroke: isFailed ? undefined : 'ink',
            width: 1.5,
          }),
          label(x + STEP_W / 2, STEP_Y + 36, copy.steps[index] ?? '', {
            size: 11,
            tone: isFailed ? 'paper' : 'ink',
            tracking: 1.2,
          }),
        ],
        motion('rise', index * 150),
      );
    }),
    group(
      [
        arrow(
          [
            [216, STEP_Y + STEP_H / 2],
            [239, STEP_Y + STEP_H / 2],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [401, STEP_Y + STEP_H / 2],
            [424, STEP_Y + STEP_H / 2],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 400),
    ),
    compX.map((x, index) =>
      group(
        [
          rect(x, COMP_Y, STEP_W, STEP_H, {
            dash: '4 4',
            fill: 'sunken',
            r: 8,
            stroke: 'muted',
            width: 1.4,
          }),
          label(x + STEP_W / 2, COMP_Y + 36, copy.comps[index] ?? '', {
            size: 11,
            tone: 'muted',
            tracking: 1.2,
          }),
        ],
        motion('fade', 700 + index * 150),
      ),
    ),
    group(
      [
        arrow(
          [
            [245 + STEP_W / 2, COMP_Y - 6],
            [245 + STEP_W / 2, STEP_Y + STEP_H + 6],
          ],
          { tone: 'accent' },
        ),
        arrow(
          [
            [60 + STEP_W / 2, COMP_Y - 6],
            [60 + STEP_W / 2, STEP_Y + STEP_H + 6],
          ],
          { tone: 'accent' },
        ),
      ],
      motion('fade', 1000),
    ),
    label(320, 360, copy.note, { tone: 'muted' }),
  );
}
