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

const PANEL_TOP = 118;
const PANEL_H = 150;
const PANEL_W = 156;
const MID = PANEL_TOP + PANEL_H / 2;
const STRIP_Y = PANEL_TOP + 66;
const ISLAND_Y = PANEL_TOP + 110;
const PANELS_X = [44, 242, 440] as const;
const BOTTOM = PANEL_TOP + PANEL_H;

type Copy = Readonly<{
  browser: string;
  built: string;
  data: string;
  island: string;
  regen: string;
  request: string;
  send: string;
  server: string;
  title: string;
}>;

const copy: Record<FigureLocale, Copy> = {
  en: {
    browser: 'BROWSER',
    built: 'BUILT',
    data: 'DATA',
    island: 'ISLAND',
    regen: 'REGENERATES IN THE BACKGROUND',
    request: 'REQUEST',
    send: 'HTML',
    server: 'SERVER',
    title: 'SAME PAGE, THREE MOMENTS',
  },
  es: {
    browser: 'NAVEGADOR',
    built: 'CONSTRUIDA',
    data: 'DATOS',
    island: 'ISLA',
    regen: 'SE REGENERA EN SEGUNDO PLANO',
    request: 'PETICIÓN',
    send: 'HTML',
    server: 'SERVIDOR',
    title: 'MISMA PÁGINA, TRES MOMENTOS',
  },
};

type Kind = 'browser' | 'built' | 'server';

function lines(x: number) {
  return [
    line(x + 14, PANEL_TOP + 42, x + PANEL_W - 14, PANEL_TOP + 42, { stroke: 'faint', width: 2 }),
    line(x + 14, PANEL_TOP + 52, x + PANEL_W - 56, PANEL_TOP + 52, { stroke: 'faint', width: 2 }),
  ];
}

function strip(x: number, isFresh: boolean, text: string) {
  return group([
    rect(
      x + 14,
      STRIP_Y,
      PANEL_W - 28,
      26,
      isFresh
        ? { fill: 'accentSoft', r: 2, stroke: 'accent', width: 1.4 }
        : { fill: 'sunken', r: 2, stroke: 'faint', width: 1 },
    ),
    label(x + PANEL_W / 2, STRIP_Y + 17, text, { size: 10, tone: isFresh ? 'accent' : 'muted' }),
  ]);
}

function islandRow(x: number, hasIslands: boolean, islandText: string) {
  const staticBlock = { fill: 'sunken', r: 2, stroke: 'faint', width: 1 } as const;

  if (!hasIslands) {
    return group([rect(x + 14, ISLAND_Y, PANEL_W - 28, 22, staticBlock)]);
  }

  const islandBlock = { fill: 'brandSoft', r: 2, stroke: 'brand', width: 1.2 } as const;

  return group([
    rect(x + 14, ISLAND_Y, 44, 22, islandBlock),
    label(x + 36, ISLAND_Y + 15, islandText, { size: 9, tone: 'ink' }),
    rect(x + 64, ISLAND_Y, 36, 22, islandBlock),
    rect(x + 106, ISLAND_Y, PANEL_W - 120, 22, staticBlock),
  ]);
}

function panel(x: number, title: string, kind: Kind, stripText: string, delay: number, t: Copy) {
  return group(
    [
      rect(x, PANEL_TOP, PANEL_W, PANEL_H, { fill: 'paper', r: 3, width: 1.5 }),
      label(x + 14, PANEL_TOP + 22, title, { anchor: 'start', size: 10.5, tone: 'ink' }),
      ...lines(x),
      strip(x, kind !== 'built', stripText),
      islandRow(x, kind === 'browser', t.island),
    ],
    motion('rise', delay),
  );
}

function hop(from: number, to: number, text: string, delay: number) {
  const gapCenter = (from + PANEL_W + to) / 2;

  return group(
    [
      arrow(
        [
          [from + PANEL_W + 6, MID],
          [to - 6, MID],
        ],
        { flow: true, width: 1.6 },
      ),
      label(gapCenter, PANEL_TOP - 14, text, { size: 9.5 }),
    ],
    motion('fade', delay),
  );
}

function regenerationLoop(t: Copy) {
  const fromX = PANELS_X[1] + PANEL_W / 2;
  const toX = PANELS_X[0] + PANEL_W / 2;
  const d = `M${fromX} ${BOTTOM + 4}C${fromX} ${BOTTOM + 64} ${toX} ${BOTTOM + 64} ${toX} ${BOTTOM + 4}`;

  return group([
    path(d, { dash: '4 4', stroke: 'muted', width: 1.4 }),
    path(d, { dash: '5 7', motion: motion('flow'), stroke: 'accent', width: 1.9 }),
    arrow(
      [
        [toX, BOTTOM + 30],
        [toX, BOTTOM + 4],
      ],
      { tone: 'muted' },
    ),
    label((fromX + toX) / 2, BOTTOM + 60, t.regen, { size: 9.5 }),
  ]);
}

export function renderizadoWebSsrSsgIslands(locale: FigureLocale = 'es'): Figure {
  const t = copy[locale];
  const [builtX, serverX, browserX] = PANELS_X;

  return figure(
    label(44, 62, t.title, { anchor: 'start', tone: 'ink', tracking: 3 }),
    line(340, 58, 596, 58, { dash: '2 4', stroke: 'muted', width: 1 }),
    panel(builtX, t.built, 'built', `${t.data} v1`, 200, t),
    panel(serverX, t.server, 'server', `${t.data} v2`, 400, t),
    panel(browserX, t.browser, 'browser', `${t.data} v2`, 600, t),
    hop(builtX, serverX, t.request, 300),
    hop(serverX, browserX, t.send, 500),
    circle(serverX + PANEL_W - 18, STRIP_Y + 13, 4, { fill: 'accent', stroke: undefined }),
    pulse(serverX + PANEL_W - 18, STRIP_Y + 13, 8, 600),
    regenerationLoop(t),
  );
}
