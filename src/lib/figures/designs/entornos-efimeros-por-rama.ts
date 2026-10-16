import { arrow, figure, group, heading, label, line, motion, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    branches: ['feat/checkout', 'fix/login-timeout', 'feat/profile'],
    collect: 'EXPIRY',
    destroy: 'DESTROY',
    real: 'NO REAL DATA',
    template: 'TEMPLATE',
    title: 'One template, one environment per branch',
    ttl: 'TTL 3 D',
  },
  es: {
    branches: ['feat/pagos', 'fix/login-timeout', 'feat/perfil'],
    collect: 'CADUCIDAD',
    destroy: 'DESTRUIR',
    real: 'SIN DATOS REALES',
    template: 'PLANTILLA',
    title: 'Una plantilla, un entorno por rama',
    ttl: 'TTL 3 D',
  },
} as const;

const ROW_Y = [130, 200, 270] as const;
const ROW_H = 46;
const INSTANCE_X = 290;
const INSTANCE_W = 190;
const EXPIRY_X = 520;

/**
Una plantilla declarada como código se instancia por cada rama. Cada instancia lleva una caducidad
marcada (TTL): el colector final la recoge y destruye el entorno al vencer. Las cifras son ilustrativas.
*/
export function entornosEfimerosPorRama(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    label(44, 84, copy.title, { anchor: 'start', size: 11, tone: 'ink', tracking: 2.4 }),
    line(44, 96, 596, 96, { dash: '2 4', stroke: 'muted', width: 1 }),
    group(
      [
        rect(44, 170, 150, 110, { fill: 'paper', r: 8, width: 1.6 }),
        heading(119, 214, copy.template, { size: 14 }),
        label(119, 240, 'IaC', { size: 10, tone: 'muted' }),
      ],
      motion('rise', 200),
    ),
    ROW_Y.map((y, index) =>
      group(
        [
          arrow(
            [
              [194, 225],
              [INSTANCE_X - 4, y + ROW_H / 2],
            ],
            { flow: index === 0, tone: 'muted', width: 1.4 },
          ),
          rect(INSTANCE_X, y, INSTANCE_W, ROW_H, {
            fill: 'paper',
            r: 6,
            stroke: index === 0 ? 'accent' : 'ink',
            width: index === 0 ? 2 : 1.4,
          }),
          label(INSTANCE_X + 12, y + 19, copy.branches[index], {
            anchor: 'start',
            size: 11,
            tone: 'ink',
          }),
          label(INSTANCE_X + 12, y + 35, copy.ttl, { anchor: 'start', size: 10, tone: 'muted' }),
        ],
        motion('rise', 400 + index * 160),
      ),
    ),
    group(
      [
        rect(EXPIRY_X - 26, 112, 110, 212, { dash: '4 4', fill: 'sunken', r: 6, stroke: 'muted' }),
        label(EXPIRY_X + 29, 106, copy.collect, { size: 10, tone: 'muted' }),
        ...ROW_Y.map((y) =>
          line(INSTANCE_X + INSTANCE_W, y + ROW_H / 2, EXPIRY_X - 26, y + ROW_H / 2, {
            stroke: 'muted',
            width: 1,
          }),
        ),
      ],
      motion('fade', 900),
    ),
    group(
      [
        rect(EXPIRY_X - 18, 252, 92, 40, { fill: 'accentSoft', r: 6, stroke: 'accent', width: 2 }),
        heading(EXPIRY_X + 28, 277, copy.destroy, { size: 12, tone: 'ink' }),
      ],
      motion('fade', 1200),
    ),
    pulse(EXPIRY_X + 28, 272, 26, 1400),
    group(
      [
        line(44, 320, 596, 320, { dash: '2 4', stroke: 'faint', width: 1 }),
        label(320, 352, copy.real, { size: 11, tone: 'muted', tracking: 2.4 }),
      ],
      motion('fade', 1000),
    ),
  );
}
