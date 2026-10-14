import { circle, figure, group, heading, label, line, motion, node, pulse } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const TEAM_X = 170;
const TEAM_Y = 200;
const TEAM_R = 90;
const SPECTRUM_Y = 300;

const COPY = {
  en: {
    consult: 'CONSULT',
    decide: 'DECIDE',
    delegate: 'DELEGATE',
    question: 'reversible? low impact? then delegate',
    spectrum: 'HOW MUCH YOU DECIDE',
    team: 'TEAM',
    title: 'The architect shapes the decision, the team owns it',
  },
  es: {
    consult: 'CONSULTAR',
    decide: 'DECIDIR',
    delegate: 'DELEGAR',
    question: '¿reversible? ¿impacto bajo? entonces delegar',
    spectrum: 'CUÁNTO DECIDES TÚ',
    team: 'EQUIPO',
    title: 'El arquitecto da forma; el equipo es dueño',
  },
} as const;

const members = [
  { x: 170, y: 110 },
  { x: 256, y: 172 },
  { x: 223, y: 273 },
  { x: 117, y: 273 },
  { x: 84, y: 172 },
] as const;

/**
El arquitecto participa en el círculo del equipo como un miembro más y no como un juez externo. Cuánto
decide él depende del impacto y de la reversibilidad de cada decisión.
*/
export function arquitectoComoFacilitador(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    group(
      [
        circle(TEAM_X, TEAM_Y, TEAM_R, { fill: 'paper', width: 1.5 }),
        label(TEAM_X, TEAM_Y + 4, copy.team, { size: 10.5, tracking: 2 }),
      ],
      motion('rise'),
    ),
    members.map((member, index) =>
      group([node(member.x, member.y, 7, index === 0)], motion('fade', 200 + index * 100)),
    ),
    pulse(members[0].x, members[0].y, 16, 900),
    group(
      [
        line(340, SPECTRUM_Y, 600, SPECTRUM_Y, { stroke: 'ink', width: 1.6 }),
        label(340, SPECTRUM_Y + 26, copy.decide, { anchor: 'start', size: 10.5, tone: 'muted' }),
        label(470, SPECTRUM_Y + 26, copy.consult, { size: 10.5, tone: 'accent' }),
        label(600, SPECTRUM_Y + 26, copy.delegate, { anchor: 'end', size: 10.5, tone: 'muted' }),
        circle(470, SPECTRUM_Y, 8, { fill: 'accent', width: 1.8 }),
      ],
      motion('draw', 600),
    ),
    label(470, SPECTRUM_Y - 18, copy.spectrum, { size: 10, tracking: 1.6, tone: 'muted' }),
    label(470, 370, copy.question, { size: 10.5, tone: 'muted' }),
  );
}
