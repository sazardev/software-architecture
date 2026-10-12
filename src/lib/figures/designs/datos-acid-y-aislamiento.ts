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
  pulse,
  rect,
} from '../figure-kit';
import type { Figure, Prim } from '../figure-types';

const T1_Y = 124;
const T2_Y = 284;
const ROW_TOP = 182;
const ROW_BOTTOM = 222;

type Lane = Readonly<{ end: number; name: string; start: number; y: number }>;

const lanes: readonly Lane[] = [
  { end: 560, name: 'T1', start: 150, y: T1_Y },
  { end: 420, name: 'T2', start: 222, y: T2_Y },
];

function lane({ end, name, start, y }: Lane, delay: number) {
  return group(
    [
      line(108, y, 604, y, { dash: '2 4', stroke: 'faint', width: 1 }),
      line(start, y, end, y, { width: 1.8 }),
      circle(66, y, 20, { fill: 'paper', width: 1.6 }),
      heading(66, y + 6, name, { font: 'mono', size: 14 }),
      line(end, y - 9, end, y + 9, { width: 2.2 }),
    ],
    motion('rise', delay),
  );
}

function event(x: number, y: number, text: string, isAbove: boolean, isHot = false): Prim[] {
  return [
    node(x, y, 5.5, isHot),
    label(x, isAbove ? y - 26 : y + 26, text, { size: 12, tone: isHot ? 'accent' : 'ink' }),
  ];
}

export function datosAcidYAislamiento(): Figure {
  return figure(
    // Historia de la anomalía en la notación de Berenson et al. (P4).
    label(320, 44, 'r1[x]  r2[x]  w2[x]  c2  w1[x]  c1', { size: 12, tone: 'ink', tracking: 1.2 }),
    label(320, 66, 'P4', { size: 11, tracking: 1 }),
    lanes.map((item, index) => lane(item, 100 + index * 150)),
    // La fila compartida: tres versiones de x a lo largo del tiempo.
    group(
      [
        rect(108, ROW_TOP, 496, ROW_BOTTOM - ROW_TOP, { fill: 'brandSoft', r: 4, width: 1.6 }),
        line(355, ROW_TOP, 355, ROW_BOTTOM, { stroke: 'muted', width: 1 }),
        line(470, ROW_TOP, 470, ROW_BOTTOM, { stroke: 'muted', width: 1 }),
        label(231, 207, 'x = 100', { tone: 'ink' }),
        label(412, 207, 'x = 80', { tone: 'muted' }),
        line(378, 203, 446, 203, { stroke: 'muted', width: 1.2 }),
        label(537, 207, '90 ≠ 70', { tone: 'ink' }),
      ],
      motion('rise', 400),
    ),
    // Lecturas: el dato sube a cada transacción con el mismo valor.
    group(
      [
        arrow(
          [
            [170, ROW_TOP],
            [170, T1_Y + 8],
          ],
          { dash: '3 3', tone: 'muted', width: 1.2 },
        ),
        arrow(
          [
            [240, ROW_BOTTOM],
            [240, T2_Y - 8],
          ],
          { dash: '3 3', tone: 'muted', width: 1.2 },
        ),
        arrow(
          [
            [355, T2_Y - 8],
            [355, ROW_BOTTOM],
          ],
          { width: 1.4 },
        ),
        ...event(170, T1_Y, 'r1[x] = 100', true),
        ...event(240, T2_Y, 'r2[x] = 100', false),
        ...event(355, T2_Y, 'w2[x] = 80', false),
        label(420, T2_Y + 26, 'c2', { tone: 'ink' }),
        label(560, T1_Y - 26, 'c1', { tone: 'ink' }),
      ],
      motion('fade', 600),
    ),
    // El punto de conflicto: T1 escribe desde una lectura vieja y pisa a T2.
    group(
      [
        arrow(
          [
            [470, T1_Y + 8],
            [470, ROW_TOP],
          ],
          { flow: true, width: 1.8 },
        ),
        ...event(470, T1_Y, 'w1[x] = 90', true, true),
      ],
      motion('fade', 900),
    ),
    pulse(470, T1_Y, 18, 1200),
    // Eje temporal.
    arrow(
      [
        [108, 350],
        [604, 350],
      ],
      { tone: 'muted', width: 1.2 },
    ),
    label(616, 355, 't', { anchor: 'start', size: 12 }),
  );
}
