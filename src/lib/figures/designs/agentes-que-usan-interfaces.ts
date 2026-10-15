import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const SCREEN = { h: 240, w: 520, x: 60, y: 80 } as const;
const SCREEN_RIGHT = SCREEN.x + SCREEN.w;
const SCREEN_BOTTOM = SCREEN.y + SCREEN.h;
const GATE_X = 400;
const CURSOR_Y = 200;

const COPY = {
  en: {
    approval: 'HUMAN APPROVAL',
    fill: 'FILL IN',
    log: 'SCREENSHOTS + TRACE',
    read: 'READ',
    submit: 'SEND',
    title: 'An agent on a screen: a gate before the irreversible zone',
    waiting: 'ONLY IF APPROVED',
  },
  es: {
    approval: 'APROBACIÓN HUMANA',
    fill: 'RELLENAR',
    log: 'CAPTURAS + TRAZA',
    read: 'LEER',
    submit: 'ENVIAR',
    title: 'Un agente en pantalla: compuerta antes de la zona irreversible',
    waiting: 'SOLO SI APRUEBA',
  },
} as const;

/**
Cursor de agente: punta de flecha pequeña en tinta, con el mismo lenguaje de trazo del plano.
*/
function cursor(x: number, y: number) {
  return path(`M${x} ${y}l0 15l4.2-3.6l2.8 6.2l2.4-1.1l-2.8-6l5.4-.2z`, {
    fill: 'ink',
    stroke: 'paper',
    width: 1,
  });
}

/**
Campo de formulario: rectángulo de papel con una línea de texto simulada.
*/
function field(x: number, y: number, w: number) {
  return group([
    rect(x, y, w, 16, { fill: 'paper', r: 2, width: 1 }),
    line(x + 6, y + 8, x + w * 0.55, y + 8, { stroke: 'faint', width: 2 }),
  ]);
}

export function agentesQueUsanInterfaces(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 54, copy.title, { size: 14.5 }),
    group(
      [
        rect(SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h, { fill: 'sunken', r: 4, width: 1.6 }),
        line(200, SCREEN.y + 12, 200, SCREEN_BOTTOM - 12, {
          dash: '2 4',
          stroke: 'muted',
          width: 1,
        }),
      ],
      motion('draw'),
    ),
    group(
      [
        label(130, SCREEN.y + 22, copy.read, { size: 10, tone: 'muted' }),
        label(300, SCREEN.y + 22, copy.fill, { size: 10, tone: 'muted' }),
        label(490, SCREEN.y + 22, copy.submit, { size: 10, tone: 'accent' }),
      ],
      motion('fade', 300),
    ),
    group(
      [
        field(84, 124, 92),
        field(84, 150, 92),
        rect(84, 180, 56, 18, { fill: 'brandSoft', r: 3, width: 1.2 }),
        field(224, 124, 150),
        field(224, 150, 150),
        field(224, 176, 150),
        rect(224, 210, 64, 18, { fill: 'brandSoft', r: 3, width: 1.2 }),
      ],
      motion('rise', 400),
    ),
    group(
      [
        rect(430, 124, 130, 66, { fill: 'paper', r: 3, width: 1 }),
        rect(440, 210, 110, 22, { fill: 'accentSoft', r: 3, stroke: 'accent', width: 1.6 }),
      ],
      motion('rise', 520),
    ),
    group(
      [
        arrow(
          [
            [118, 262],
            [GATE_X - 30, 262],
          ],
          { flow: true, tone: 'ink', width: 1.2 },
        ),
        cursor(96, 248),
      ],
      motion('fade', 700),
    ),
    group(
      [
        rect(GATE_X - 7, SCREEN.y - 10, 14, SCREEN.h + 20, {
          fill: 'brandSoft',
          r: 3,
          width: 1.6,
        }),
        circle(GATE_X, CURSOR_Y, 13, { fill: 'accent', width: 1.8 }),
        path(`M${GATE_X - 4} ${CURSOR_Y - 4}v-2.5a4 4 0 0 1 8 0v2.5`, {
          stroke: 'paper',
          width: 1.6,
        }),
      ],
      motion('rise', 900),
    ),
    pulse(GATE_X, CURSOR_Y, 22, 1200),
    group(
      [
        label(GATE_X + 22, CURSOR_Y + 42, copy.waiting, {
          anchor: 'start',
          size: 10,
          tone: 'accent',
        }),
      ],
      motion('fade', 1300),
    ),
    group(
      [
        label(GATE_X, SCREEN_BOTTOM + 30, copy.approval, { size: 11, tone: 'accent' }),
        line(SCREEN.x, SCREEN_BOTTOM + 44, SCREEN_RIGHT, SCREEN_BOTTOM + 44, {
          dash: '2 4',
          stroke: 'muted',
          width: 1,
        }),
        label(SCREEN.x, SCREEN_BOTTOM + 64, copy.log, { anchor: 'start', size: 10 }),
      ],
      motion('fade', 1100),
    ),
  );
}
