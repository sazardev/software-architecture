import { arrow, figure, group, heading, label, line, motion, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const TEXT = {
  es: {
    bookings: 'Reservas',
    billing: 'Bonos y cobro',
    catalog: 'Catálogo',
    first: 'PRIMER SERVICIO',
    identity: 'Identidad',
    monolith: 'MONOLITO MODULAR',
    notifications: 'Notificaciones',
    outbox: 'OUTBOX',
    payments: 'Pasarela de pago',
    seam: 'PRIMERA FRONTERA',
    sync: 'LLAMADA SÍNCRONA',
    event: 'EVENTO',
    title: 'SISTEMA DE RESERVAS',
  },
  en: {
    bookings: 'Bookings',
    billing: 'Passes & billing',
    catalog: 'Catalog',
    first: 'FIRST SERVICE',
    identity: 'Identity',
    monolith: 'MODULAR MONOLITH',
    notifications: 'Notifications',
    outbox: 'OUTBOX',
    payments: 'Payment gateway',
    seam: 'FIRST SEAM',
    sync: 'SYNC CALL',
    event: 'EVENT',
    title: 'BOOKING SYSTEM',
  },
} as const;

function module(
  x: number,
  y: number,
  width: number,
  name: string,
  delay: number,
  fill: 'brandSoft' | 'paper',
) {
  return group(
    [
      rect(x, y, width, 56, { fill, width: 1.5 }),
      heading(x + width / 2, y + 34, name, { size: 14 }),
    ],
    motion('rise', delay),
  );
}

export function casoEstudioSistemaCompleto(locale: FigureLocale = 'es'): Figure {
  const t = TEXT[locale];

  return figure(
    // Frontera del monolito modular: un único despliegue con módulos internos.
    group(
      [
        rect(40, 80, 400, 270, { fill: 'sunken', r: 6, stroke: 'muted', width: 1.4 }),
        label(60, 102, t.monolith, { anchor: 'start', size: 10.5, tone: 'ink', tracking: 2.4 }),
      ],
      motion('rise', 100),
    ),
    module(64, 130, 116, t.catalog, 250, 'paper'),
    module(220, 130, 140, t.bookings, 400, 'brandSoft'),
    module(220, 250, 140, t.billing, 550, 'paper'),
    module(64, 250, 116, t.identity, 700, 'paper'),
    // Llamadas síncronas dentro del monolito.
    group(
      [
        arrow(
          [
            [180, 158],
            [220, 158],
          ],
          { dash: '4 4', tone: 'muted', width: 1.2 },
        ),
        arrow(
          [
            [290, 186],
            [290, 250],
          ],
          { dash: '4 4', tone: 'muted', width: 1.2 },
        ),
      ],
      motion('fade', 800),
    ),
    // Primera frontera: el servicio de notificaciones se separa del monolito.
    group(
      [
        line(470, 70, 470, 350, { dash: '3 4', stroke: 'accent', width: 1.2 }),
        label(470, 66, t.seam, { size: 10, tone: 'accent' }),
      ],
      motion('fade', 900),
    ),
    group(
      [
        rect(492, 160, 112, 56, { fill: 'accentSoft', stroke: 'accent', width: 2 }),
        heading(548, 194, t.notifications, { size: 12 }),
        label(548, 150, t.first, { size: 9.5, tone: 'accent' }),
      ],
      motion('rise', 1000),
    ),
    // Evento publicado desde la tabla outbox hacia el nuevo servicio.
    group(
      [
        arrow(
          [
            [360, 158],
            [492, 176],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
        label(422, 146, t.outbox, { size: 9, tone: 'accent' }),
      ],
      motion('fade', 1100),
    ),
    pulse(470, 174, 14, 1200),
    // Pasarela externa: llamada síncrona hacia fuera del sistema.
    group(
      [
        arrow(
          [
            [360, 278],
            [492, 284],
          ],
          { dash: '4 4', tone: 'muted', width: 1.4 },
        ),
        rect(492, 262, 112, 44, { fill: 'sunken', stroke: 'muted', width: 1.2 }),
        label(548, 288, t.payments, { size: 9, tone: 'muted', tracking: 0.8 }),
      ],
      motion('rise', 1150),
    ),
    label(44, 58, t.title, { anchor: 'start', tone: 'ink', tracking: 3 }),
    // Leyenda.
    group(
      [
        line(44, 380, 80, 380, { dash: '4 4', stroke: 'muted', width: 1.2 }),
        label(88, 384, t.sync, { anchor: 'start', size: 9.5 }),
        arrow(
          [
            [300, 380],
            [336, 380],
          ],
          { flow: true, tone: 'accent', width: 1.6 },
        ),
        label(344, 384, t.event, { anchor: 'start', size: 9.5 }),
      ],
      motion('fade', 1250),
    ),
  );
}
