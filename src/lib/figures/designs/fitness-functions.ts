import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Point } from '../figure-kit';
import { smoothPath } from '../figure-shapes';
import type { Figure } from '../figure-types';

const LEFT = 60;
const RIGHT = 592;
const THRESHOLD = 150;
const CROSS_X = 372;

const metric: readonly Point[] = [
  [LEFT, 214],
  [118, 198],
  [172, 206],
  [226, 184],
  [280, 192],
  [330, 170],
  [CROSS_X, THRESHOLD],
  [430, 118],
  [494, 98],
  [RIGHT, 70],
];

const stages = [
  { blocked: false, isHot: false, name: 'COMMIT' },
  { blocked: false, isHot: false, name: 'BUILD' },
  { blocked: false, isHot: true, name: 'FITNESS' },
  { blocked: true, isHot: false, name: 'DEPLOY' },
] as const;

const STAGE_W = 114;
const STAGE_GAP = 22;
const STAGE_Y = 292;

type Stage = (typeof stages)[number];

function stageFill(stage: Stage): 'accent' | 'paper' | undefined {
  if (stage.isHot) {
    return 'accent';
  }

  return stage.blocked ? undefined : 'paper';
}

export function fitnessFunctions(): Figure {
  const crossing = metric.findIndex(([x]) => x === CROSS_X);
  const beyond = metric.slice(crossing);

  const series = path(smoothPath(metric), { stroke: 'ink', width: 2.2 });
  const overshoot = path(smoothPath(beyond), { stroke: 'accent', width: 2.6 });

  return figure(
    // Zona de violación sobre el umbral.
    group(
      [
        rect(LEFT, 56, RIGHT - LEFT, THRESHOLD - 56, {
          dash: '3 4',
          fill: 'accentSoft',
          r: 0,
          stroke: undefined,
        }),
        line(LEFT, THRESHOLD, RIGHT, THRESHOLD, { dash: '6 5', stroke: 'accent', width: 1.6 }),
        label(RIGHT, THRESHOLD + 18, 'THRESHOLD', { anchor: 'end', tone: 'accent' }),
        label(LEFT + 8, 76, 'VIOLATION', { anchor: 'start', tone: 'accent', tracking: 3 }),
      ],
      motion('fade'),
    ),
    // Ejes y serie temporal.
    line(LEFT, 238, LEFT, 48, { width: 1.5 }),
    line(LEFT, 238, RIGHT, 238, { width: 1.5 }),
    label(LEFT + 8, 262, 'METRIC OVER TIME', { anchor: 'start' }),
    group([series, overshoot], motion('rise', 300)),
    pulse(CROSS_X, THRESHOLD, 14, 800),
    circle(CROSS_X, THRESHOLD, 6.5, { fill: 'accent', width: 1.7 }),
    line(CROSS_X, THRESHOLD + 8, CROSS_X, STAGE_Y - 4, {
      dash: '2 4',
      stroke: 'accent',
      width: 1.4,
    }),
    // Canal de entrega: la función de aptitud puede frenar el despliegue.
    stages.map((stage, index) => {
      const x = LEFT + index * (STAGE_W + STAGE_GAP);

      return group(
        [
          rect(x, STAGE_Y, STAGE_W, 38, {
            dash: stage.blocked ? '4 4' : undefined,
            fill: stageFill(stage),
            r: 5,
            stroke: stage.blocked ? 'muted' : 'ink',
            width: 1.6,
          }),
          heading(x + STAGE_W / 2, STAGE_Y + 24, stage.name, {
            font: 'mono',
            size: 11.5,
            tone: stage.blocked ? 'muted' : 'ink',
            tracking: 1.4,
          }),
          ...(index === 0
            ? []
            : [
                arrow(
                  [
                    [x - STAGE_GAP + 2, STAGE_Y + 19],
                    [x - 2, STAGE_Y + 19],
                  ],
                  { tone: stage.blocked ? 'muted' : 'ink' },
                ),
              ]),
        ],
        motion('rise', 700 + index * 120),
      );
    }),
  );
}
