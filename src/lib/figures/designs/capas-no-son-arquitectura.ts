import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

const BOX_Y = 170;
const BOX_W = 160;
const BOX_H = 110;

const layers = [
  { detail: 'ORM · HTTP · colas', name: 'INFRAESTRUCTURA', x: 40 },
  { detail: 'casos de uso', name: 'APLICACIÓN', x: 240 },
  { detail: 'reglas de negocio', name: 'DOMINIO', x: 440 },
] as const;

/**
Tres capas alineadas: cada flecha apunta hacia el dominio. La regla de dependencia importa más
que cuántas capas existan.
*/
export function capasNoSonArquitectura(): Figure {
  return figure(
    label(320, 92, 'LAS DEPENDENCIAS APUNTAN HACIA DENTRO', { tone: 'muted', tracking: 2 }),
    layers.map((layer, index) => {
      const isCore = index === layers.length - 1;

      return group(
        [
          rect(layer.x, BOX_Y, BOX_W, BOX_H, {
            fill: isCore ? 'brandSoft' : 'paper',
            r: 8,
            width: isCore ? 2 : 1.5,
          }),
          label(layer.x + BOX_W / 2, BOX_Y + 48, layer.name, { size: 11, tracking: 1.4 }),
          label(layer.x + BOX_W / 2, BOX_Y + 72, layer.detail, { size: 10.5, tone: 'muted' }),
        ],
        motion('rise', index * 180),
      );
    }),
    group(
      [
        arrow(
          [
            [206, BOX_Y + BOX_H / 2],
            [234, BOX_Y + BOX_H / 2],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [406, BOX_Y + BOX_H / 2],
            [434, BOX_Y + BOX_H / 2],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 500),
    ),
    heading(320, 330, 'El dominio no conoce a nadie', { size: 15 }),
    label(320, 356, 'nada del dominio importa infraestructura', { tone: 'muted' }),
  );
}
