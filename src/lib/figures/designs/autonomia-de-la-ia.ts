import { figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

const BASE_Y = 340;

const levels = [
  { dash: undefined, fill: 'paper', h: 70, name: 'SUGERIR', x: 60 },
  { dash: undefined, fill: 'brandSoft', h: 130, name: 'ACTUAR CON LÍMITE', x: 240 },
  { dash: '4 4', fill: 'sunken', h: 190, name: 'SIN SUPERVISIÓN', x: 420 },
] as const;

/**
Cada nivel de autonomía sube un escalón. Entre el segundo y el tercero hay una aprobación humana
obligatoria: sin ella, el sistema no sube.
*/
export function autonomiaDeLaIa(): Figure {
  return figure(
    heading(320, 60, 'Autonomía por niveles', { size: 15 }),
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
          label(level.x + 80, BASE_Y - level.h + 24, level.name, {
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
        label(410, 138, 'APROBACIÓN HUMANA', { size: 10, tone: 'accent' }),
      ],
      motion('draw', 700),
    ),
    label(320, 372, 'el nivel más alto necesita el permiso más explícito', { tone: 'muted' }),
  );
}
