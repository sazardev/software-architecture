import { arrow, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    device: 'DEVICE · local store',
    network: 'network: intermittent',
    queue: 'PENDING QUEUE',
    server: 'SERVER',
    title: 'Write locally first, sync in order',
  },
  es: {
    device: 'DISPOSITIVO · almacén local',
    network: 'red: intermitente',
    queue: 'COLA PENDIENTE',
    server: 'SERVIDOR',
    title: 'Escribir primero en local, sincronizar en orden',
  },
} as const;

const ops = [146, 180, 214] as const;

/**
La app confirma cada cambio en local y lo deja en una cola. La cola se vacía en orden cuando hay red,
y el servidor resuelve los conflictos con una regla explícita.
*/
export function movilOfflineFirstSincronizacion(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    group(
      [
        rect(60, 110, 200, 150, { fill: 'paper', r: 10, width: 1.5 }),
        label(160, 136, copy.device, { size: 9.5, tracking: 1 }),
        label(160, 252, copy.queue, { size: 9.5, tracking: 1.2, tone: 'muted' }),
      ],
      motion('rise'),
    ),
    ops.map((y, index) =>
      group(
        [rect(90, y, 140, 26, { fill: index === 0 ? 'brandSoft' : 'paper', r: 5, width: 1.2 })],
        motion('rise', 200 + index * 120),
      ),
    ),
    group(
      [line(320, 185, 430, 185, { dash: '5 5', stroke: 'muted', width: 1.4 })],
      motion('draw', 500),
    ),
    group(
      [
        rect(440, 140, 140, 90, { fill: 'brandSoft', r: 10, width: 1.5 }),
        label(510, 190, copy.server, { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 600),
    ),
    group(
      [
        arrow(
          [
            [262, 185],
            [436, 185],
          ],
          { tone: 'accent' },
        ),
      ],
      motion('fade', 800),
    ),
  );
}
