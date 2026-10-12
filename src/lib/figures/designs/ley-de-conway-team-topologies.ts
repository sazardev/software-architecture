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
import type { Figure, Prim } from '../figure-types';

const BOX_W = 72;
const BOX_TOP = 140;
const BOX_H = 64;
const ARC_Y = BOX_TOP + BOX_H + 2;

// El sistema es el reflejo del organigrama: el orden se invierte al otro lado del espejo.
const teams = [
  { cx: 70, name: 'A' },
  { cx: 160, name: 'B' },
  { cx: 250, name: 'C' },
] as const;

const modules = [
  { cx: 390, name: 'C' },
  { cx: 480, name: 'B' },
  { cx: 570, name: 'A' },
] as const;

function tree(rootX: number, xs: readonly number[], title: string): Prim[] {
  const [first = rootX, , last = rootX] = xs;

  return [
    rect(rootX - 50, 40, 100, 36, { fill: 'brandSoft', r: 5, width: 1.6 }),
    heading(rootX, 63, title, { font: 'mono', size: 13, tracking: 2.4 }),
    path(`M${rootX} 76V108M${first} 108H${last}${drops(xs)}`, {
      stroke: 'muted',
      width: 1.3,
    }),
  ];
}

function team(cx: number, name: string): Prim[] {
  return [
    rect(cx - BOX_W / 2, BOX_TOP, BOX_W, BOX_H, { fill: 'paper', r: 6, width: 1.6 }),
    ...[-16, 0, 16].map((dx) => circle(cx + dx, 162, 5, { fill: 'brandSoft', width: 1.3 })),
    heading(cx, 194, name, { size: 17 }),
  ];
}

function moduleBox(cx: number, name: string): Prim[] {
  return [
    rect(cx - BOX_W / 2, BOX_TOP, BOX_W, BOX_H, { fill: 'paper', r: 2, width: 1.6 }),
    line(cx - 22, 156, cx + 14, 156, { stroke: 'brand', width: 1.4 }),
    line(cx - 22, 166, cx + 4, 166, { stroke: 'brand', width: 1.4 }),
    heading(cx, 194, name, { font: 'mono', size: 15 }),
  ];
}

// Trazos verticales que bajan desde el travesaño hasta cada caja.
function drops(xs: readonly number[]): string {
  return xs.map((x) => `M${x} 108V${BOX_TOP}`).join('');
}

// Arco de comunicación (equipos) o de interfaz (módulos) entre dos cajas vecinas.
function arc(from: number, to: number, depth: number, paint: Parameters<typeof path>[1] = {}) {
  return path(`M${from} ${ARC_Y}Q${(from + to) / 2} ${ARC_Y + depth} ${to} ${ARC_Y}`, paint);
}

export function leyDeConwayTeamTopologies(): Figure {
  const teamCenters = teams.map((item) => item.cx);
  const moduleCenters = modules.map((item) => item.cx);

  return figure(
    // El espejo: la ley de Conway refleja la organización en el sistema.
    line(320, 24, 320, 330, { stroke: 'faint', width: 1.2 }),
    line(320, 24, 320, 330, { dash: '5 7', motion: motion('flow'), stroke: 'muted', width: 1.2 }),
    group(
      [...tree(160, teamCenters, 'ORG'), ...teams.flatMap((item) => team(item.cx, item.name))],
      motion('rise'),
    ),
    group(
      [
        ...tree(480, moduleCenters, 'SYS'),
        ...modules.flatMap((item) => moduleBox(item.cx, item.name)),
      ],
      motion('rise', 250),
    ),
    // Comunicación entre equipos: A–B una vía, B–C dos (dos reuniones por cada cambio).
    group(
      [
        arc(70, 160, 46, { stroke: 'ink', width: 1.4 }),
        arc(160, 250, 46, { stroke: 'ink', width: 1.4 }),
        arc(160, 250, 72, { dash: '4 4', stroke: 'ink', width: 1.4 }),
        label(205, 274, '×2', { size: 12, tone: 'ink' }),
      ],
      motion('fade', 500),
    ),
    // Su reflejo: la frontera B–C del sistema duplica la interfaz. Es el único acento.
    group(
      [
        arc(480, 570, 46, { stroke: 'ink', width: 1.4 }),
        arc(390, 480, 46, { stroke: 'accent', width: 2 }),
        arc(390, 480, 72, { dash: '4 4', stroke: 'accent', width: 2 }),
        label(435, 274, '×2', { size: 12, tone: 'accent' }),
      ],
      motion('fade', 700),
    ),
    pulse(435, 241, 16, 1000),
    // El reflejo: lo que se duplica en la organización reaparece en el sistema.
    group(
      [
        arrow(
          [
            [205, 288],
            [205, 308],
            [435, 308],
            [435, 290],
          ],
          { dash: '4 4', tone: 'muted', width: 1.2 },
        ),
      ],
      motion('fade', 1100),
    ),
    label(320, 360, 'CONWAY · 1968', { size: 11, tone: 'ink', tracking: 3 }),
  );
}
