import {
  arrowHead,
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

const CORE = { x: 56, y: 150, w: 136, h: 100 };
const CONSUMER_X = 430;
const CONSUMER_W = 150;
const CONSUMER_H = 56;
const TOPS = [58, 172, 286] as const;

const TEXT = {
  es: {
    core: 'NÚCLEO',
    header: 'ORIGEN COMPARTIDO',
    fork: 'COPIA',
    footer: 'DERIVA: COPIA SIN DUEÑO',
  },
  en: {
    core: 'CORE',
    header: 'SHARED ORIGIN',
    fork: 'FORK',
    footer: 'DRIFT: COPY WITHOUT AN OWNER',
  },
} as const;

function consumer(name: string, top: number, version: string, isFork: boolean, delay: number) {
  const center = top + CONSUMER_H / 2;

  return group(
    [
      rect(CONSUMER_X, top, CONSUMER_W, CONSUMER_H, {
        dash: isFork ? '4 4' : undefined,
        fill: isFork ? 'accentSoft' : 'paper',
        r: 4,
        stroke: isFork ? 'accent' : 'ink',
        width: 1.5,
      }),
      label(CONSUMER_X + 22, center + 4, name, { anchor: 'start', size: 11, tone: 'ink' }),
      label(CONSUMER_X + CONSUMER_W - 18, center + 4, version, {
        anchor: 'end',
        size: 11,
        tone: isFork ? 'accent' : 'muted',
      }),
    ],
    motion('rise', delay),
  );
}

export function libreriasInternasSinInfiernoDeVersiones(locale: FigureLocale = 'es'): Figure {
  const text = TEXT[locale];
  const coreCenterY = CORE.y + CORE.h / 2;
  const [topA, topB, topC] = TOPS;
  const centerA = topA + CONSUMER_H / 2;
  const centerB = topB + CONSUMER_H / 2;
  const centerC = topC + CONSUMER_H / 2;
  const flow = motion('flow');

  return figure(
    // Encabezado del plano.
    label(56, 84, text.header, { anchor: 'start', tone: 'ink', tracking: 3 }),
    line(250, 80, 404, 80, { dash: '2 4', stroke: 'muted', width: 1 }),

    // Núcleo compartido.
    group(
      [
        rect(CORE.x, CORE.y, CORE.w, CORE.h, { fill: 'brandSoft', r: 4, width: 1.6 }),
        heading(CORE.x + CORE.w / 2, coreCenterY + 5, text.core, { size: 15 }),
        label(CORE.x + CORE.w / 2, CORE.y - 14, 'v2', { size: 11 }),
      ],
      motion('fade', 200),
    ),

    // Bifurcaciones que siguen sincronizadas con el núcleo.
    group(
      [
        path(`M192 190C300 190 330 ${centerA} ${CONSUMER_X} ${centerA}`, {
          stroke: 'muted',
          width: 1.4,
        }),
        arrowHead([380, centerA], [CONSUMER_X, centerA], 'muted'),
        line(192, coreCenterY, CONSUMER_X, centerB, { stroke: 'muted', width: 1.4 }),
        arrowHead([380, centerB], [CONSUMER_X, centerB], 'muted'),
      ],
      motion('fade', 500),
    ),

    // Bifurcación que deriva: trazo animado en acento.
    group(
      [
        path(`M192 210C300 210 330 ${centerC} ${CONSUMER_X} ${centerC}`, {
          dash: '5 7',
          motion: flow,
          stroke: 'accent',
          width: 2,
        }),
        arrowHead([380, centerC], [CONSUMER_X, centerC], 'accent'),
      ],
      motion('fade', 800),
    ),

    consumer('APP A', topA, 'v2', false, 400),
    consumer('APP B', topB, 'v2', false, 540),
    consumer(text.fork, topC, 'v1', true, 680),

    // Punto que late donde la copia se separa.
    pulse(CONSUMER_X, centerC, 16, 900),

    // Pie: la idea clave en el único acento.
    label(CONSUMER_X + CONSUMER_W / 2, 372, text.footer, { size: 11, tone: 'accent' }),
  );
}
