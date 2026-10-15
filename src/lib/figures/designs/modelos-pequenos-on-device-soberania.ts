import { arrow, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    boundary: 'DATA BOUNDARY',
    device: 'ON-DEVICE',
    input: 'DATA',
    output: 'ANSWER',
    frontier: 'FRONTIER API',
    hard: 'hard cases only',
    note: 'data never crosses the boundary',
  },
  es: {
    boundary: 'FRONTERA DEL DATO',
    device: 'EN EL DISPOSITIVO',
    input: 'DATOS',
    output: 'RESPUESTA',
    frontier: 'API FRONTERA',
    hard: 'solo casos difíciles',
    note: 'los datos no cruzan la frontera',
  },
} as const;

/**
Un modelo pequeño procesa dentro de una frontera que controlas (dispositivo o infraestructura propia).
Los datos no salen; solo lo difícil puede ir a un modelo grande externo.
*/
export function modelosPequenosOnDevice(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    group(
      [
        rect(40, 60, 360, 280, { dash: '4 4', fill: 'sunken', r: 14, stroke: 'muted', width: 1.2 }),
        label(58, 86, copy.boundary, { anchor: 'start', size: 10.5, tone: 'muted' }),
        rect(60, 130, 90, 44, { fill: 'paper', r: 6, width: 1.4 }),
        label(105, 157, copy.input, { size: 10.5, tone: 'ink' }),
        rect(200, 116, 160, 96, { fill: 'brandSoft', r: 8, width: 1.6 }),
        heading(280, 152, 'SLM', { size: 20 }),
        label(280, 176, copy.device, { size: 10 }),
        rect(60, 236, 90, 44, { fill: 'paper', r: 6, width: 1.4 }),
        label(105, 263, copy.output, { size: 10.5, tone: 'ink' }),
      ],
      motion('fade', 100),
    ),
    group(
      [
        arrow(
          [
            [150, 152],
            [196, 152],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
        arrow(
          [
            [280, 216],
            [280, 258],
            [154, 258],
          ],
          { tone: 'muted' },
        ),
      ],
      motion('rise', 400),
    ),
    group(
      [
        line(360, 164, 392, 164, { dash: '3 4', stroke: 'muted', width: 1.2 }),
        line(393, 157, 407, 171, { stroke: 'accent', width: 2 }),
        line(407, 157, 393, 171, { stroke: 'accent', width: 2 }),
      ],
      motion('fade', 700),
    ),
    group(
      [
        rect(470, 140, 120, 56, { fill: 'paper', r: 6, width: 1.4 }),
        label(530, 173, copy.frontier, { size: 10, tone: 'ink' }),
        label(530, 218, copy.hard, { size: 10, tone: 'muted' }),
      ],
      motion('rise', 900),
    ),
    label(320, 372, copy.note, { tone: 'muted' }),
  );
}
