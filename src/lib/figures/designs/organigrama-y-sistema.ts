import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BOX_W = 170;
const BOX_H = 50;
const LEFT_X = 60;
const RIGHT_X = 410;

const COPY = {
  en: {
    left: 'ORG CHART',
    note: 'if you do not design it, the system inherits it',
    right: 'SYSTEM',
    teams: ['TEAM A', 'TEAM B', 'TEAM C'],
    services: ['SERVICE A', 'SERVICE B', 'SERVICE C'],
    title: 'Communication structure gets copied',
  },
  es: {
    left: 'ORGANIGRAMA',
    note: 'si no la diseñas, el sistema la hereda',
    right: 'SISTEMA',
    teams: ['EQUIPO A', 'EQUIPO B', 'EQUIPO C'],
    services: ['SERVICIO A', 'SERVICIO B', 'SERVICIO C'],
    title: 'La estructura de comunicación se copia',
  },
} as const;

const rows = [130, 205, 280] as const;

/**
El organigrama dibuja el sistema: cada equipo deja su huella en un componente. La maniobra
inversa empieza al revés, diseñando el sistema que quieres y luego los equipos que lo sostienen.
*/
export function organigramaYSistema(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    label(LEFT_X + BOX_W / 2, 100, copy.left, { size: 11, tracking: 2 }),
    label(RIGHT_X + BOX_W / 2, 100, copy.right, { size: 11, tracking: 2 }),
    rows.map((row, index) =>
      group(
        [
          rect(LEFT_X, row, BOX_W, BOX_H, { fill: 'paper', r: 8, width: 1.5 }),
          label(LEFT_X + BOX_W / 2, row + 31, copy.teams[index] ?? '', {
            size: 11,
            tracking: 1.4,
          }),
          rect(RIGHT_X, row, BOX_W, BOX_H, { fill: 'brandSoft', r: 8, width: 1.5 }),
          label(RIGHT_X + BOX_W / 2, row + 31, copy.services[index] ?? '', {
            size: 11,
            tracking: 1.4,
          }),
        ],
        motion('rise', index * 130),
      ),
    ),
    rows.map((row, index) =>
      group(
        [
          arrow(
            [
              [LEFT_X + BOX_W + 8, row + BOX_H / 2],
              [RIGHT_X - 8, row + BOX_H / 2],
            ],
            { tone: index === 1 ? 'accent' : 'muted' },
          ),
        ],
        motion('fade', 800 + index * 120),
      ),
    ),
    heading(320, 360, copy.title, { size: 15 }),
    label(320, 382, copy.note, { tone: 'muted' }),
  );
}
