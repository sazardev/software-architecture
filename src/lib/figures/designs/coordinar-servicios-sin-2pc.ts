import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

const STEP_Y = 128;
const COMP_Y = 262;
const STEP_W = 150;
const STEP_H = 60;

const steps = [
  { failed: false, name: 'T1 PEDIDO', x: 60 },
  { failed: false, name: 'T2 PAGO', x: 245 },
  { failed: true, name: 'T3 ENVÍO', x: 430 },
] as const;

const compensations = [
  { name: 'C1 CANCELAR', x: 60 },
  { name: 'C2 REEMBOLSAR', x: 245 },
] as const;

/**
Una saga avanza con transacciones locales. Cuando el paso 3 falla, las compensaciones deshacen
lo confirmado en orden inverso.
*/
export function coordinarServiciosSin2pc(): Figure {
  return figure(
    heading(320, 70, 'Si falla el envío, se compensa lo anterior', { size: 15 }),
    steps.map((step, index) =>
      group(
        [
          rect(step.x, STEP_Y, STEP_W, STEP_H, {
            fill: step.failed ? 'accent' : 'paper',
            r: 8,
            stroke: step.failed ? undefined : 'ink',
            width: 1.5,
          }),
          label(step.x + STEP_W / 2, STEP_Y + 36, step.name, {
            size: 11,
            tone: step.failed ? 'paper' : 'ink',
            tracking: 1.2,
          }),
        ],
        motion('rise', index * 150),
      ),
    ),
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
    compensations.map((comp, index) =>
      group(
        [
          rect(comp.x, COMP_Y, STEP_W, STEP_H, {
            dash: '4 4',
            fill: 'sunken',
            r: 8,
            stroke: 'muted',
            width: 1.4,
          }),
          label(comp.x + STEP_W / 2, COMP_Y + 36, comp.name, {
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
    label(320, 360, 'compensar no es borrar: el reembolso es un evento nuevo', { tone: 'muted' }),
  );
}
