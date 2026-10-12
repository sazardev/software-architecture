import {
  arrow,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  path,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const OBJECTIVE: Point = [250, 52];
const KR_Y = 132;
const LEAD_Y = 220;
const HYPOTHESIS_Y = 316;
const BRANCHES = [110, 250, 390] as const;
const SPREAD = 34;

const GUARD_X = 498;
const GUARD_Y = 214;
const GUARD_W = 124;
const GUARD_H = 70;

function keyResult(cx: number, index: number) {
  return group(
    [
      rect(cx - 46, KR_Y - 18, 92, 36, { fill: 'brandSoft', r: 5, width: 1.6 }),
      heading(cx, KR_Y + 6, `KR${index + 1}`, { font: 'mono', size: 13, tracking: 1.4 }),
      line(cx, KR_Y - 18, OBJECTIVE[0], OBJECTIVE[1] + 22, { stroke: 'ink', width: 1.4 }),
    ],
    motion('rise', 250 + index * 120),
  );
}

function leads(cx: number, index: number) {
  const left = cx - SPREAD;
  const right = cx + SPREAD;

  return group(
    [
      line(left, LEAD_Y - 6, cx - 10, KR_Y + 18, { stroke: 'muted', width: 1.2 }),
      line(right, LEAD_Y - 6, cx + 10, KR_Y + 18, { stroke: 'muted', width: 1.2 }),
      node(left, LEAD_Y, 6),
      node(right, LEAD_Y, 6),
      label(left + 11, LEAD_Y + 4, `m${index * 2 + 1}`, { anchor: 'start', size: 10 }),
      label(right + 11, LEAD_Y + 4, `m${index * 2 + 2}`, { anchor: 'start', size: 10 }),
    ],
    motion('rise', 550 + index * 120),
  );
}

function hypothesis(cx: number, index: number) {
  return group(
    [
      line(cx - 12, HYPOTHESIS_Y - 15, cx - SPREAD, LEAD_Y + 7, { stroke: 'muted', width: 1 }),
      line(cx + 12, HYPOTHESIS_Y - 15, cx + SPREAD, LEAD_Y + 7, { stroke: 'muted', width: 1 }),
      rect(cx - 30, HYPOTHESIS_Y - 15, 60, 30, { dash: '4 4', fill: 'paper', r: 4, width: 1.3 }),
      label(cx, HYPOTHESIS_Y + 4, `H${index + 1}`, { size: 11, tone: 'ink' }),
    ],
    motion('rise', 850 + index * 120),
  );
}

const flowMotion = motion('flow');

export function medirDecisionesOkrKpi(): Figure {
  const [ox, oy] = OBJECTIVE;
  const sideStart: Point = [BRANCHES[2] + 30, HYPOTHESIS_Y];

  return figure(
    // Objetivo arriba: lo que se quiere conseguir.
    group(
      [
        rect(ox - 74, oy - 22, 148, 44, { fill: 'paper', r: 6, width: 1.8 }),
        heading(ox - 34, oy + 7, 'O', { size: 22 }),
        label(ox + 16, oy + 5, 'OKR', { tone: 'ink', tracking: 3 }),
      ],
      motion('rise'),
    ),
    BRANCHES.map((cx, index) => keyResult(cx, index)),
    BRANCHES.map((cx, index) => leads(cx, index)),
    BRANCHES.map((cx, index) => hypothesis(cx, index)),
    // La evidencia sube desde la hipótesis hasta el objetivo por una rama.
    arrow(
      [
        [BRANCHES[1] - 12, HYPOTHESIS_Y - 15],
        [BRANCHES[1] - SPREAD, LEAD_Y + 7],
        [BRANCHES[1] - SPREAD, LEAD_Y - 8],
        [BRANCHES[1] - 10, KR_Y + 18],
      ],
      { flow: true, tone: 'brand', width: 1.4 },
    ),
    // Efecto colateral: la tercera hipótesis empuja hacia fuera del árbol.
    group(
      [
        path(
          `M${sideStart[0]} ${sideStart[1]}C${sideStart[0] + 40} ${sideStart[1]} ${GUARD_X - 40} ${GUARD_Y + GUARD_H / 2} ${GUARD_X - 8} ${GUARD_Y + GUARD_H / 2}`,
          { dash: '5 7', motion: flowMotion, stroke: 'muted', width: 1.4 },
        ),
        line(GUARD_X - 8, GUARD_Y + 18, GUARD_X - 8, GUARD_Y + GUARD_H - 18, {
          stroke: 'accent',
          width: 3,
        }),
      ],
      motion('fade', 1100),
    ),
    // Métrica guía: protege lo que el objetivo no debe romper.
    group(
      [
        rect(GUARD_X, GUARD_Y, GUARD_W, GUARD_H, {
          fill: 'accentSoft',
          r: 6,
          stroke: 'accent',
          width: 2,
        }),
        label(GUARD_X + GUARD_W / 2, GUARD_Y + 28, 'GUARDRAIL', { size: 11, tone: 'ink' }),
        label(GUARD_X + GUARD_W / 2, GUARD_Y + 50, '≤ 0.35', { size: 12, tone: 'accent' }),
        path(`M${GUARD_X + GUARD_W / 2} ${GUARD_Y}V${oy}H${ox + 80}`, {
          dash: '2 4',
          stroke: 'muted',
          width: 1.2,
        }),
      ],
      motion('rise', 1000),
    ),
    pulse(GUARD_X - 8, GUARD_Y + GUARD_H / 2, 14, 1400),
    // Niveles del árbol.
    label(24, KR_Y + 4, 'KR', { anchor: 'start', size: 10 }),
    label(24, LEAD_Y + 4, 'm', { anchor: 'start', size: 10 }),
    label(24, HYPOTHESIS_Y + 4, 'H', { anchor: 'start', size: 10 }),
    line(16, 30, 16, 372, { stroke: 'faint', width: 1 }),
    label(ox, 380, 'H → m → KR → O', { size: 10.5 }),
  );
}
