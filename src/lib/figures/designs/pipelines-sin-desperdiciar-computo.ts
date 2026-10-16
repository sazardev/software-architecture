import { circle, group, label, line, motion, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

type Copy = Readonly<{
  branch: string;
  cancelled: string;
  footer: string;
  running: string;
}>;

const COPY: Readonly<Record<FigureLocale, Copy>> = {
  en: {
    branch: 'BRANCH feature/payments',
    cancelled: 'CANCELLED',
    footer: 'ONLY THE LATEST RUN MATTERS',
    running: 'RUNNING',
  },
  es: {
    branch: 'RAMA feature/pagos',
    cancelled: 'CANCELADA',
    footer: 'SOLO IMPORTA LA ÚLTIMA EJECUCIÓN',
    running: 'EN CURSO',
  },
};

const ROW_X = 150;
const ROW_W = 360;
const ROW_H = 36;
const ROW_TOPS = [116, 166, 216, 266] as const;
const DOT_X = 110;
const TEXT_RIGHT = ROW_X + ROW_W - 36;

function middle(top: number): number {
  return top + ROW_H / 2;
}

/**
Ejecución obsoleta: contorno discontinuo, cruz y estado apagado.
*/
function staleRun(top: number, n: number, copy: Copy, delay: number) {
  const mid = middle(top);
  const crossX = TEXT_RIGHT - 130;

  return group(
    [
      rect(ROW_X, top, ROW_W, ROW_H, { dash: '4 4', fill: 'sunken', r: 6, stroke: 'faint' }),
      circle(DOT_X, mid, 5, { fill: 'paper', stroke: 'muted', width: 1.2 }),
      label(ROW_X + 22, mid + 4, `#${n}`, { anchor: 'start', size: 12, tone: 'muted' }),
      line(crossX - 5, mid - 5, crossX + 5, mid + 5, { stroke: 'muted', width: 1.4 }),
      line(crossX - 5, mid + 5, crossX + 5, mid - 5, { stroke: 'muted', width: 1.4 }),
      label(TEXT_RIGHT, mid + 4, copy.cancelled, { anchor: 'end', size: 11, tone: 'muted' }),
    ],
    motion('rise', delay),
  );
}

/**
Ejecución vigente: la única que sigue consumiendo cómputo, con el acento.
*/
function activeRun(top: number, n: number, copy: Copy, delay: number) {
  const mid = middle(top);

  return group(
    [
      rect(ROW_X, top, ROW_W, ROW_H, { fill: 'accentSoft', r: 6, stroke: 'accent', width: 2 }),
      circle(DOT_X, mid, 5, { fill: 'accent' }),
      label(ROW_X + 22, mid + 4, `#${n}`, { anchor: 'start', size: 12, tone: 'ink' }),
      label(TEXT_RIGHT, mid + 4, copy.running, { anchor: 'end', size: 11, tone: 'accent' }),
    ],
    motion('rise', delay),
  );
}

export function pipelinesSinDesperdiciarComputo(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];
  const first = ROW_TOPS[0];
  const last = ROW_TOPS.at(-1) ?? first;

  return [
    label(44, 84, copy.branch, { anchor: 'start', size: 11, tone: 'ink', tracking: 3 }),
    line(44 + 218, 80, 596, 80, { dash: '2 4', stroke: 'muted', width: 1 }),
    // Tronco de commits: une las ejecuciones en el orden en que llegaron.
    line(DOT_X, middle(first), DOT_X, middle(last), { stroke: 'faint', width: 1.2 }),
    staleRun(ROW_TOPS[0], 1, copy, 200),
    staleRun(ROW_TOPS[1], 2, copy, 340),
    staleRun(ROW_TOPS[2], 3, copy, 480),
    activeRun(last, 4, copy, 620),
    pulse(DOT_X, middle(last), 12, 800),
    label(320, 350, copy.footer, { size: 11, tone: 'muted' }),
  ];
}
