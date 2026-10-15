import {
  arrow,
  circle,
  figure,
  group,
  label,
  line,
  motion,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const GATE_X = 300;
const GATE_TOP = 116;
const GATE_BOTTOM = 302;
const GATE_MID = (GATE_TOP + GATE_BOTTOM) / 2;
const MERGE_X = 494;
const BASELINE = 352;

const changes = [
  { id: 'PR 214', y: 130 },
  { id: 'PR 215', y: 176 },
  { id: 'PR 216', y: 222 },
  { id: 'PR 217', y: 268 },
] as const;

const debtColumns = [
  { h: 14, x: 420 },
  { h: 26, x: 456 },
  { h: 38, x: 492 },
  { h: 50, x: 528 },
] as const;

const COPY = {
  en: {
    debt: 'DEBT',
    header: 'GENERATED CHANGES',
    leak: 'WITHOUT DEEP REVIEW',
    merge: 'MAIN',
    review: 'REVIEW',
  },
  es: {
    debt: 'DEUDA',
    header: 'CAMBIOS GENERADOS',
    leak: 'SIN REVISIÓN PROFUNDA',
    merge: 'MAIN',
    review: 'REVISIÓN',
  },
} as const;

function change(id: string, y: number, index: number) {
  return group(
    [
      rect(60, y, 110, 34, { fill: 'paper', r: 3, width: 1.5 }),
      label(115, y + 21, id, { size: 11, tone: 'ink' }),
      line(170, y + 17, 296, y + 17, { dash: '2 4', stroke: 'faint', width: 1 }),
    ],
    motion('rise', 200 + index * 120),
  );
}

function debtColumn(x: number, h: number, index: number) {
  return group(
    [rect(x, BASELINE - h, 30, h, { fill: 'brandSoft', r: 2, width: 1.4 })],
    motion('rise', 1200 + index * 150),
  );
}

/**
Los cambios generados entran en un flujo. Los que pasan la revisión llegan a la rama principal;
los que se saltan la revisión profunda se acumulan como deuda, aunque el pipeline esté verde.
*/
export function codigoGeneradoPorIa(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    label(60, 84, copy.header, { anchor: 'start', tone: 'ink', tracking: 3 }),
    line(272, 80, 596, 80, { dash: '2 4', stroke: 'muted', width: 1 }),
    changes.map((item, index) => change(item.id, item.y, index)),
    // Filtro de revisión: el único punto de control que el equipo decide.
    group(
      [
        rect(GATE_X, GATE_TOP, 14, GATE_BOTTOM - GATE_TOP, {
          fill: 'brandSoft',
          r: 3,
          width: 1.6,
        }),
        circle(GATE_X + 7, GATE_MID, 11, { fill: 'paper', width: 1.6 }),
        path(`M${GATE_X + 3.5} ${GATE_MID}l2.6 2.8l4.8-5.6`, { stroke: 'accent', width: 2 }),
        label(GATE_X + 7, GATE_TOP - 14, copy.review, { size: 11.5, tone: 'ink' }),
      ],
      motion('rise', 300),
    ),
    pulse(GATE_X + 7, GATE_MID, 26, 900),
    // Lo que pasa la revisión llega a la rama principal.
    group(
      [
        arrow(
          [
            [GATE_X + 16, GATE_MID],
            [MERGE_X - 18, GATE_MID],
          ],
          { flow: true, tone: 'ink', width: 2 },
        ),
        circle(MERGE_X, GATE_MID, 14, { fill: 'paper', width: 1.8 }),
        label(MERGE_X, GATE_MID + 34, copy.merge, { size: 11, tone: 'ink' }),
      ],
      motion('fade', 600),
    ),
    // Lo que se salta la revisión baja por debajo y no vuelve atrás.
    group(
      [
        arrow(
          [
            [115, 302],
            [115, BASELINE],
            [414, BASELINE],
          ],
          { dash: '4 4', tone: 'muted', width: 1.4 },
        ),
        label(250, 340, copy.leak, { size: 10 }),
      ],
      motion('fade', 1000),
    ),
    group(
      [
        line(414, BASELINE, 572, BASELINE, { stroke: 'ink', width: 1.4 }),
        ...debtColumns.map((column, index) => debtColumn(column.x, column.h, index)),
        label(495, 290, copy.debt, { size: 11, tone: 'ink' }),
      ],
      motion('rise', 1100),
    ),
  );
}
