import { figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BASE_Y = 340;

const levels = [
  { dash: undefined, fill: 'paper', h: 70, x: 60 },
  { dash: undefined, fill: 'brandSoft', h: 130, x: 240 },
  { dash: '4 4', fill: 'sunken', h: 190, x: 420 },
] as const;

const COPY = {
  en: {
    approval: 'HUMAN APPROVAL',
    names: ['SUGGEST', 'ACT WITHIN A LIMIT', 'UNSUPERVISED'],
    note: 'the highest level needs the most explicit permission',
    title: 'Autonomy levels',
  },
  es: {
    approval: 'APROBACIÓN HUMANA',
    names: ['SUGERIR', 'ACTUAR CON LÍMITE', 'SIN SUPERVISIÓN'],
    note: 'el nivel más alto necesita el permiso más explícito',
    title: 'Autonomía por niveles',
  },
} as const;

/**
Cada nivel de autonomía sube un escalón. Entre el segundo y el tercero hay una aprobación humana
obligatoria: sin ella, el sistema no sube.
*/
export function autonomiaDeLaIa(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    levels.map((level, index) =>
      group(
        [
          rect(level.x, BASE_Y - level.h, 160, level.h, {
            dash: level.dash,
            fill: level.fill,
            r: 6,
            stroke: index === 2 ? 'muted' : 'ink',
            width: 1.5,
          }),
          label(level.x + 80, BASE_Y - level.h + 24, copy.names[index] ?? '', {
            size: 10,
            tone: index === 2 ? 'muted' : 'ink',
            tracking: 1.1,
          }),
        ],
        motion('rise', index * 160),
      ),
    ),
    group(
      [
        line(410, 150, 410, 340, { stroke: 'accent', width: 3 }),
        label(410, 138, copy.approval, { size: 10, tone: 'accent' }),
      ],
      motion('draw', 700),
    ),
    label(320, 372, copy.note, { tone: 'muted' }),
  );
}
