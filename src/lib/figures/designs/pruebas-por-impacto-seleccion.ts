import { arrow, group, heading, label, line, motion, pulse, rect, figure } from '../figure-kit';
import type { Point } from '../figure-kit';
import type { Figure, FigureLocale, Prim, Tone } from '../figure-types';

type State = 'changed' | 'idle' | 'lit';

const NODE_W = 104;
const NODE_H = 36;

const STYLE: Record<State, Readonly<{ fill: Tone; stroke: Tone; text: Tone }>> = {
  changed: { fill: 'accentSoft', stroke: 'accent', text: 'ink' },
  idle: { fill: 'sunken', stroke: 'faint', text: 'muted' },
  lit: { fill: 'brandSoft', stroke: 'ink', text: 'ink' },
};

const COPY = {
  en: {
    legend: { changed: 'CHANGE', idle: 'SKIPPED', lit: 'RUNS' },
    names: {
      api: 'api',
      catalog: 'catalog',
      orders: 'orders',
      payments: 'payments',
      shared: 'shared',
      ui: 'ui',
    },
    test: 'test',
    title: 'IMPACT',
  },
  es: {
    legend: { changed: 'CAMBIO', idle: 'SE OMITE', lit: 'SE EJECUTA' },
    names: {
      api: 'api',
      catalog: 'catálogo',
      orders: 'pedidos',
      payments: 'pagos',
      shared: 'compartido',
      ui: 'ui',
    },
    test: 'prueba',
    title: 'IMPACTO',
  },
} as const;

type Copy = (typeof COPY)[FigureLocale];
type ModuleKey = keyof Copy['names'];

const MODULES: readonly Readonly<{ key: ModuleKey; x: number; y: number; state: State }>[] = [
  { key: 'shared', state: 'changed', x: 220, y: 110 },
  { key: 'orders', state: 'lit', x: 120, y: 210 },
  { key: 'payments', state: 'lit', x: 320, y: 210 },
  { key: 'api', state: 'lit', x: 220, y: 310 },
  { key: 'catalog', state: 'idle', x: 520, y: 210 },
  { key: 'ui', state: 'idle', x: 520, y: 310 },
];

const TEST_CHIPS: readonly Readonly<{ cx: number; cy: number; state: State; key: ModuleKey }>[] = [
  { cx: 305, cy: 110, key: 'shared', state: 'changed' },
  { cx: 205, cy: 210, key: 'orders', state: 'lit' },
  { cx: 405, cy: 210, key: 'payments', state: 'lit' },
  { cx: 220, cy: 346, key: 'api', state: 'lit' },
  { cx: 605, cy: 210, key: 'catalog', state: 'idle' },
  { cx: 605, cy: 310, key: 'ui', state: 'idle' },
];

// Aristas: las que llevan el cambio se animan; las demás quedan tenues.
const EDGES: readonly Readonly<{ points: readonly Point[]; lit: boolean }>[] = [
  {
    lit: true,
    points: [
      [220, 128],
      [220, 160],
      [120, 160],
      [120, 192],
    ],
  },
  {
    lit: true,
    points: [
      [220, 128],
      [220, 160],
      [320, 160],
      [320, 192],
    ],
  },
  {
    lit: true,
    points: [
      [120, 228],
      [120, 310],
      [168, 310],
    ],
  },
  {
    lit: true,
    points: [
      [320, 228],
      [320, 310],
      [272, 310],
    ],
  },
  {
    lit: false,
    points: [
      [520, 228],
      [520, 292],
    ],
  },
];

function moduleNode(name: string, x: number, y: number, state: State, delay: number): Prim {
  const style = STYLE[state];

  return group(
    [
      rect(x - NODE_W / 2, y - NODE_H / 2, NODE_W, NODE_H, {
        fill: style.fill,
        r: 4,
        stroke: style.stroke,
        width: 1.6,
      }),
      heading(x, y + 5, name, { size: 13, tone: style.text }),
    ],
    motion('rise', delay),
  );
}

function testChip(cx: number, cy: number, text: string, state: State, delay: number): Prim {
  const isIdle = state === 'idle';

  return group(
    [
      rect(cx - 27, cy - 11, 54, 22, {
        fill: 'paper',
        r: 11,
        stroke: isIdle ? 'faint' : 'ink',
        width: 1.2,
      }),
      label(cx, cy + 4, text, { size: 10, tone: isIdle ? 'muted' : 'ink' }),
    ],
    motion('rise', delay),
  );
}

function edge(points: readonly Point[], lit: boolean, delay: number): Prim {
  return group(
    [
      lit
        ? arrow(points, { flow: true, tone: 'ink', width: 1.6 })
        : arrow(points, { dash: '2 4', tone: 'faint', width: 1 }),
    ],
    motion('fade', delay),
  );
}

function legendItem(x: number, state: State, text: string): Prim[] {
  const style = STYLE[state];

  return [
    rect(x, 372, 14, 14, { fill: style.fill, r: 3, stroke: style.stroke, width: 1.4 }),
    label(x + 20, 383, text, { anchor: 'start', size: 11 }),
  ];
}

export function pruebasPorImpactoSeleccion(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    label(44, 56, copy.title, { anchor: 'start', tone: 'ink', tracking: 3 }),
    line(134, 52, 596, 52, { dash: '2 4', stroke: 'muted', width: 1 }),
    // Halo del cambio: va detrás del nodo que lo origina.
    pulse(220, 110, 30, 0),
    EDGES.map((item, index) => edge(item.points, item.lit, 300 + index * 120)),
    MODULES.map((item, index) =>
      moduleNode(copy.names[item.key], item.x, item.y, item.state, 200 + index * 110),
    ),
    TEST_CHIPS.map((item, index) =>
      testChip(item.cx, item.cy, copy.test, item.state, 500 + index * 90),
    ),
    group([
      ...legendItem(44, 'changed', copy.legend.changed),
      ...legendItem(150, 'lit', copy.legend.lit),
      ...legendItem(270, 'idle', copy.legend.idle),
    ]),
  );
}
