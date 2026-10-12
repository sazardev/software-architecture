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
import type { Figure } from '../figure-types';

const LANE_TOP = 138;
const LANE_BOTTOM = 238;
const LEFT = 44;
const RIGHT = 596;

const gates = [
  { name: 'HOOKS', x: 190 },
  { name: 'RULES', x: 290 },
  { name: 'TESTS', x: 390 },
  { name: 'REVIEW', x: 490 },
] as const;

const posts = Array.from({ length: 14 }, (_, index) => LEFT + 16 + index * 40);

function gate(name: string, x: number, index: number) {
  const mid = (LANE_TOP + LANE_BOTTOM) / 2;

  return group(
    [
      rect(x - 7, LANE_TOP - 26, 14, 50, { fill: 'brandSoft', r: 3, width: 1.6 }),
      rect(x - 7, LANE_BOTTOM - 24, 14, 50, { fill: 'brandSoft', r: 3, width: 1.6 }),
      circle(x, LANE_TOP - 46, 11, { fill: 'paper', width: 1.6 }),
      path(`M${x - 4.5} ${LANE_TOP - 46}l3.4 3.6l6-7`, { stroke: 'accent', width: 2 }),
      line(x, LANE_TOP - 35, x, LANE_TOP - 26, { stroke: 'muted', width: 1 }),
      label(x, LANE_BOTTOM + 52, name, { size: 11.5, tone: 'ink' }),
      line(x, mid - 18, x, mid + 18, { dash: '2 3', stroke: 'faint', width: 1 }),
    ],
    motion('rise', 400 + index * 140),
  );
}

export function harnessEngineeringClaudeCode(): Figure {
  return figure(
    // Carril: las barandillas que mantienen al agente en el camino.
    rect(LEFT, LANE_TOP, RIGHT - LEFT, LANE_BOTTOM - LANE_TOP, {
      fill: 'sunken',
      r: 0,
      stroke: undefined,
    }),
    line(LEFT, LANE_TOP, RIGHT, LANE_TOP, { width: 2.4 }),
    line(LEFT, LANE_BOTTOM, RIGHT, LANE_BOTTOM, { width: 2.4 }),
    posts.map((x) =>
      group([
        line(x, LANE_TOP, x, LANE_TOP - 9, { width: 1.5 }),
        line(x, LANE_BOTTOM, x, LANE_BOTTOM + 9, { width: 1.5 }),
      ]),
    ),
    gates.map((item, index) => gate(item.name, item.x, index)),
    // Agente avanzando por el carril.
    group(
      [
        arrow(
          [
            [112, 188],
            [160, 188],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
        circle(84, 188, 20, { fill: 'accentSoft', stroke: 'accent', width: 2 }),
        heading(84, 193, 'AI', { font: 'mono', size: 13, tone: 'accent' }),
      ],
      motion('fade', 200),
    ),
    pulse(84, 188, 24, 800),
    // Resultado verificado.
    group(
      [
        arrow(
          [
            [520, 188],
            [560, 188],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
        circle(580, 188, 14, { fill: 'accent', width: 1.8 }),
      ],
      motion('fade', 1000),
    ),
    // Retroalimentación: lo aprendido vuelve al principio como regla.
    group(
      [
        path(`M490 ${LANE_BOTTOM + 70}C490 358 84 358 84 ${LANE_BOTTOM + 28}`, {
          dash: '4 4',
          stroke: 'muted',
          width: 1.4,
        }),
        arrow(
          [
            [84, 288],
            [84, 262],
          ],
          { tone: 'muted' },
        ),
        label(287, 376, 'FEEDBACK BECOMES RULES', { size: 11 }),
      ],
      motion('fade', 1200),
    ),
    label(LEFT, 84, 'HARNESS', { anchor: 'start', tone: 'ink', tracking: 3 }),
    line(LEFT + 78, 80, RIGHT, 80, { dash: '2 4', stroke: 'muted', width: 1 }),
  );
}
