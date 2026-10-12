import {
  arrow,
  dimension,
  figure,
  group,
  heading,
  label,
  motion,
  path,
  poly,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure, Prim } from '../figure-types';

const BOX_W = 76;
const BOX_Y = 92;
const BOX_H = 62;
const STEP = 116;
const FIRST_X = 64;
const WAIT_Y = 236;
const WORK_Y = 284;

// Cinco etapas en serie: espera antes de cada una, tiempo de proceso dentro (días supuestos).
const stages = [
  { name: 'SPEC', wait: '2d', work: '0.5d', load: 'ρ 40%' },
  { name: 'DEV', wait: '2.5d', work: '1.5d', load: 'ρ 40%' },
  { name: 'REVIEW', wait: '2d', work: '0.5d', load: 'ρ 40%' },
  { name: 'QA', wait: '7d', work: '1d', load: 'ρ 80%' },
  { name: 'DEPLOY', wait: '2.5d', work: '0.5d', load: 'ρ 40%' },
] as const;

const BOTTLENECK = 3;

const boxX = (index: number): number => FIRST_X + index * STEP;
const gapCenter = (index: number): number => boxX(index) - 20;

// Inventario en espera: el triángulo de los mapas de flujo de valor.
function stock(cx: number, baseY: number, isHot: boolean): Prim {
  return poly(
    [
      [cx, baseY - 15],
      [cx - 9, baseY],
      [cx + 9, baseY],
    ],
    { fill: 'paper', stroke: isHot ? 'accent' : 'muted', width: 1.3 },
    true,
  );
}

function queue(index: number): Prim {
  const cx = gapCenter(index);
  const isHot = index === BOTTLENECK;
  const items = isHot
    ? [stock(cx - 9, 196, true), stock(cx + 9, 196, true), stock(cx, 180, true)]
    : [stock(cx, 196, false)];

  return group(items, motion('rise', 500 + index * 120));
}

function ladder(): string {
  const points: Point[] = [[24, WAIT_Y]];

  for (const index of stages.keys()) {
    const x = boxX(index);

    points.push([x, WAIT_Y], [x, WORK_Y], [x + BOX_W, WORK_Y]);

    if (index < stages.length - 1) {
      points.push([x + BOX_W, WAIT_Y]);
    }
  }

  return points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join('');
}

export function flujoDeValorYCuellosDeBotella(): Figure {
  const hotX = boxX(BOTTLENECK);

  return figure(
    pulse(gapCenter(BOTTLENECK), 186, 26, 1200),
    // Etapas y empuje entre ellas.
    stages.map((stage, index) => {
      const x = boxX(index);
      const isHot = index === BOTTLENECK;

      return group(
        [
          rect(x, BOX_Y, BOX_W, BOX_H, {
            fill: isHot ? 'paper' : 'brandSoft',
            r: 5,
            stroke: isHot ? 'accent' : 'ink',
            width: isHot ? 2.2 : 1.5,
          }),
          heading(x + BOX_W / 2, BOX_Y + 37, stage.name, { font: 'mono', size: 12, tracking: 1.2 }),
          label(x + BOX_W / 2, BOX_Y - 14, stage.load, {
            size: 10.5,
            tone: isHot ? 'accent' : 'muted',
          }),
        ],
        motion('rise', index * 120),
      );
    }),
    stages.slice(1).map((_, index) =>
      arrow(
        [
          [boxX(index) + BOX_W, BOX_Y + BOX_H / 2],
          [boxX(index + 1), BOX_Y + BOX_H / 2],
        ],
        { tone: 'muted', width: 1.3 },
      ),
    ),
    arrow(
      [
        [boxX(4) + BOX_W, BOX_Y + BOX_H / 2],
        [630, BOX_Y + BOX_H / 2],
      ],
      { width: 1.4 },
    ),
    stages.map((_, index) => queue(index)),
    // Escalera de tiempos: arriba la espera, abajo el trabajo.
    path(ladder(), { motion: motion('draw', 700), width: 1.5 }),
    path(`M${hotX - 40} ${WAIT_Y}L${hotX} ${WAIT_Y}`, {
      motion: motion('fade', 1100),
      stroke: 'accent',
      width: 3,
    }),
    stages.map((stage, index) =>
      group(
        [
          label(gapCenter(index), WAIT_Y - 10, stage.wait, {
            size: 10.5,
            tone: index === BOTTLENECK ? 'accent' : 'muted',
          }),
          label(boxX(index) + BOX_W / 2, WORK_Y + 18, stage.work, { size: 10.5, tone: 'ink' }),
        ],
        motion('fade', 900 + index * 100),
      ),
    ),
    dimension([24, 336], [604, 336], '20d', { offset: 12 }),
    label(314, 376, '4d / 20d = 20%', { size: 12, tone: 'ink', tracking: 1.4 }),
  );
}
