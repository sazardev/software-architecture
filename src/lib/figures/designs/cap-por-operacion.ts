import { circle, figure, group, heading, label, line, motion, pulse } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const AXIS_Y = 220;

const operations = [
  { above: true, strict: true, x: 110 },
  { above: false, strict: true, x: 220 },
  { above: true, strict: false, x: 360 },
  { above: false, strict: false, x: 520 },
] as const;

const COPY = {
  en: {
    availability: 'AVAILABILITY',
    consistency: 'CONSISTENCY',
    names: ['ACCOUNT BALANCE', 'SEAT RESERVATION', 'CART', 'LIKE COUNTER'],
    title: 'Consistency or availability, per operation',
  },
  es: {
    availability: 'DISPONIBILIDAD',
    consistency: 'CONSISTENCIA',
    names: ['SALDO DE CUENTA', 'RESERVA DE ASIENTO', 'CARRITO', 'CONTADOR DE LIKES'],
    title: 'Consistencia o disponibilidad, por operación',
  },
} as const;

/**
Cada operación elige su punto en el espectro. CAP obliga a elegir durante una partición; PACELC
recuerda que también hay que elegir sin partición, y eso se decide por operación.
*/
export function capPorOperacion(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 70, copy.title, { size: 15 }),
    group([line(60, AXIS_Y, 580, AXIS_Y, { stroke: 'ink', width: 2 })], motion('draw')),
    label(60, AXIS_Y + 36, copy.consistency, { anchor: 'start', size: 10.5, tone: 'muted' }),
    label(580, AXIS_Y + 36, copy.availability, { anchor: 'end', size: 10.5, tone: 'muted' }),
    operations.map((operation, index) => {
      const labelY = operation.above ? AXIS_Y - 40 : AXIS_Y + 66;

      return group(
        [
          circle(operation.x, AXIS_Y, 8, {
            fill: operation.strict ? 'accent' : 'paper',
            width: 1.8,
          }),
          label(operation.x, labelY, copy.names[index] ?? '', {
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
