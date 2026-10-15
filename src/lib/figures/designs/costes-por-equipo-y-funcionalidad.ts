import {
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
import type { Figure, FigureLocale, Tone } from '../figure-types';

// Un gasto total repartido en bloques por equipo. La línea de alerta se enciende antes del límite.
const X0 = 60;
const WIDTH = 520;
const TOP = 170;
const HEIGHT = 44;
const BOTTOM = TOP + HEIGHT;
const ALERT_SHARE = 0.8;

const xAt = (share: number): number => X0 + WIDTH * share;

type Block = Readonly<{
  amount: string;
  from: number;
  name: Readonly<Record<FigureLocale, string>>;
  to: number;
  tone: Tone;
}>;

const BLOCKS: readonly Block[] = [
  { amount: '30 %', from: 0, name: { en: 'Team A', es: 'Equipo A' }, to: 0.3, tone: 'brandSoft' },
  { amount: '24 %', from: 0.3, name: { en: 'Team B', es: 'Equipo B' }, to: 0.54, tone: 'sunken' },
  {
    amount: '18 %',
    from: 0.54,
    name: { en: 'Team C', es: 'Equipo C' },
    to: 0.72,
    tone: 'brandMid',
  },
  { amount: '12 %', from: 0.72, name: { en: 'Shared', es: 'Común' }, to: 0.84, tone: 'faint' },
];

const TEXT: Readonly<
  Record<
    FigureLocale,
    Readonly<{
      alert: string;
      budget: string;
      limit: string;
      margin: string;
      row: readonly [string, string, string];
      title: string;
    }>
  >
> = {
  en: {
    alert: 'alert 80 %',
    budget: 'monthly budget',
    limit: 'limit',
    margin: '20 %',
    row: ['tag → owner', 'shared → split rule', 'threshold → early warning'],
    title: 'One bill, many owners',
  },
  es: {
    alert: 'alerta 80 %',
    budget: 'presupuesto mensual',
    limit: 'límite',
    margin: '20 %',
    row: ['etiqueta → dueño', 'común → regla de reparto', 'umbral → aviso previo'],
    title: 'Un gasto, muchos dueños',
  },
};

function block({ amount, from, name, to, tone }: Block, locale: FigureLocale, index: number) {
  const x = xAt(from);
  const w = xAt(to) - x;
  const center = x + w / 2;
  const delay = 200 + index * 150;

  return group(
    [
      rect(x, TOP, w, HEIGHT, { fill: tone, r: 0, stroke: 'ink', width: 1.2 }),
      heading(center, TOP + HEIGHT / 2 + 5, amount, { size: 14, tone: 'ink' }),
      label(center, BOTTOM + 20, name[locale], { size: 10.5, tone: 'muted' }),
    ],
    motion('rise', delay),
  );
}

function limitMark(x: number, text: string) {
  return group(
    [
      line(x, TOP - 12, x, BOTTOM + 12, { stroke: 'ink', width: 1.8 }),
      label(x, TOP - 22, text, { size: 11, tone: 'ink' }),
    ],
    motion('fade', 900),
  );
}

export function costesPorEquipoYFuncionalidad(locale: FigureLocale = 'es'): Figure {
  const text = TEXT[locale];
  const alertX = xAt(ALERT_SHARE);
  const spentEnd = xAt(BLOCKS.at(-1)?.to ?? 0);

  return figure(
    heading(320, 92, text.title, { size: 20, tone: 'ink' }),
    label(X0, TOP - 16, text.budget, { anchor: 'start', size: 11, tone: 'muted' }),
    // Bloques por equipo: el gasto ocupa el presupuesto de izquierda a derecha.
    BLOCKS.map((item, index) => block(item, locale, index)),
    // Margen sin gastar: la zona punteada que queda antes del límite.
    rect(spentEnd, TOP, xAt(1) - spentEnd, HEIGHT, {
      dash: '4 4',
      r: 0,
      stroke: 'muted',
      width: 1,
    }),
    // Límite del presupuesto.
    limitMark(xAt(1), text.limit),
    // Umbral de alerta: se enciende antes de agotar el presupuesto.
    group(
      [
        line(alertX, TOP - 34, alertX, TOP - 2, {
          dash: '5 7',
          stroke: 'accent',
          width: 1.6,
        }),
        pulse(alertX, TOP - 34, 10, 1100),
        node(alertX, TOP - 34, 4.5, true),
        label(alertX, TOP - 50, text.alert, { size: 12, tone: 'accent' }),
      ],
      motion('draw', 700),
    ),
    // Cota del margen entre el umbral y el límite.
    dimension([alertX, BOTTOM + 66], [xAt(1), BOTTOM + 66], text.margin, { offset: 12 }),
    // Pie: las tres piezas del modelo, cada una con su regla.
    group(
      [
        line(X0, 318, X0 + WIDTH, 318, { stroke: 'faint', width: 1 }),
        label(X0 + WIDTH / 6, 344, text.row[0], { size: 10.5, tone: 'ink' }),
        label(X0 + WIDTH / 2, 344, text.row[1], { size: 10.5, tone: 'ink' }),
        label(X0 + (5 * WIDTH) / 6, 344, text.row[2], { size: 10.5, tone: 'ink' }),
      ],
      motion('fade', 1300),
    ),
  );
}
