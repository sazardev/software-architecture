import { arrow, figure, group, heading, label, line, motion, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const LEFT = 44;
const RIGHT = 596;
const LANE_X = 136;
const LANE_END = 548;
const LANE_TOP = 158;
const LANE_BOTTOM = 222;
const CARD_Y = 170;
const CARD_W = 52;
const CARD_H = 44;

const TEXT: Record<
  FigureLocale,
  Readonly<{
    caption: string;
    fails: string;
    future: string;
    main: string;
    queue: string;
    rebuilt: string;
  }>
> = {
  en: {
    caption: 'EACH CHANGE IS TESTED ON THE MAIN IT WILL HAVE',
    fails: 'FAILS: LEAVES THE QUEUE',
    future: 'FUTURE MAIN',
    main: 'MAIN',
    queue: 'MERGE QUEUE',
    rebuilt: 'THE REST REBUILD WITHOUT IT',
  },
  es: {
    caption: 'CADA CAMBIO SE PRUEBA SOBRE EL MAIN QUE TENDRÁ',
    fails: 'FALLA: SALE DE LA FILA',
    future: 'MAIN FUTURO',
    main: 'MAIN',
    queue: 'COLA DE FUSIÓN',
    rebuilt: 'LOS DEMÁS SE RECONSTRUYEN SIN ÉL',
  },
};

const CARDS = [
  { name: 'A', x: 160, failed: false, passed: true },
  { name: 'B', x: 236, failed: false, passed: true },
  { name: 'C', x: 312, failed: true, passed: false },
  { name: 'D', x: 388, failed: false, passed: false },
  { name: 'E', x: 464, failed: false, passed: false },
] as const;

function card(name: string, x: number, index: number, failed: boolean) {
  const center = x + CARD_W / 2;

  return group(
    [
      rect(x, CARD_Y, CARD_W, CARD_H, {
        fill: failed ? 'accentSoft' : 'paper',
        r: 4,
        stroke: failed ? 'accent' : 'ink',
        width: failed ? 2 : 1.5,
      }),
      heading(center, CARD_Y + 28, name, { size: 16, tone: failed ? 'accent' : 'ink' }),
    ],
    motion('rise', 200 + index * 120),
  );
}

/**
Cola de fusión: cada cambio se prueba sobre el main que tendrá; el que falla sale de la fila.
*/
export function colasDeFusionMainVerde(locale: FigureLocale = 'es'): Figure {
  const text = TEXT[locale];
  const failing = CARDS.find((item) => item.failed);
  const failX = failing === undefined ? 0 : failing.x + CARD_W / 2;

  return figure(
    label(LEFT, 84, text.queue, { anchor: 'start', tone: 'ink', tracking: 3 }),
    line(200, 80, RIGHT, 80, { dash: '2 4', stroke: 'muted', width: 1 }),

    // Carril por el que avanzan los cambios hacia main.
    rect(LANE_X, LANE_TOP, LANE_END - LANE_X, LANE_BOTTOM - LANE_TOP, {
      fill: 'sunken',
      r: 0,
      stroke: undefined,
    }),
    line(LANE_X, LANE_TOP, LANE_END, LANE_TOP, { stroke: 'muted', width: 1.6 }),
    line(LANE_X, LANE_BOTTOM, LANE_END, LANE_BOTTOM, { stroke: 'muted', width: 1.6 }),

    // Main actual y main futuro, a cada extremo del carril.
    rect(LEFT, LANE_TOP, 84, LANE_BOTTOM - LANE_TOP, { fill: 'brandSoft', r: 3, width: 1.6 }),
    label(LEFT + 42, 196, text.main, { size: 12, tone: 'ink' }),
    arrow(
      [
        [128, 190],
        [150, 190],
      ],
      { flow: true, tone: 'accent', width: 2 },
    ),
    arrow(
      [
        [520, 190],
        [552, 190],
      ],
      { flow: true, tone: 'accent', width: 2 },
    ),
    rect(556, LANE_TOP, 40, LANE_BOTTOM - LANE_TOP, { fill: 'paper', r: 3, width: 1.6 }),
    label(576, 244, text.future, { size: 10, tone: 'muted' }),

    // Pulso sobre el cambio que falla: es la idea clave de la figura.
    pulse(failX, CARD_Y + CARD_H / 2, 34, 800),

    CARDS.map((item, index) => card(item.name, item.x, index, item.failed)),

    CARDS.filter((item) => item.passed).map((item) =>
      label(item.x + CARD_W / 2, 240, 'OK', { size: 10, tone: 'muted' }),
    ),

    // El cambio que falla sale de la fila y el resto se reconstruye sin él.
    group(
      [
        arrow(
          [
            [failX, LANE_BOTTOM + 12],
            [failX, 288],
          ],
          { dash: '4 4', tone: 'accent', width: 1.5 },
        ),
        label(failX, 306, text.fails, { size: 11, tone: 'accent' }),
      ],
      motion('fade', 1000),
    ),
    label(362, 262, text.rebuilt, { anchor: 'start', size: 10, tone: 'muted' }),

    label(320, 362, text.caption, { size: 10.5, tone: 'muted' }),
  );
}
