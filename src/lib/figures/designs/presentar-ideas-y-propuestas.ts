import {
  arrow,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  poly,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure } from '../figure-types';

// Pirámide de Minto: la conclusión arriba y, debajo, tres niveles de soporte.
const apex = { cx: 320, h: 46, w: 140, y: 30 };

const reasons = [
  { cx: 150, evidence: ['KPI', 'ROI'], text: 'I' },
  { cx: 320, evidence: ['TCO', 'SLA'], text: 'II' },
  { cx: 490, evidence: ['p99', 'RPO'], text: 'III' },
] as const;

const REASON_Y = 124;
const REASON_H = 40;
const EVIDENCE_Y = 210;
const EVIDENCE_H = 34;
const EVIDENCE_SPREAD = 42;
const DATA_BASE = 352;

// Alturas de las barras de datos bajo cada evidencia (solo forma, no cifras reales).
const barHeights = [
  [22, 34, 28],
  [30, 18, 38],
  [16, 30, 24],
  [36, 26, 20],
  [24, 38, 32],
  [28, 20, 34],
] as const;

function elbow(fromX: number, fromY: number, toX: number, toY: number, delay: number) {
  const midY = (fromY + toY) / 2;
  const points: Point[] = [
    [fromX, fromY],
    [fromX, midY],
    [toX, midY],
    [toX, toY],
  ];

  return poly(points, { motion: motion('draw', delay), stroke: 'muted', width: 1.2 });
}

function dataBars(cx: number, heights: readonly number[], delay: number) {
  return group(
    [
      line(cx - 24, DATA_BASE, cx + 24, DATA_BASE, { stroke: 'muted', width: 1 }),
      ...heights.map((h, index) =>
        rect(cx - 19 + index * 14, DATA_BASE - h, 10, h, {
          fill: 'paper',
          r: 1.5,
          stroke: 'brand',
          width: 1.2,
        }),
      ),
    ],
    motion('rise', delay),
  );
}

export function presentarIdeasYPropuestas(): Figure {
  const evidence = reasons.flatMap((reason) =>
    reason.evidence.map((text, index) => ({
      cx: reason.cx + (index === 0 ? -EVIDENCE_SPREAD : EVIDENCE_SPREAD),
      parent: reason.cx,
      text,
    })),
  );

  return figure(
    // Escalones de la pirámide: cada nivel es más ancho que el anterior.
    group(
      [
        rect(66, 110, 508, 66, { fill: 'brandSoft', r: 6, stroke: undefined }),
        rect(30, 196, 580, 62, { fill: 'brandSoft', opacity: 0.75, r: 6, stroke: undefined }),
        rect(12, 276, 616, 92, { fill: 'brandSoft', opacity: 0.5, r: 6, stroke: undefined }),
      ],
      motion('rise'),
    ),
    // Introducción SCQA que desemboca en la conclusión.
    label(118, 57, 'SCQA', { tone: 'ink', tracking: 2.4 }),
    arrow(
      [
        [160, 53],
        [apex.cx - apex.w / 2 - 2, 53],
      ],
      { dash: '3 5', tone: 'muted', width: 1.2 },
    ),
    reasons.map((reason, index) =>
      elbow(apex.cx, apex.y + apex.h, reason.cx, REASON_Y, 400 + index * 80),
    ),
    evidence.map((item, index) =>
      elbow(item.parent, REASON_Y + REASON_H, item.cx, EVIDENCE_Y, 700 + index * 60),
    ),
    evidence.map((item) =>
      line(item.cx, EVIDENCE_Y + EVIDENCE_H, item.cx, DATA_BASE - 42, {
        dash: '2 4',
        stroke: 'muted',
        width: 1,
      }),
    ),
    // Conclusión: el único acento de la figura.
    group(
      [
        rect(apex.cx - apex.w / 2, apex.y, apex.w, apex.h, { fill: 'accent', r: 6, width: 1.8 }),
        heading(apex.cx, apex.y + 30, 'IDEA', { size: 20, tone: 'paper', tracking: 3 }),
      ],
      motion('rise', 200),
    ),
    reasons.map((reason, index) =>
      group(
        [
          rect(reason.cx - 55, REASON_Y, 110, REASON_H, { fill: 'paper', r: 5, width: 1.6 }),
          heading(reason.cx, REASON_Y + 26, reason.text, { size: 17 }),
        ],
        motion('rise', 500 + index * 100),
      ),
    ),
    evidence.map((item, index) =>
      group(
        [
          rect(item.cx - 35, EVIDENCE_Y, 70, EVIDENCE_H, { fill: 'paper', r: 4, width: 1.3 }),
          label(item.cx, EVIDENCE_Y + 22, item.text, { size: 11, tone: 'ink' }),
        ],
        motion('rise', 800 + index * 60),
      ),
    ),
    evidence.map((item, index) =>
      dataBars(item.cx, barHeights[index] ?? [20, 20, 20], 1100 + index * 60),
    ),
    // Cada nivel agrupa sin solapes ni huecos.
    label(596, 143, 'MECE', { rotate: -90, size: 10, tracking: 2.4 }),
  );
}
