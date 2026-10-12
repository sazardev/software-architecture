import {
  arrowHead,
  dimension,
  figure,
  group,
  label,
  line,
  motion,
  node,
  poly,
  pulse,
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

// Plano de la gráfica: volumen mensual q (0 a 1,5 M) en horizontal, costo mensual (0 a 4.000) en vertical.
// Mismos supuestos que el ejemplo trabajado: A = 2,5·q y B = 1.500 + 0,5·q (q en miles).
const left = 80;
const right = 580;
const base = 340;
const maxVolume = 1500;
const costScale = 0.075;

const toPoint = (volume: number, cost: number): Point => [
  left + ((right - left) * volume) / maxVolume,
  base - cost * costScale,
];

const variableCost = (volume: number): number => 2.5 * volume;
const fixedCost = (volume: number): number => 1500 + 0.5 * volume;

const origin = toPoint(0, 0);
const fixedStart = toPoint(0, fixedCost(0));
const crossing = toPoint(750, variableCost(750));
const variableEnd = toPoint(maxVolume, variableCost(maxVolume));
const fixedEnd = toPoint(maxVolume, fixedCost(maxVolume));

export function finopsCostoComoAtributo(): Figure {
  return figure(
    // Zonas entre las dos rectas: a la izquierda gana el pago por uso, a la derecha el costo fijo.
    group(
      [
        poly([origin, fixedStart, crossing], { fill: 'brandSoft', stroke: undefined }, true),
        poly([crossing, fixedEnd, variableEnd], { fill: 'sunken', stroke: undefined }, true),
      ],
      motion('rise'),
    ),
    // Ejes del plano.
    group(
      [
        line(left, base, 606, base, { width: 1.6 }),
        arrowHead([left, base], [612, base], 'ink', 8),
        line(left, base, left, 40, { width: 1.6 }),
        arrowHead([left, base], [left, 34], 'ink', 8),
      ],
      motion('fade', 100),
    ),
    label(624, base + 5, 'q', { anchor: 'middle', size: 14, tone: 'ink' }),
    label(left, 22, '€', { size: 14, tone: 'ink' }),
    label(left - 10, base + 20, '0', { anchor: 'end', size: 11 }),
    // B: costo fijo F más un costo marginal pequeño.
    poly([fixedStart, fixedEnd], { motion: motion('draw', 300), stroke: 'ink', width: 2.2 }),
    label(right - 4, fixedEnd[1] + 26, 'B  F + v·q', { anchor: 'end', size: 12, tone: 'ink' }),
    // A: pago por uso, desde cero y con más pendiente.
    poly([origin, variableEnd], { motion: motion('draw', 500), stroke: 'brand', width: 2.2 }),
    label(variableEnd[0] - 48, variableEnd[1] + 4, 'A  p·q', {
      anchor: 'end',
      size: 12,
      tone: 'ink',
    }),
    dimension([left - 26, base], [left - 26, fixedStart[1]], 'F', { offset: 14 }),
    // El punto de cruce: donde cambia la conveniencia.
    line(crossing[0], crossing[1], crossing[0], base, {
      dash: '4 4',
      motion: motion('fade', 1000),
      stroke: 'muted',
      width: 1.2,
    }),
    pulse(crossing[0], crossing[1], 18, 1200),
    node(crossing[0], crossing[1], 6, true, { motion: motion('fade', 1100) }),
    group(
      [
        label(crossing[0], base + 22, 'q*', { size: 13, tone: 'accent' }),
        label(crossing[0], base + 40, '750k', { size: 10 }),
        label(crossing[0] - 14, crossing[1] - 16, 'A = B', { anchor: 'end', size: 11 }),
      ],
      motion('rise', 1300),
    ),
  );
}
