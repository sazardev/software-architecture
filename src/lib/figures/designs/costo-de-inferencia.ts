import { figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BAR_X = 300;
const BAR_H = 34;

const bars = [
  { fill: 'accent', width: 300, y: 150 },
  { fill: 'brandSoft', width: 120, y: 220 },
  { fill: 'paper', width: 30, y: 290 },
] as const;

const COPY = {
  en: {
    names: ['LARGE MODEL', 'SMALL MODEL', 'CACHE HIT'],
    note: 'relative scale, not prices',
    title: 'Relative cost per request',
  },
  es: {
    names: ['MODELO GRANDE', 'MODELO PEQUEÑO', 'ACIERTO DE CACHÉ'],
    note: 'escala relativa, no precios',
    title: 'Costo relativo por petición',
  },
} as const;

/**
El costo por petición depende de tres decisiones: qué modelo usas, si la respuesta sale de caché y
dónde se ejecuta. Las barras muestran órdenes de magnitud relativos, no precios.
*/
export function costoDeInferencia(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 56, copy.title, { size: 15 }),
    bars.map((bar, index) =>
      group(
        [
          label(60, bar.y + 21, copy.names[index] ?? '', {
            anchor: 'start',
            size: 11,
            tracking: 1.4,
          }),
          rect(BAR_X, bar.y, bar.width, BAR_H, {
            fill: bar.fill,
            r: 6,
            stroke: bar.fill === 'paper' ? 'ink' : undefined,
            width: 1.4,
          }),
        ],
        motion('rise', index * 150),
      ),
    ),
    line(BAR_X, 140, BAR_X, 340, { stroke: 'ink', width: 1.2 }),
    label(320, 368, copy.note, { tone: 'muted' }),
  );
}
