import { circle, figure, group, label, line, motion, path, poly, pulse, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

const PIVOT = { x: 320, y: 112 };
const HALF = 196;
const TILT = (7 * Math.PI) / 180;

const leftEnd = { x: PIVOT.x - HALF * Math.cos(TILT), y: PIVOT.y + HALF * Math.sin(TILT) };
const rightEnd = { x: PIVOT.x + HALF * Math.cos(TILT), y: PIVOT.y - HALF * Math.sin(TILT) };

const DROP = 108;

// Platillo colgado de un extremo de la viga: dos cuerdas y un cuenco con su carga.
function pan(
  end: { x: number; y: number },
  name: string,
  loads: readonly number[],
  isHot: boolean,
  delay: number,
) {
  const bowlY = end.y + DROP;
  let top = bowlY;

  const blocks = loads.map((size, index) => {
    top -= size;
    const stackX = end.x - size / 2 + (index % 2 === 0 ? 0 : 6);

    return rect(stackX, top, size, size, {
      fill: isHot ? 'accentSoft' : 'brandSoft',
      r: 3,
      width: 1.6,
    });
  });

  return group(
    [
      line(end.x, end.y, end.x - 52, bowlY, { stroke: 'muted', width: 1.1 }),
      line(end.x, end.y, end.x + 52, bowlY, { stroke: 'muted', width: 1.1 }),
      ...blocks,
      path(`M${end.x - 64} ${bowlY}H${end.x + 64}Q${end.x} ${bowlY + 36} ${end.x - 64} ${bowlY}Z`, {
        fill: 'sunken',
        width: 1.6,
      }),
      label(end.x, bowlY + 58, name, { size: 11.5, tone: 'ink', tracking: 2 }),
    ],
    motion('rise', delay),
  );
}

export function tradeOffsYDecisiones(): Figure {
  return figure(
    line(220, 346, 420, 346, { width: 1.8 }),
    group(
      [
        poly(
          [
            [286, 346],
            [354, 346],
            [334, 316],
            [306, 316],
          ],
          { fill: 'sunken', width: 1.6 },
          true,
        ),
        rect(312, PIVOT.y, 16, 204, { fill: 'sunken', r: 2, width: 1.6 }),
      ],
      motion('rise'),
    ),
    group(
      [
        line(leftEnd.x, leftEnd.y, rightEnd.x, rightEnd.y, { width: 3 }),
        circle(leftEnd.x, leftEnd.y, 4.5, { fill: 'paper', width: 1.6 }),
        circle(rightEnd.x, rightEnd.y, 4.5, { fill: 'paper', width: 1.6 }),
      ],
      motion('fade', 300),
    ),
    pan(leftEnd, 'SPEED', [54, 40], true, 500),
    pan(rightEnd, 'COST', [34], false, 650),
    pulse(PIVOT.x, PIVOT.y, 16, 900),
    circle(PIVOT.x, PIVOT.y, 9, { fill: 'accent', width: 1.8 }),
    line(PIVOT.x, 66, PIVOT.x, PIVOT.y - 14, { dash: '2 4', stroke: 'muted', width: 1 }),
    label(PIVOT.x, 56, 'DECISION', { tone: 'ink', tracking: 3 }),
  );
}
