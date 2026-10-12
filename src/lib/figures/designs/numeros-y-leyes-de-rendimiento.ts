import {
  arrowHead,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  poly,
  pulse,
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

// Plano de la gráfica: utilización ρ de 0 a 1 en horizontal, latencia relativa R/S en vertical.
const left = 90;
const right = 570;
const base = 340;
const unit = 14;

const toPoint = (rho: number): Point => [left + (right - left) * rho, base - unit / (1 - rho)];

const curve: Point[] = Array.from({ length: 96 }, (_, step) => toPoint(step / 100));

const marks = [
  { isHot: false, rho: 0.5, text: '×2' },
  { isHot: true, rho: 0.8, text: '×5' },
  { isHot: false, rho: 0.9, text: '×10' },
] as const;

const ticks = [
  { rho: 0, text: '0' },
  { rho: 0.5, text: '50%' },
  { rho: 0.8, text: '80%' },
  { rho: 0.9, text: '90%' },
  { rho: 1, text: '100%' },
] as const;

export function numerosYLeyesDeRendimiento(): Figure {
  const knee = toPoint(0.8);

  const lastX = curve.at(-1)?.[0] ?? right;

  return figure(
    // Área bajo la curva y ejes del plano.
    group(
      [
        poly([[left, base], ...curve, [lastX, base]], {
          fill: 'brandSoft',
          stroke: undefined,
        }),
        line(left, base, 600, base, { width: 1.6 }),
        arrowHead([left, base], [606, base], 'ink', 8),
        line(left, base, left, 44, { width: 1.6 }),
        arrowHead([left, base], [left, 38], 'ink', 8),
      ],
      motion('rise'),
    ),
    // Asíntota: con el servidor al 100 % la cola no tiene fondo.
    line(right, base, right, 50, { dash: '4 4', stroke: 'muted', width: 1.2 }),
    ticks.map((tick) => {
      const x = left + (right - left) * tick.rho;

      return group(
        [
          line(x, base, x, base + 6, { stroke: 'muted', width: 1 }),
          label(x, base + 24, tick.text, { size: 11 }),
        ],
        motion('fade', 300),
      );
    }),
    label(616, base + 5, 'ρ', { anchor: 'start', size: 14, tone: 'ink' }),
    label(left, 26, 'R / S', { size: 12, tone: 'ink' }),
    // La curva M/M/1: plana al principio, vertical al final.
    poly(curve, { motion: motion('draw', 200), stroke: 'brand', width: 2.2 }),
    pulse(knee[0], knee[1], 18, 1200),
    marks.map((mark, index) => {
      const [x, y] = toPoint(mark.rho);

      return group(
        [
          line(x, base, x, y + 6, { dash: '2 4', stroke: 'muted', width: 1 }),
          node(x, y, mark.isHot ? 7 : 5, mark.isHot, { width: 1.6 }),
          label(x - 14, y - 10, mark.text, {
            anchor: 'end',
            size: 12,
            tone: mark.isHot ? 'accent' : 'ink',
          }),
        ],
        motion('rise', 600 + index * 160),
      );
    }),
    label(knee[0] - 14, knee[1] - 30, 'KNEE', { anchor: 'end', size: 11, tone: 'accent' }),
    // Rótulos del modelo.
    group(
      [
        heading(250, 120, 'R = S / (1 − ρ)', { font: 'mono', size: 15, tracking: 0.5 }),
        label(250, 146, 'M/M/1', { size: 11 }),
      ],
      motion('fade', 900),
    ),
  );
}
