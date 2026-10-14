import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    db: 'DATABASE TABLE',
    index: 'INVERTED INDEX',
    note: 'the index is derived data: it can always be rebuilt',
    query: 'QUERY',
    results: 'RANKED RESULTS',
    sync: 'change stream',
    title: 'Search: index, sync and ranking',
  },
  es: {
    db: 'TABLA DE LA BASE',
    index: 'ÍNDICE INVERTIDO',
    note: 'el índice es dato derivado: siempre se puede reconstruir',
    query: 'CONSULTA',
    results: 'RESULTADOS',
    sync: 'flujo de cambios',
    title: 'Búsqueda: índice, sincronización y ranking',
  },
} as const;

/**
La búsqueda vive en un índice derivado de la fuente. Los cambios llegan por un flujo, y el
resultado sale ordenado por relevancia. Si el índice se pierde, se reconstruye desde la base.
*/
export function busquedaEnAplicacion(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    group(
      [
        rect(40, 150, 110, 44, { fill: 'paper', r: 6, width: 1.4 }),
        label(95, 176, copy.query, { size: 10.5, tracking: 1.2 }),
      ],
      motion('rise'),
    ),
    group(
      [
        rect(240, 140, 160, 64, { fill: 'accent', r: 8, stroke: undefined }),
        label(320, 176, copy.index, { size: 10.5, tone: 'paper', tracking: 1.2 }),
      ],
      motion('rise', 150),
    ),
    group(
      [
        rect(40, 250, 140, 50, { fill: 'paper', r: 6, width: 1.4 }),
        label(110, 280, copy.db, { size: 10.5, tracking: 1.2 }),
      ],
      motion('rise', 300),
    ),
    group(
      [
        rect(440, 130, 160, 110, { fill: 'paper', r: 8, width: 1.4 }),
        label(452, 150, copy.results, { anchor: 'start', size: 9, tone: 'muted' }),
        rect(460, 166, 120, 10, { fill: 'brandSoft', r: 3, width: 1 }),
        rect(460, 186, 90, 10, { fill: 'brandSoft', r: 3, width: 1 }),
        rect(460, 206, 60, 10, { fill: 'brandSoft', r: 3, width: 1 }),
      ],
      motion('rise', 450),
    ),
    group(
      [
        arrow(
          [
            [152, 172],
            [236, 172],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [404, 172],
            [436, 172],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [182, 262],
            [262, 204],
          ],
          { tone: 'muted' },
        ),
      ],
      motion('fade', 600),
    ),
    label(190, 232, copy.sync, { anchor: 'end', size: 10, tone: 'muted' }),
    label(320, 340, copy.note, { size: 10, tone: 'muted' }),
  );
}
