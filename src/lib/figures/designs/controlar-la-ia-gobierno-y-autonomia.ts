import {
  arrow,
  circle,
  dimension,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

// Escalera de autonomía: cada peldaño da más poder al modelo; los guardrails filtran todo efecto.
const STEP_W = 80;
const RISE = 52;
const BASE = 340;
const LEFT = 40;

function step(index: number) {
  const x = LEFT + index * STEP_W;
  const y = BASE - 22 - index * RISE;

  return group(
    [
      rect(x, y, STEP_W, BASE - y, {
        fill: index === 1 ? 'paper' : 'brandSoft',
        r: 2,
        stroke: 'ink',
        width: 1.4,
      }),
      label(x + STEP_W / 2, y + 16, `L${index + 1}`, { size: 11, tone: 'ink', tracking: 1.2 }),
    ],
    motion('rise', 120 * index),
  );
}

// Punto de aprobación: una cabeza sobre el peldaño y su rótulo.
function gate(index: number, text: string, isHot: boolean) {
  const cx = LEFT + index * STEP_W + STEP_W / 2;
  const top = BASE - 22 - index * RISE;

  return group(
    [
      line(cx, top, cx, top - 18, { stroke: isHot ? 'accent' : 'muted', width: 1.4 }),
      node(cx, top - 26, 8, isHot, { width: 1.6 }),
      label(cx, top - 44, text, { size: 11, tone: isHot ? 'accent' : 'muted' }),
    ],
    motion('fade', 700 + index * 100),
  );
}

function chip(y: number, text: string, delay: number) {
  return group(
    [
      line(500, y + 13, 532, y + 13, { dash: '2 4', stroke: 'muted', width: 1 }),
      rect(532, y, 76, 26, { fill: 'paper', r: 13, stroke: 'muted', width: 1.2 }),
      label(570, y + 17, text, { size: 10.5, tone: 'ink' }),
    ],
    motion('rise', delay),
  );
}

export function controlarLaIaGobiernoYAutonomia(): Figure {
  const hot = LEFT + STEP_W + STEP_W / 2;
  const hotTop = BASE - 22 - RISE;

  return figure(
    line(28, BASE, 452, BASE, { stroke: 'ink', width: 1.6 }),
    [0, 1, 2, 3, 4].map((index) => step(index)),
    gate(1, 'HITL', true),
    pulse(hot, hotTop - 26, 18, 1100),
    gate(3, 'HOTL', false),
    dimension([LEFT, 368], [LEFT + 5 * STEP_W, 368], 'AUTONOMY'),
    // Barrera de guardrails entre la escalera y el mundo exterior.
    group(
      [
        rect(470, 44, 30, 296, { dash: '5 7', fill: 'sunken', r: 4, stroke: 'ink', width: 1.4 }),
        label(485, 262, 'GUARDRAILS', { rotate: -90, size: 11, tone: 'ink', tracking: 2.4 }),
      ],
      motion('rise', 500),
    ),
    arrow(
      [
        [440, 140],
        [536, 140],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    group(
      [
        circle(570, 140, 32, { fill: 'paper', width: 1.6 }),
        heading(570, 146, 'Tools', { size: 15 }),
      ],
      motion('rise', 650),
    ),
    chip(198, 'LOG', 800),
    chip(234, 'EVAL', 900),
    chip(270, 'BUDGET', 1000),
    chip(306, 'SCOPE', 1100),
  );
}
