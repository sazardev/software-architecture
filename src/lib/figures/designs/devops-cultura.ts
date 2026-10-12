import { dimension, figure, group, heading, label, motion, node, path, pulse } from '../figure-kit';
import type { Point } from '../figure-kit';
import type { Figure } from '../figure-types';

const CX = 320;
const CY = 196;
const A = 214;

// Lemniscata de Bernoulli: dos lóbulos (desarrollo y operación) unidos por un punto de cruce.
function curve(t: number): Point {
  const s = Math.sin(t);
  const k = 1 + s * s;

  return [CX + (A * Math.cos(t)) / k, CY + (A * s * Math.cos(t)) / k];
}

function lobe(from: number, to: number, steps = 48): string {
  const points = Array.from({ length: steps + 1 }, (_, index) =>
    curve(from + ((to - from) * index) / steps),
  );

  const commands = points.map(([x, y], index) => {
    const command = index === 0 ? 'M' : 'L';

    return `${command}${x.toFixed(1)} ${y.toFixed(1)}`;
  });

  return `${commands.join('')}Z`;
}

const phases = [
  { name: 'PLAN', t: 0.7, above: true },
  { name: 'CODE', t: 0.9, above: true },
  { name: 'BUILD', t: 1.1, above: false },
  { name: 'TEST', t: 1.3, above: false },
  { name: 'RELEASE', t: 1.7, above: true },
  { name: 'DEPLOY', t: 1.9, above: true },
  { name: 'OPERATE', t: 0.1, above: false },
  { name: 'MONITOR', t: 0.3, above: false },
] as const;

export function devopsCultura(): Figure {
  const left = lobe(Math.PI / 2, (3 * Math.PI) / 2);
  const right = lobe(-Math.PI / 2, Math.PI / 2);
  const full = lobe(0, 2 * Math.PI, 160).replace(/Z$/, '');

  return figure(
    group(
      [
        path(left, { fill: 'brandSoft', width: 1.6 }),
        path(right, { fill: 'accentSoft', width: 1.6 }),
      ],
      motion('rise'),
    ),
    heading(CX - 118, CY + 8, 'DEV', { size: 26, tracking: 0.5 }),
    heading(CX + 118, CY + 8, 'OPS', { size: 26, tracking: 0.5 }),
    path(full, { dash: '0.1 11.9', motion: motion('flow'), stroke: 'accent', width: 4.5 }),
    phases.map((phase, index) => {
      const [x, y] = curve(phase.t * Math.PI);

      return group(
        [
          node(x, y, 5.5, false, { width: 1.6 }),
          label(x, phase.above ? y - 16 : y + 24, phase.name, { tone: 'ink', size: 11 }),
        ],
        motion('fade', 600 + index * 110),
      );
    }),
    pulse(CX, CY, 14, 400),
    node(CX, CY, 6, true, { width: 1.6 }),
    dimension([CX - A, 340], [CX + A, 340], 'CONTINUOUS'),
  );
}
