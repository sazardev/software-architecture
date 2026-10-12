import {
  arrow,
  circle,
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
} from '../figure-kit';
import type { Figure } from '../figure-types';

const LANE = 200;

// Tres filtros de verificación: fuente, cifra y contraargumento.
const gates = [
  { name: 'REF', x: 304 },
  { name: '123', x: 362 },
  { name: 'VS', x: 420 },
] as const;

function gate(x: number, name: string, delay: number) {
  return group(
    [
      rect(x - 7, 116, 14, LANE - 128, { fill: 'paper', r: 2, width: 1.4 }),
      rect(x - 7, LANE + 12, 14, 72, { fill: 'paper', r: 2, width: 1.4 }),
      label(x, 104, name, { size: 11, tone: 'ink' }),
      // Lo que no pasa el filtro cae fuera del flujo.
      line(x - 22, LANE + 8, x - 22, 318, { dash: '2 4', stroke: 'muted', width: 1.2 }),
      line(x - 27, 319, x - 17, 329, { stroke: 'muted', width: 1.4 }),
      line(x - 27, 329, x - 17, 319, { stroke: 'muted', width: 1.4 }),
      pulse(x, LANE, 12, delay + 600),
      node(x, LANE, 4.5, true),
    ],
    motion('rise', delay),
  );
}

export function iaParaDecidirNegocio(): Figure {
  return figure(
    // La pregunta y el modelo.
    group(
      [
        rect(24, 166, 100, 68, { fill: 'paper', r: 6, width: 1.6 }),
        heading(74, 210, '?', { size: 28 }),
        label(74, 256, 'PROMPT', { size: 11 }),
        rect(160, 160, 92, 80, { fill: 'brandSoft', r: 6, width: 1.6 }),
        heading(206, 206, 'LLM', { font: 'mono', size: 15, tracking: 2 }),
      ],
      motion('rise'),
    ),
    arrow(
      [
        [124, LANE],
        [160, LANE],
      ],
      { tone: 'brand' },
    ),
    // El flujo atraviesa los tres filtros.
    arrow(
      [
        [252, LANE],
        [508, LANE],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    // El marco de verificación es la idea clave: único acento.
    rect(272, 82, 180, 262, { dash: '5 7', r: 8, stroke: 'accent', width: 1.6 }),
    gates.map((item, index) => gate(item.x, item.name, 300 + index * 160)),
    // La decisión es de una persona y queda registrada.
    group(
      [
        circle(552, 168, 16, { fill: 'paper', width: 1.6 }),
        path('M518 240 Q518 194 552 194 Q586 194 586 240 Z', { fill: 'brandSoft', width: 1.6 }),
        line(552, 244, 552, 262, { stroke: 'ink', width: 1.4 }),
        rect(528, 266, 48, 60, { fill: 'paper', r: 3, width: 1.4 }),
        line(538, 284, 566, 284, { stroke: 'muted', width: 1 }),
        line(538, 296, 566, 296, { stroke: 'muted', width: 1 }),
        line(538, 308, 558, 308, { stroke: 'muted', width: 1 }),
        label(552, 350, 'ADR', { size: 11, tone: 'ink' }),
      ],
      motion('rise', 900),
    ),
  );
}
