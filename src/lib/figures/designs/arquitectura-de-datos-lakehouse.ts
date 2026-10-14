import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    bi: 'BI',
    ingest: 'INGEST',
    lake: 'LAKEHOUSE',
    lakeNote: 'open tables',
    ml: 'ML',
    serve: 'SERVE',
    title: 'One open storage serves BI and ML',
  },
  es: {
    bi: 'BI',
    ingest: 'INGESTA',
    lake: 'LAKEHOUSE',
    lakeNote: 'tablas abiertas',
    ml: 'ML',
    serve: 'CONSUMO',
    title: 'Un almacenamiento abierto sirve a BI y a ML',
  },
} as const;

/**
Un único almacenamiento abierto recibe las fuentes y sirve a informes y a modelos. Evita copiar
los mismos datos a un warehouse y a un lago separado.
*/
export function arquitecturaDeDatosLakehouse(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 66, copy.title, { size: 15 }),
    group(
      [
        rect(40, 160, 130, 90, { fill: 'paper', r: 8, width: 1.5 }),
        label(105, 212, copy.ingest, { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 0),
    ),
    group(
      [
        rect(230, 140, 190, 130, { fill: 'brandSoft', r: 10, width: 1.8 }),
        label(325, 200, copy.lake, { size: 12, tracking: 1.6 }),
        label(325, 224, copy.lakeNote, { size: 9.5, tone: 'muted' }),
      ],
      motion('rise', 150),
    ),
    group(
      [
        rect(480, 120, 130, 56, { fill: 'paper', r: 8, width: 1.5 }),
        label(545, 153, copy.bi, { size: 11, tracking: 1.4 }),
        rect(480, 204, 130, 56, { fill: 'accent', r: 8, stroke: undefined }),
        label(545, 237, copy.ml, { size: 11, tone: 'paper', tracking: 1.4 }),
      ],
      motion('rise', 300),
    ),
    group(
      [
        arrow(
          [
            [174, 205],
            [226, 205],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [424, 190],
            [476, 148],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [424, 220],
            [476, 232],
          ],
          { tone: 'accent' },
        ),
      ],
      motion('fade', 500),
    ),
    label(320, 330, copy.serve, { tone: 'muted', size: 10.5, tracking: 2 }),
  );
}
