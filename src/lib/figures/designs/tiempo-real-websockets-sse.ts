import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    client: 'CLIENT',
    note: 'the queue absorbs bursts and fans out',
    oneWay: 'SSE · one way',
    queue: 'QUEUE',
    server: 'SERVER',
    title: 'Direction and fan-out decide',
    twoWays: 'WEBSOCKET · two ways',
  },
  es: {
    client: 'CLIENTE',
    note: 'la cola absorbe picos y reparte eventos',
    oneWay: 'SSE · una vía',
    queue: 'COLA',
    server: 'SERVIDOR',
    title: 'La dirección y el reparto deciden',
    twoWays: 'WEBSOCKET · dos vías',
  },
} as const;

/**
SSE empuja datos en una sola dirección; WebSocket permite hablar en ambas. Una cola delante del
servidor absorbe los picos y permite repartir los eventos entre varias instancias.
*/
export function tiempoRealWebsocketsSse(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 56, copy.title, { size: 15 }),
    group(
      [
        rect(250, 150, 140, 60, { fill: 'paper', r: 8, width: 1.5 }),
        label(320, 186, copy.server, { size: 11, tracking: 1.4 }),
        rect(40, 150, 130, 60, { fill: 'paper', r: 8, width: 1.5 }),
        label(105, 186, copy.client, { size: 11, tracking: 1.4 }),
        rect(470, 150, 130, 60, { fill: 'paper', r: 8, width: 1.5 }),
        label(535, 186, copy.client, { size: 11, tracking: 1.4 }),
      ],
      motion('rise'),
    ),
    group(
      [
        arrow(
          [
            [246, 170],
            [174, 170],
          ],
          { tone: 'ink' },
        ),
        label(210, 140, copy.oneWay, { size: 10, tone: 'muted' }),
        arrow(
          [
            [394, 176],
            [466, 176],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [466, 196],
            [394, 196],
          ],
          { tone: 'ink' },
        ),
        label(430, 226, copy.twoWays, { size: 10, tone: 'muted' }),
      ],
      motion('fade', 400),
    ),
    group(
      [
        rect(250, 290, 140, 50, { fill: 'sunken', r: 8, stroke: 'ink', width: 1.5 }),
        label(320, 320, copy.queue, { size: 11, tracking: 1.4 }),
        arrow(
          [
            [320, 286],
            [320, 216],
          ],
          { tone: 'accent' },
        ),
      ],
      motion('rise', 600),
    ),
    label(320, 372, copy.note, { tone: 'muted' }),
  );
}
