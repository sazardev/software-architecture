import { figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

const BASE_Y = 320;
const BAR_W = 72;

const bars = [
  { height: 80, hot: false, name: 'API' },
  { height: 240, hot: true, name: 'DATOS' },
  { height: 110, hot: false, name: 'OPERACIÓN' },
  { height: 60, hot: false, name: 'CONTRATO' },
  { height: 140, hot: false, name: 'TALENTO' },
] as const;

/**
El costo de salida no es parejo: los datos pesan más que la API, porque exportarlos es fácil y
reconstruir su significado es lo caro.
*/
export function salidaDeLaNube(): Figure {
  return figure(
    heading(320, 66, 'Costo de salida por capa', { size: 15 }),
    label(580, 96, 'ALTURA = ESFUERZO ESTIMADO', { anchor: 'end', size: 10, tone: 'muted' }),
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
          label(x + BAR_W / 2, BASE_Y + 22, bar.name, { size: 10, tracking: 1.2 }),
        ],
        motion('rise', 300 + index * 120),
      );
    }),
    label(320, 368, 'un plan de salida probado vale más que un inventario', { tone: 'muted' }),
  );
}
