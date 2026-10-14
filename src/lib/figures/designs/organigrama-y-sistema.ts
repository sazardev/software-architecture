import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

const BOX_W = 170;
const BOX_H = 50;
const LEFT_X = 60;
const RIGHT_X = 410;

const rows = [
  { row: 130, service: 'SERVICIO A', team: 'EQUIPO A' },
  { row: 205, service: 'SERVICIO B', team: 'EQUIPO B' },
  { row: 280, service: 'SERVICIO C', team: 'EQUIPO C' },
] as const;

/**
El organigrama dibuja el sistema: cada equipo deja su huella en un componente. La maniobra
inversa empieza al revés, diseñando el sistema que quieres y luego los equipos que lo sostienen.
*/
export function organigramaYSistema(): Figure {
  return figure(
    label(LEFT_X + BOX_W / 2, 100, 'ORGANIGRAMA', { size: 11, tracking: 2 }),
    label(RIGHT_X + BOX_W / 2, 100, 'SISTEMA', { size: 11, tracking: 2 }),
    rows.map((item, index) =>
      group(
        [
          rect(LEFT_X, item.row, BOX_W, BOX_H, { fill: 'paper', r: 8, width: 1.5 }),
          label(LEFT_X + BOX_W / 2, item.row + 31, item.team, { size: 11, tracking: 1.4 }),
          rect(RIGHT_X, item.row, BOX_W, BOX_H, { fill: 'brandSoft', r: 8, width: 1.5 }),
          label(RIGHT_X + BOX_W / 2, item.row + 31, item.service, { size: 11, tracking: 1.4 }),
        ],
        motion('rise', index * 130),
      ),
    ),
    rows.map((item, index) =>
      group(
        [
          arrow(
            [
              [LEFT_X + BOX_W + 8, item.row + BOX_H / 2],
              [RIGHT_X - 8, item.row + BOX_H / 2],
            ],
            { tone: index === 1 ? 'accent' : 'muted' },
          ),
        ],
        motion('fade', 800 + index * 120),
      ),
    ),
    heading(320, 360, 'La estructura de comunicación se copia', { size: 15 }),
    label(320, 382, 'si no la diseñas, el sistema la hereda', { tone: 'muted' }),
  );
}
