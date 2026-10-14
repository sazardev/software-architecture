import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const CHANNELS = ['PUSH', 'EMAIL', 'SMS'] as const;
const QUEUE_Y = [110, 170, 230] as const;

const COPY = {
  en: {
    event: 'EVENT',
    note: 'a failing provider retries; it never blocks the others',
    pref: 'PREFERENCES',
    retry: 'retry with backoff',
    service: ['NOTIFY', 'SERVICE'],
    title: 'One service, one queue per channel',
  },
  es: {
    event: 'EVENTO',
    note: 'si un proveedor falla, reintenta sin frenar a los demás',
    pref: 'PREFERENCIAS',
    retry: 'reintento con backoff',
    service: ['SERVICIO', 'NOTIFICACIÓN'],
    title: 'Un servicio, una cola por canal',
  },
} as const;

/**
Un evento entra al servicio de notificaciones, que consulta preferencias y encola un mensaje por
canal. Cada cola reintenta sus envíos, así que la caída de un proveedor no frena a los demás.
*/
export function notificacionesPushCorreoSms(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    group(
      [
        rect(40, 160, 110, 50, { fill: 'paper', r: 6, width: 1.4 }),
        label(95, 189, copy.event, { size: 10.5, tracking: 1.2 }),
      ],
      motion('rise'),
    ),
    group(
      [
        rect(210, 140, 150, 90, { fill: 'accent', r: 8, stroke: undefined }),
        label(285, 176, copy.service[0], { size: 10.5, tone: 'paper', tracking: 1.2 }),
        label(285, 196, copy.service[1], { size: 10.5, tone: 'paper', tracking: 1.2 }),
      ],
      motion('rise', 150),
    ),
    group(
      [
        rect(210, 270, 150, 50, { dash: '4 4', fill: 'sunken', r: 6, stroke: 'muted', width: 1.4 }),
        label(285, 299, copy.pref, { size: 10, tone: 'muted', tracking: 1.2 }),
      ],
      motion('fade', 300),
    ),
    arrow(
      [
        [152, 185],
        [206, 185],
      ],
      { tone: 'ink' },
    ),
    CHANNELS.map((channel, index) =>
      group(
        [
          rect(420, QUEUE_Y[index] ?? 0, 170, 44, { fill: 'paper', r: 6, width: 1.4 }),
          label(505, (QUEUE_Y[index] ?? 0) + 27, channel, { size: 10.5, tracking: 1.2 }),
        ],
        motion('rise', 450 + index * 120),
      ),
    ),
    group(
      CHANNELS.map((_, index) =>
        arrow(
          [
            [362, 185],
            [416, (QUEUE_Y[index] ?? 0) + 22],
          ],
          { tone: 'ink' },
        ),
      ),
      motion('fade', 600),
    ),
    label(505, 302, copy.retry, { size: 10, tone: 'muted' }),
    label(320, 380, copy.note, { size: 10, tone: 'muted' }),
  );
}
