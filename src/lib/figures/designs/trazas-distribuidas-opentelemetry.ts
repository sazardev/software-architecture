import { circle, figure, group, heading, label, line, motion, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale, GroupPrim } from '../figure-types';

const TRACE_ID = '0af7651916cd43dd8448eb211c80319c';
const BAR_HEIGHT = 26;
const START_X = 170;
const END_X = 560;

const TEXT = {
  es: {
    title: 'Una petición, un mismo hilo',
    traceLabel: `trace-id ${TRACE_ID}`,
    slow: 'LENTO',
    footer: 'MISMO trace-id EN CADA TRAMO',
    start: 'INICIO',
    end: 'FIN',
    names: ['GATEWAY', 'PEDIDOS', 'STOCK', 'PAGOS'],
  },
  en: {
    title: 'One request, one thread',
    traceLabel: `trace-id ${TRACE_ID}`,
    slow: 'SLOW',
    footer: 'SAME trace-id ON EVERY SPAN',
    start: 'START',
    end: 'END',
    names: ['GATEWAY', 'ORDERS', 'STOCK', 'PAYMENTS'],
  },
} as const;

// Tramos anidados: cada fila es un span; el padre abarca a sus hijos.
const SPANS = [
  { x1: START_X, x2: END_X, y: 124, parentY: null },
  { x1: 190, x2: 500, y: 176, parentY: 124 },
  { x1: 210, x2: 290, y: 228, parentY: 176 },
  { x1: 318, x2: 520, y: 280, parentY: 176, slow: true },
] as const;

function span(
  name: string,
  item: (typeof SPANS)[number],
  index: number,
  slowLabel: string,
): GroupPrim {
  const isSlow = 'slow' in item && item.slow;
  const width = item.x2 - item.x1;

  return group(
    [
      rect(item.x1, item.y - BAR_HEIGHT / 2, width, BAR_HEIGHT, {
        fill: isSlow ? 'accent' : 'brandSoft',
        r: 3,
        stroke: isSlow ? 'accent' : 'ink',
        width: 1.3,
      }),
      label(44, item.y + 4, name, { anchor: 'start', size: 11, tone: isSlow ? 'accent' : 'ink' }),
      ...(isSlow
        ? [
            label(item.x2 + 22, item.y + 4, slowLabel, {
              anchor: 'start',
              size: 10.5,
              tone: 'accent',
            }),
          ]
        : []),
    ],
    motion('rise', 300 + index * 180),
  );
}

export function trazasDistribuidasOpentelemetry(locale: FigureLocale = 'es'): Figure {
  const text = TEXT[locale];

  return figure(
    heading(44, 66, text.title, { anchor: 'start', size: 16 }),
    label(44, 88, text.traceLabel, { anchor: 'start', size: 10, tone: 'muted' }),
    // Relación padre-hijo: guía vertical desde el inicio de cada padre.
    SPANS.flatMap((item) =>
      item.parentY === null
        ? []
        : [
            line(item.x1, item.parentY + BAR_HEIGHT / 2, item.x1, item.y - BAR_HEIGHT / 2, {
              dash: '2 4',
              stroke: 'muted',
              width: 1,
            }),
          ],
    ),
    SPANS.map((item, index) => span(text.names[index] ?? '', item, index, text.slow)),
    // Pulso sobre el final del tramo lento.
    pulse(520, 280, 10, 1000),
    circle(520, 280, 4, { fill: 'paper', stroke: 'accent', width: 1.4 }),
    // Eje temporal.
    line(START_X, 330, END_X, 330, { stroke: 'faint', width: 1 }),
    label(START_X, 348, text.start, { anchor: 'start', size: 10, tone: 'muted' }),
    label(END_X, 348, text.end, { anchor: 'end', size: 10, tone: 'muted' }),
    label(320, 380, text.footer, { size: 10.5, tone: 'ink' }),
  );
}
