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

// Ejes del plano: tiempo de uso en horizontal, costo en vertical.
const origin: Point = [76, 336];
const xEnd = 604;
const yEnd = 46;

// Costo de salida: crece con el tiempo de uso y se acelera (datos, integraciones, hábitos).
const start: Point = [86, 318];
const end: Point = [580, 70];
const steepness = (start[1] - end[1]) / (end[0] - start[0]) ** 2;
const exitCostAt = (x: number): number => start[1] - steepness * (x - start[0]) ** 2;

// Costo de quedarse: lo que pagas o dejas de ganar por seguir con el proveedor actual.
const stayY = 196;
const crossX = start[0] + Math.sqrt((start[1] - stayY) / steepness);
const cross: Point = [crossX, stayY];

const samples = 24;
const curve: Point[] = Array.from({ length: samples + 1 }, (_, index) => {
  const x = start[0] + ((end[0] - start[0]) * index) / samples;

  return [x, exitCostAt(x)];
});

const ticks = [160, 250, 340, 520];

export function casadoAUnProveedor(): Figure {
  return figure(
    // Área bajo la curva: lo que costaría salir en cada momento.
    group(
      [
        poly(
          [...curve, [end[0], origin[1]], [start[0], origin[1]]],
          {
            fill: 'brandSoft',
            opacity: 0.55,
            stroke: undefined,
          },
          true,
        ),
      ],
      motion('rise', 200),
    ),
    // Ejes.
    group(
      [
        line(origin[0], origin[1], xEnd, origin[1], { width: 1.4 }),
        arrowHead([xEnd - 10, origin[1]], [xEnd + 6, origin[1]], 'ink', 9),
        line(origin[0], origin[1], origin[0], yEnd, { width: 1.4 }),
        arrowHead([origin[0], yEnd + 10], [origin[0], yEnd - 6], 'ink', 9),
        ...ticks.map((x) =>
          line(x, origin[1] - 4, x, origin[1] + 4, { stroke: 'muted', width: 1 }),
        ),
      ],
      motion('fade'),
    ),
    label(xEnd + 2, origin[1] + 26, 't', { anchor: 'end', size: 13, tone: 'ink' }),
    label(origin[0] - 14, yEnd + 4, '$', { size: 13, tone: 'ink' }),
    // Quedarse: línea de referencia.
    group(
      [
        line(origin[0] + 6, stayY, xEnd - 8, stayY, { dash: '6 6', stroke: 'muted', width: 1.4 }),
        label(xEnd - 8, stayY + 22, 'STATUS QUO', { anchor: 'end', size: 11, tone: 'ink' }),
      ],
      motion('fade', 500),
    ),
    // Salir: la curva que crece con el uso.
    poly(curve, { motion: motion('draw', 300), stroke: 'brand', width: 2.4 }),
    label(end[0] - 12, end[1] - 14, 'LOCK-IN', { anchor: 'end', size: 11.5, tone: 'brand' }),
    node(start[0], start[1], 4.5),
    // El punto en que salir cuesta más que quedarse.
    line(crossX, stayY + 10, crossX, origin[1] - 6, { dash: '3 5', stroke: 'muted', width: 1.2 }),
    pulse(crossX, stayY, 18, 1200),
    node(cross[0], cross[1], 7, true, { width: 1.8 }),
    label(crossX, origin[1] + 26, 't*', { size: 13, tone: 'accent' }),
    // Pasado t*, la brecha crece: cota entre quedarse y salir al final del horizonte.
    group(
      [
        ...dimension([end[0] + 26, end[1]], [end[0] + 26, stayY]).items,
        label(end[0] + 44, (end[1] + stayY) / 2 + 5, 'Δ', { size: 14, tone: 'ink', tracking: 0 }),
      ],
      motion('fade', 900),
    ),
  );
}
