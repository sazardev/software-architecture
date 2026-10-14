import { arrow, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    api: 'API',
    boundary: 'TRUST BOUNDARY',
    db: 'DATABASE',
    flow: 'S T I',
    title: 'STRIDE on a data flow diagram',
    user: 'USER',
  },
  es: {
    api: 'API',
    boundary: 'LÍMITE DE CONFIANZA',
    db: 'BASE DE DATOS',
    flow: 'S T I',
    title: 'STRIDE sobre un diagrama de flujo de datos',
    user: 'USUARIO',
  },
} as const;

/**
Cada flujo que cruza un límite de confianza es una superficie de ataque. STRIDE pregunta, flujo
por flujo, qué amenaza aplica: suplantación, manipulación, repudio, divulgación, denegación o
elevación de privilegios.
*/
export function modeladoDeAmenazasStride(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 66, copy.title, { size: 15 }),
    line(300, 110, 300, 340, { dash: '6 5', stroke: 'accent', width: 1.8 }),
    label(300, 360, copy.boundary, { size: 10, tone: 'accent', tracking: 1.6 }),
    group(
      [
        rect(60, 170, 120, 70, { fill: 'paper', r: 8, width: 1.5 }),
        label(120, 210, copy.user, { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 0),
    ),
    group(
      [
        rect(340, 170, 120, 70, { fill: 'brandSoft', r: 8, width: 1.5 }),
        label(400, 210, copy.api, { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 150),
    ),
    group(
      [
        rect(500, 170, 120, 70, { fill: 'paper', r: 8, width: 1.5 }),
        label(560, 210, copy.db, { size: 10.5, tracking: 1.2 }),
      ],
      motion('rise', 300),
    ),
    group(
      [
        arrow(
          [
            [184, 205],
            [336, 205],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [464, 205],
            [496, 205],
          ],
          { tone: 'ink' },
        ),
        label(260, 190, copy.flow, { size: 10, tone: 'accent', tracking: 1.4 }),
        label(480, 190, copy.flow, { size: 10, tone: 'accent', tracking: 1.4 }),
      ],
      motion('fade', 500),
    ),
  );
}
