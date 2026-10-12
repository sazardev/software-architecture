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

const ROW_H = 26;

/**
Barra de la línea de tiempo: una fase de una invocación.
*/
function phase(x: number, y: number, w: number, text: string, isCold = false) {
  return [
    rect(x, y, w, ROW_H, {
      fill: isCold ? 'accentSoft' : 'brandSoft',
      r: 3,
      stroke: isCold ? 'accent' : 'ink',
      width: 1.4,
    }),
    label(x + w / 2, y + 17.5, text, { size: 10.5, tone: 'ink' }),
  ];
}

export function serverlessYComputacionGestionada(): Figure {
  return figure(
    // Recorrido de la petición: evento, API, función (INIT + HANDLER) y almacén de estado.
    group(
      [
        circle(64, 112, 24, { fill: 'paper', width: 1.6 }),
        label(64, 116, 'EVENT', { size: 9.5, tone: 'ink', tracking: 1 }),
        rect(124, 90, 84, 44, { fill: 'paper', r: 5, width: 1.6 }),
        heading(166, 118, 'API', { font: 'mono', size: 13, tracking: 2 }),
      ],
      motion('rise'),
    ),
    group(
      [
        rect(240, 66, 250, 92, { dash: '5 7', fill: 'sunken', r: 8, stroke: 'muted', width: 1.2 }),
        label(365, 54, 'FaaS', { tone: 'ink', tracking: 3 }),
        rect(254, 88, 90, 48, { fill: 'accentSoft', r: 4, stroke: 'accent', width: 1.8 }),
        heading(299, 118, 'INIT', { font: 'mono', size: 13, tracking: 2 }),
        rect(354, 88, 122, 48, { fill: 'paper', r: 4, width: 1.6 }),
        heading(415, 118, 'HANDLER', { font: 'mono', size: 13, tracking: 1.5 }),
      ],
      motion('rise', 200),
    ),
    pulse(299, 88, 16, 900),
    node(299, 88, 5, true),
    group(
      [
        rect(526, 90, 88, 44, { fill: 'brandSoft', r: 5, width: 1.6 }),
        heading(570, 118, 'DB', { font: 'mono', size: 13, tracking: 2 }),
        label(570, 154, 'STATE', { size: 10 }),
      ],
      motion('rise', 400),
    ),
    arrow(
      [
        [88, 112],
        [124, 112],
      ],
      { flow: true, tone: 'brand' },
    ),
    arrow(
      [
        [208, 112],
        [254, 112],
      ],
      { flow: true, tone: 'brand' },
    ),
    arrow(
      [
        [476, 112],
        [526, 112],
      ],
      { flow: true, tone: 'brand' },
    ),
    // Línea de tiempo: la invocación en frío paga INIT; la caliente reutiliza el entorno.
    group(
      [
        line(70, 204, 590, 204, { dash: '2 4', stroke: 'faint', width: 1 }),
        label(40, 262, '#1', { anchor: 'start', tone: 'ink' }),
        ...phase(96, 244, 150, 'INIT', true),
        ...phase(246, 244, 130, 'HANDLER'),
        label(390, 262, 'COLD', { anchor: 'start', tone: 'accent' }),
        label(40, 312, '#2', { anchor: 'start', tone: 'ink' }),
        ...phase(96, 294, 130, 'HANDLER'),
        label(240, 312, 'WARM', { anchor: 'start' }),
      ],
      motion('rise', 600),
    ),
    dimension([96, 230], [246, 230], 'ms', { offset: 10 }),
    dimension([96, 346], [376, 346], 'p99', { offset: -16 }),
    arrow(
      [
        [96, 386],
        [600, 386],
      ],
      { tone: 'muted', width: 1.2 },
    ),
    label(608, 390, 't', { anchor: 'start', tone: 'muted' }),
  );
}
