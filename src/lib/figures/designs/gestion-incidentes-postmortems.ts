import { circle, figure, group, heading, label, line, motion, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const ROLE_X = [60, 240, 420] as const;

const COPY = {
  en: {
    roles: ['COMMANDER', 'COMMS', 'OPERATIONS'],
    steps: ['DETECT', 'ACKNOWLEDGE', 'MITIGATE', 'RESOLVE', 'POSTMORTEM'],
    title: 'From alert to postmortem: an incident has phases',
    note: 'the postmortem looks for system failures, not culprits',
  },
  es: {
    roles: ['COORDINADOR', 'COMUNICACIÓN', 'OPERACIÓN'],
    steps: ['DETECTAR', 'RECONOCER', 'MITIGAR', 'RESOLVER', 'POSTMORTEM'],
    title: 'Del aviso al postmortem: un incidente tiene fases',
    note: 'el postmortem busca fallos del sistema, no culpables',
  },
} as const;

/**
Un incidente recorre fases con roles claros. Mitigar va antes que entender la causa, y el
postmortem cierra el ciclo con acciones que tienen dueño y fecha.
*/
export function gestionIncidentesPostmortems(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 66, copy.title, { size: 14 }),
    line(60, 200, 540, 200, { stroke: 'ink', width: 1.6 }),
    copy.steps.map((step, index) => {
      const x = 60 + index * 120;
      const isMitigate = index === 2;

      return group(
        [
          circle(x, 200, 9, { fill: isMitigate ? 'accent' : 'paper', width: 1.6 }),
          label(x, 232, step, { size: 9.5, tracking: 0.8 }),
        ],
        motion('rise', index * 120),
      );
    }),
    pulse(300, 200, 16, 700),
    ROLE_X.map((x, index) =>
      group(
        [
          rect(x, 290, 160, 40, { fill: 'paper', r: 6, width: 1.4 }),
          label(x + 80, 315, copy.roles[index] ?? '', { size: 10, tracking: 1.2 }),
        ],
        motion('fade', 600 + index * 120),
      ),
    ),
    label(320, 362, copy.note, { tone: 'muted' }),
  );
}
