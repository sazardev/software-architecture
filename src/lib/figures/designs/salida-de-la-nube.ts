import { figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BASE_Y = 320;
const BAR_W = 72;

const bars = [
  { height: 80, hot: false },
  { height: 240, hot: true },
  { height: 110, hot: false },
  { height: 60, hot: false },
  { height: 140, hot: false },
] as const;

const COPY = {
  en: {
    names: ['API', 'DATA', 'OPERATIONS', 'CONTRACT', 'TALENT'],
    note: 'a tested exit plan beats an inventory',
    scale: 'HEIGHT = ESTIMATED EFFORT',
    title: 'Exit cost by layer',
  },
  es: {
    names: ['API', 'DATOS', 'OPERACIÓN', 'CONTRATO', 'TALENTO'],
    note: 'un plan de salida probado vale más que un inventario',
    scale: 'ALTURA = ESFUERZO ESTIMADO',
    title: 'Costo de salida por capa',
  },
} as const;

/**
El costo de salida no es parejo: los datos pesan más que la API, porque exportarlos es fácil y
reconstruir su significado es lo caro.
*/
export function salidaDeLaNube(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 66, copy.title, { size: 15 }),
    label(580, 96, copy.scale, { anchor: 'end', size: 10, tone: 'muted' }),
    group([line(60, BASE_Y, 580, BASE_Y, { stroke: 'ink', width: 1.6 })], motion('draw', 200)),
    bars.map((bar, index) => {
      const x = 92 + index * 98;

      return group(
        [
          rect(x, BASE_Y - bar.height, BAR_W, bar.height, {
            fill: bar.hot ? 'accent' : 'brandSoft',
            r: 6,
            stroke: bar.hot ? undefined : 'ink',
            width: 1.4,
          }),
          label(x + BAR_W / 2, BASE_Y + 22, copy.names[index] ?? '', { size: 10, tracking: 1.2 }),
        ],
        motion('rise', 300 + index * 120),
      );
    }),
    label(320, 368, copy.note, { tone: 'muted' }),
  );
}
