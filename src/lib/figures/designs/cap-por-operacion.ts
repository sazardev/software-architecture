import { circle, figure, group, heading, label, line, motion, pulse } from '../figure-kit';
import type { Figure } from '../figure-types';

const AXIS_Y = 220;

const operations = [
  { above: true, name: 'SALDO DE CUENTA', strict: true, x: 110 },
  { above: false, name: 'RESERVA DE ASIENTO', strict: true, x: 220 },
  { above: true, name: 'CARRITO', strict: false, x: 360 },
  { above: false, name: 'CONTADOR DE LIKES', strict: false, x: 520 },
] as const;

/**
Cada operación elige su punto en el espectro. CAP obliga a elegir durante una partición; PACELC
recuerda que también hay que elegir sin partición, y eso se decide por operación.
*/
export function capPorOperacion(): Figure {
  return figure(
    heading(320, 70, 'Consistencia o disponibilidad, por operación', { size: 15 }),
    group([line(60, AXIS_Y, 580, AXIS_Y, { stroke: 'ink', width: 2 })], motion('draw')),
    label(60, AXIS_Y + 36, 'CONSISTENCIA', { anchor: 'start', size: 10.5, tone: 'muted' }),
    label(580, AXIS_Y + 36, 'DISPONIBILIDAD', { anchor: 'end', size: 10.5, tone: 'muted' }),
    operations.map((operation, index) => {
      const labelY = operation.above ? AXIS_Y - 40 : AXIS_Y + 66;

      return group(
        [
          circle(operation.x, AXIS_Y, 8, {
            fill: operation.strict ? 'accent' : 'paper',
            width: 1.8,
          }),
          label(operation.x, labelY, operation.name, {
            size: 10.5,
            tone: operation.strict ? 'accent' : 'ink',
          }),
        ],
        motion('rise', 300 + index * 140),
      );
    }),
    pulse(110, AXIS_Y, 16, 1000),
  );
}
