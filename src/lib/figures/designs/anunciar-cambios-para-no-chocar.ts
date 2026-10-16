import { arrow, figure, group, label, line, motion, node, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const TRACK_A = 170;
const TRACK_B = 270;
const LEFT = 60;
const RIGHT = 596;
const BAND_LEFT = 262;
const BAND_RIGHT = 412;
const BAND_TOP = 118;
const BAND_BOTTOM = 318;
const BAND_MID = (BAND_LEFT + BAND_RIGHT) / 2;

const texts = {
  es: {
    title: 'PLANO DE CAMBIOS',
    teamA: 'EQUIPO A',
    teamB: 'EQUIPO B',
    notice: 'AVISO · 2 DÍAS',
    window: 'VENTANA DE RESERVA',
    waits: 'ESPERA',
    footer: 'NINGÚN CRUCE EN LA ZONA',
  },
  en: {
    title: 'CHANGE PLAN',
    teamA: 'TEAM A',
    teamB: 'TEAM B',
    notice: 'NOTICE · 2 DAYS',
    window: 'RESERVATION WINDOW',
    waits: 'WAITS',
    footer: 'NO OVERLAP IN THE ZONE',
  },
} as const;

export function anunciarCambiosParaNoChocar(locale: FigureLocale = 'es'): Figure {
  const t = texts[locale];

  return figure(
    label(44, 64, t.title, { anchor: 'start', tone: 'ink', tracking: 3 }),
    line(190, 60, RIGHT, 60, { dash: '2 4', stroke: 'muted', width: 1 }),

    // Ventana de reserva: zona compartida reservada durante un tiempo corto.
    group(
      [
        rect(BAND_LEFT, BAND_TOP, BAND_RIGHT - BAND_LEFT, BAND_BOTTOM - BAND_TOP, {
          dash: '4 4',
          fill: 'sunken',
          r: 0,
          stroke: 'accent',
          width: 1.4,
        }),
        label(BAND_MID, 104, t.window, { size: 10, tone: 'ink' }),
      ],
      motion('fade', 200),
    ),

    // Guías de cada equipo.
    line(LEFT, TRACK_A, RIGHT, TRACK_A, { dash: '2 4', stroke: 'faint', width: 1 }),
    line(LEFT, TRACK_B, RIGHT, TRACK_B, { dash: '2 4', stroke: 'faint', width: 1 }),

    // Aviso publicado antes de empezar, con su caducidad en el rótulo.
    group(
      [
        rect(LEFT, 118, 150, 30, { fill: 'paper', r: 3, stroke: 'muted', width: 1.4 }),
        label(LEFT + 75, 137, t.notice, { size: 10, tone: 'ink' }),
      ],
      motion('rise', 300),
    ),

    // Equipo A: avanza dentro de la ventana que ha reservado.
    group(
      [
        arrow(
          [
            [LEFT, TRACK_A],
            [RIGHT, TRACK_A],
          ],
          { flow: true, tone: 'ink', width: 1.8 },
        ),
        node(LEFT, TRACK_A, 6, true),
        label(LEFT, TRACK_A + 26, t.teamA, { anchor: 'start', size: 10.5, tone: 'ink' }),
      ],
      motion('rise', 450),
    ),
    pulse(LEFT, TRACK_A, 10, 800),

    // Equipo B: llega, espera fuera de la ventana y continúa cuando esta termina.
    group(
      [
        arrow(
          [
            [LEFT, TRACK_B],
            [BAND_LEFT - 12, TRACK_B],
          ],
          { tone: 'ink', width: 1.8 },
        ),
        line(BAND_LEFT - 12, TRACK_B - 14, BAND_LEFT - 12, TRACK_B + 14, {
          stroke: 'muted',
          width: 1.4,
        }),
        line(BAND_LEFT - 12, TRACK_B, BAND_RIGHT + 12, TRACK_B, {
          dash: '2 4',
          stroke: 'muted',
          width: 1.2,
        }),
        label(BAND_MID, TRACK_B + 26, t.waits, { size: 10, tone: 'muted' }),
        arrow(
          [
            [BAND_RIGHT + 12, TRACK_B],
            [RIGHT, TRACK_B],
          ],
          { tone: 'ink', width: 1.8 },
        ),
        node(LEFT, TRACK_B, 6, false),
        label(LEFT, TRACK_B + 26, t.teamB, { anchor: 'start', size: 10.5, tone: 'ink' }),
      ],
      motion('rise', 700),
    ),

    group([label(BAND_MID, 352, t.footer, { size: 11, tone: 'ink' })], motion('fade', 1200)),
  );
}
