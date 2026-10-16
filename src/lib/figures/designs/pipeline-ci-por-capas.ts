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
import type { Figure, FigureLocale } from '../figure-types';

const BASE = 300;
const WIDTH = 100;

// Cada capa es más alta que la anterior: crece el coste y el tiempo.
const layers = [
  { x: 70, height: 44 },
  { x: 210, height: 86 },
  { x: 350, height: 128 },
  { x: 490, height: 170 },
] as const;

// Compuertas entre capas: el punto medio de cada hueco.
const gates = [190, 330, 470] as const;

const texts = {
  es: {
    title: 'PIPELINE',
    layer: 'CAPA',
    names: ['FORMATO', 'UNIDAD', 'INTEGRACIÓN', 'SISTEMA'],
    triggers: ['CADA CAMBIO', 'CADA CAMBIO', 'EN FUSIÓN', 'NOCTURNO'],
    fail: 'FALLO: SE DETIENE',
    skipped: 'CAPAS 1–3: NO SE EJECUTAN',
    cost: 'COSTE Y TIEMPO CRECIENTES',
  },
  en: {
    title: 'PIPELINE',
    layer: 'LAYER',
    names: ['FORMAT', 'UNIT', 'INTEGRATION', 'SYSTEM'],
    triggers: ['EVERY CHANGE', 'EVERY CHANGE', 'ON MERGE', 'NIGHTLY'],
    fail: 'FAILS: STOPS HERE',
    skipped: 'LAYERS 1–3: NOT RUN',
    cost: 'COST AND TIME RISE',
  },
} as const;

export function pipelineCiPorCapas(locale: FigureLocale = 'es'): Figure {
  const t = texts[locale];

  const blocks = layers.map((layer, index) => {
    const top = BASE - layer.height;
    const isFirst = index === 0;

    return group(
      [
        rect(layer.x, top, WIDTH, layer.height, {
          fill: isFirst ? 'brandSoft' : 'sunken',
          opacity: isFirst ? 1 : 0.5,
          r: 3,
          width: 1.6,
        }),
        label(layer.x + WIDTH / 2, BASE + 22, `${t.layer} ${index}`, {
          size: 10,
          tone: isFirst ? 'ink' : 'faint',
        }),
        label(layer.x + WIDTH / 2, BASE + 38, t.names[index], { size: 10 }),
        label(layer.x + WIDTH / 2, BASE + 54, t.triggers[index], { size: 9 }),
      ],
      motion('rise', 150 + index * 120),
    );
  });

  const gateMarks = gates.map((gx, index) => {
    const isFail = index === 0;

    return group(
      [
        line(gx, 150, gx, BASE, { dash: '2 3', stroke: 'faint', width: 1 }),
        circle(gx, 230, 11, { fill: 'paper', stroke: isFail ? 'accent' : 'ink', width: 1.6 }),
        isFail
          ? path('M185.5 225.5l9 9M194.5 225.5l-9 9', { stroke: 'accent', width: 2 })
          : path(`M${gx - 4} 230l3 3l6-6`, { stroke: 'ink', width: 2 }),
      ],
      motion('fade', 600 + index * 120),
    );
  });

  return figure(
    label(70, 84, t.title, { anchor: 'start', tone: 'ink', tracking: 3 }),
    line(148, 80, 590, 80, { dash: '2 4', stroke: 'muted', width: 1 }),

    blocks,
    gateMarks,

    // Cambio que entra por la primera capa y se detiene en la compuerta.
    group(
      [
        circle(34, 280, 12, { fill: 'paper', width: 1.6 }),
        heading(34, 285, 'C', { size: 14 }),
        arrow(
          [
            [50, 280],
            [178, 280],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
      ],
      motion('fade', 100),
    ),
    pulse(190, 230, 22, 900),

    label(190, 150, t.fail, { size: 10, tone: 'accent' }),
    line(190, 160, 190, 216, { stroke: 'accent', width: 1 }),

    label(400, 112, t.skipped, { size: 10, tone: 'muted' }),

    arrow(
      [
        [70, 346],
        [590, 346],
      ],
      { tone: 'muted', width: 1.2 },
    ),
    label(330, 368, t.cost, { size: 10, tone: 'muted' }),
  );
}
