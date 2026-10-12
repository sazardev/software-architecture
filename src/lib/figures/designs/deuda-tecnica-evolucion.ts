import { arrowHead, circle, figure, group, label, line, motion, path, pulse } from '../figure-kit';
import type { Point } from '../figure-kit';
import { smoothPath } from '../figure-shapes';
import type { Figure } from '../figure-types';

const LEFT = 76;
const RIGHT = 596;
const BASE = 312;
const TOP = 48;

const unpaid: readonly Point[] = [
  [LEFT, 290],
  [190, 278],
  [290, 250],
  [380, 206],
  [458, 146],
  [530, 92],
  [RIGHT, 52],
];

// Se paga deuda con regularidad: el coste de cambio vuelve a su nivel base.
const repayments = [196, 330, 464] as const;
const paid: readonly Point[] = [
  [LEFT, 290],
  [repayments[0], 276],
  [repayments[0], 292],
  [repayments[1], 278],
  [repayments[1], 292],
  [repayments[2], 280],
  [repayments[2], 292],
  [RIGHT, 282],
];

const toPath = (points: readonly Point[]): string =>
  points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join('');

export function deudaTecnicaEvolucion(): Figure {
  const interest = `${smoothPath(unpaid)}${[...paid]
    .toReversed()
    .map(([x, y]) => `L${x} ${y}`)
    .join('')}Z`;

  const unpaidLine = path(smoothPath(unpaid), { stroke: 'accent', width: 2.4 });
  const paidLine = path(toPath(paid), { width: 2 });

  return figure(
    // Ejes.
    line(LEFT, BASE, LEFT, TOP - 8, { width: 1.5 }),
    line(LEFT, BASE, RIGHT + 16, BASE, { width: 1.5 }),
    arrowHead([LEFT, TOP + 4], [LEFT, TOP - 10]),
    arrowHead([RIGHT, BASE], [RIGHT + 16, BASE]),
    [1, 2, 3, 4].map((tick) =>
      line(LEFT - 4, BASE - tick * 60, LEFT, BASE - tick * 60, { stroke: 'muted', width: 1 }),
    ),
    label(LEFT + 6, TOP - 12, 'COST OF CHANGE', { anchor: 'start' }),
    label(RIGHT + 16, BASE + 24, 'TIME', { anchor: 'end' }),
    // Interés acumulado entre las dos trayectorias.
    group([path(interest, { fill: 'accentSoft', stroke: undefined })], motion('fade', 300)),
    group(
      [unpaidLine, label(RIGHT - 8, 36, 'UNPAID', { anchor: 'end', tone: 'accent' })],
      motion('rise', 500),
    ),
    group(
      [paidLine, label(RIGHT - 4, 270, 'REPAID', { anchor: 'end', tone: 'ink' })],
      motion('rise', 700),
    ),
    label(462, 212, 'INTEREST', { tone: 'accent', tracking: 3 }),
    // Cada amortización es una decisión consciente.
    repayments.map((x, index) =>
      group(
        [
          line(x, 292, x, BASE, { dash: '2 3', stroke: 'muted', width: 1 }),
          circle(x, 292, 5, { fill: 'paper', width: 1.6 }),
          label(x, BASE + 24, 'REFACTOR', { size: 10, tone: 'ink' }),
        ],
        motion('fade', 900 + index * 150),
      ),
    ),
    pulse(repayments[1], 292, 12, 1200),
  );
}
