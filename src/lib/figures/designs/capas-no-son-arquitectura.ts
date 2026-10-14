import { arrow, figure, group, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BOX_Y = 170;
const BOX_W = 160;
const BOX_H = 110;

const COPY = {
  en: {
    details: ['ORM · HTTP · MQ', 'use cases', 'business rules'],
    names: ['INFRASTRUCTURE', 'APPLICATION', 'DOMAIN'],
    note: 'the domain imports no infrastructure',
    title: 'DEPENDENCIES POINT INWARD',
  },
  es: {
    details: ['ORM · HTTP · colas', 'casos de uso', 'reglas de negocio'],
    names: ['INFRAESTRUCTURA', 'APLICACIÓN', 'DOMINIO'],
    note: 'el dominio no importa infraestructura',
    title: 'LAS DEPENDENCIAS APUNTAN HACIA DENTRO',
  },
} as const;

const layers = [{ x: 40 }, { x: 240 }, { x: 440 }] as const;

/**
Tres capas alineadas: cada flecha apunta hacia el dominio. La regla de dependencia importa más
que cuántas capas existan.
*/
export function capasNoSonArquitectura(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    label(320, 92, copy.title, { tone: 'muted', tracking: 2 }),
    layers.map((layer, index) => {
      const isCore = index === layers.length - 1;

      return group(
        [
          rect(layer.x, BOX_Y, BOX_W, BOX_H, {
            fill: isCore ? 'brandSoft' : 'paper',
            r: 8,
            width: isCore ? 2 : 1.5,
          }),
          label(layer.x + BOX_W / 2, BOX_Y + 48, copy.names[index] ?? '', {
            size: 11,
            tracking: 1.4,
          }),
          label(layer.x + BOX_W / 2, BOX_Y + 72, copy.details[index] ?? '', {
            size: 10.5,
            tone: 'muted',
          }),
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
    label(320, 356, copy.note, { tone: 'muted' }),
  );
}
