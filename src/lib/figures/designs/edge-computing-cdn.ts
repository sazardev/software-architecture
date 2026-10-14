import { circle, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    edges: ['EDGE A', 'EDGE B', 'EDGE C'],
    hit: 'CACHE MISS',
    origin: 'ORIGIN',
    title: 'Serve from the nearest edge; fetch from origin only on a miss',
    users: 'USERS',
  },
  es: {
    edges: ['BORDE A', 'BORDE B', 'BORDE C'],
    hit: 'FALLO DE CACHÉ',
    origin: 'ORIGEN',
    title: 'Sirve desde el borde más cercano; el origen solo si falla la caché',
    users: 'USUARIOS',
  },
} as const;

const edgeY = [140, 230, 320] as const;

/**
Un CDN sirve copias cercanas al usuario. Solo una falla de caché llega al origen, y por eso la
latencia depende de la tasa de aciertos y no del tamaño del origen.
*/
export function edgeComputingCdn(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 14 }),
    edgeY.map((y, index) =>
      group(
        [
          circle(300, y, 26, { fill: index === 1 ? 'brandSoft' : 'paper', width: 1.5 }),
          label(300, y + 44, copy.edges[index] ?? '', { size: 9, tracking: 1.1 }),
        ],
        motion('rise', index * 120),
      ),
    ),
    group(
      [
        line(112, 230, 274, 230, { stroke: 'ink', width: 1.4 }),
        label(112, 218, copy.users, { anchor: 'start', size: 9.5, tracking: 1.2 }),
      ],
      motion('draw', 400),
    ),
    group(
      [
        rect(480, 180, 120, 100, { fill: 'paper', r: 10, width: 1.5 }),
        label(540, 236, copy.origin, { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 500),
    ),
    group(
      [line(326, 230, 478, 230, { dash: '5 5', stroke: 'muted', width: 1.4 })],
      motion('draw', 700),
    ),
    label(400, 220, copy.hit, { size: 9.5, tone: 'accent', tracking: 1.2 }),
  );
}
