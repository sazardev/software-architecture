import { arrow, figure, group, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const TEXT = {
  es: {
    title: 'CONTRATO DE EVENTO',
    producer: 'PRODUCTOR',
    consumer: 'CONSUMIDOR',
    registry: 'REGISTRO DE ESQUEMAS',
    caption: 'V1 Y V2 CONVIVEN EN EL CANAL; EL LECTOR ACEPTA AMBAS',
  },
  en: {
    title: 'EVENT CONTRACT',
    producer: 'PRODUCER',
    consumer: 'CONSUMER',
    registry: 'SCHEMA REGISTRY',
    caption: 'V1 AND V2 SHARE THE CHANNEL; THE READER ACCEPTS BOTH',
  },
} as const;

const CHANNEL = { x: 200, y: 150, w: 240, h: 100 };

const envelopes = [
  { x: 222, y: 168, version: 'v1', isNew: false },
  { x: 292, y: 212, version: 'v2', isNew: true },
  { x: 362, y: 168, version: 'v1', isNew: false },
] as const;

function envelope(x: number, y: number, version: string, isNew: boolean, index: number) {
  return group(
    [
      rect(x, y, 52, 30, {
        fill: isNew ? 'accentSoft' : 'paper',
        r: 3,
        stroke: isNew ? 'accent' : 'muted',
        width: 1.5,
      }),
      label(x + 26, y + 19, version, { size: 11, tone: isNew ? 'accent' : 'ink' }),
    ],
    motion('rise', 300 + index * 150),
  );
}

export function contratosDeEventosVersionados(locale: FigureLocale = 'es'): Figure {
  const t = TEXT[locale];

  return figure(
    // Cabecera: rótulo del plano.
    label(44, 84, t.title, { anchor: 'start', tone: 'ink', tracking: 3 }),
    line(290, 80, 596, 80, { dash: '2 4', stroke: 'muted', width: 1 }),

    // Productor: emite las dos versiones del mismo evento.
    group(
      [
        rect(40, 150, 120, 100, { fill: 'paper', r: 4, width: 1.6 }),
        label(100, 205, t.producer, { size: 11, tone: 'ink' }),
      ],
      motion('fade', 200),
    ),
    group(
      [
        arrow(
          [
            [160, 200],
            [206, 200],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
      ],
      motion('fade', 400),
    ),

    // Canal: un solo tema con mensajes de ambas versiones intercalados.
    group(
      [
        rect(CHANNEL.x, CHANNEL.y, CHANNEL.w, CHANNEL.h, {
          fill: 'sunken',
          r: 4,
          stroke: undefined,
        }),
      ],
      motion('fade', 250),
    ),
    envelopes.map((item, index) => envelope(item.x, item.y, item.version, item.isNew, index)),

    // Consumidor: un único lector que entiende ambas formas.
    group(
      [
        rect(480, 150, 120, 100, { fill: 'paper', r: 4, width: 1.6 }),
        label(540, 205, t.consumer, { size: 11, tone: 'ink' }),
      ],
      motion('fade', 900),
    ),
    group(
      [
        arrow(
          [
            [440, 186],
            [476, 186],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [440, 230],
            [476, 230],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
      ],
      motion('fade', 1100),
    ),

    // Registro de esquemas: valida la compatibilidad antes de aceptar una versión nueva.
    line(320, 250, 320, 296, { dash: '2 4', stroke: 'faint', width: 1 }),
    group(
      [
        rect(230, 296, 180, 36, { fill: 'sunken', r: 3, stroke: 'muted', width: 1.2 }),
        label(320, 318, t.registry, { size: 10, tone: 'ink' }),
      ],
      motion('rise', 1300),
    ),

    label(320, 368, t.caption, { size: 10.5 }),
  );
}
