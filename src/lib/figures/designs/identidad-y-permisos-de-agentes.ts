import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const DOOR_TOP = 150;
const DOOR_H = 100;
const AGENT_X = 96;
const AGENT_Y = 200;
const AUDIT_Y = 318;
const LABEL_Y = 276;

const COPY = {
  en: {
    agent: 'AI',
    agentName: 'AGENT',
    approve: 'APPROVE',
    audit: 'AUDIT LOG: WHO ASKED FOR WHAT',
    delete: 'DELETE',
    note: 'each door, its own key; the risky one asks for approval',
    read: 'READ',
    title: 'One agent, one key per door',
    write: 'WRITE',
  },
  es: {
    agent: 'IA',
    agentName: 'AGENTE',
    approve: 'APROBAR',
    audit: 'REGISTRO: QUIÉN PIDIÓ QUÉ',
    delete: 'BORRAR',
    note: 'cada puerta, su llave; la de riesgo pide aprobación',
    read: 'LEER',
    title: 'Un agente con llave por puerta',
    write: 'ESCRIBIR',
  },
} as const;

const doors = [
  { x: 230, tone: 'brandSoft' },
  { x: 340, tone: 'brandSoft' },
] as const;

const APPROVAL_X = 450;
const DELETE_X = 560;

/**
Llaves por puerta: el agente lee con una llave amplia de solo lectura y escribe con otra acotada.
La acción de riesgo cruza una puerta de aprobación; el borrado queda detrás y sin llave.
*/
export function identidadYPermisosDeAgentes(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    group(
      [
        circle(AGENT_X, AGENT_Y, 30, { fill: 'paper', width: 1.8 }),
        heading(AGENT_X, AGENT_Y + 5, copy.agent, { font: 'mono', size: 13, tone: 'accent' }),
        label(AGENT_X, AGENT_Y + 52, copy.agentName, { size: 10.5, tracking: 2 }),
      ],
      motion('fade', 200),
    ),
    arrow(
      [
        [132, AGENT_Y],
        [206, AGENT_Y],
      ],
      { flow: true, tone: 'accent', width: 2 },
    ),
    doors.map((door, index) => {
      const scope = index === 0 ? copy.read : copy.write;

      return group(
        [
          rect(door.x - 8, DOOR_TOP, 16, DOOR_H, { fill: door.tone, r: 3, width: 1.6 }),
          circle(door.x - 6, DOOR_TOP - 32, 6, { fill: 'paper', width: 1.6 }),
          line(door.x, DOOR_TOP - 32, door.x + 14, DOOR_TOP - 32, { stroke: 'ink', width: 1.6 }),
          line(door.x + 10, DOOR_TOP - 32, door.x + 10, DOOR_TOP - 25, {
            stroke: 'ink',
            width: 1.6,
          }),
          label(door.x, LABEL_Y, scope, { size: 10.5, tone: 'ink' }),
        ],
        motion('rise', 400 + index * 140),
      );
    }),
    arrow(
      [
        [248, AGENT_Y],
        [322, AGENT_Y],
      ],
      { tone: 'ink' },
    ),
    arrow(
      [
        [358, AGENT_Y],
        [432, AGENT_Y],
      ],
      { tone: 'ink' },
    ),
    // Puerta de aprobación: el único punto donde una persona decide.
    group(
      [
        rect(APPROVAL_X - 8, DOOR_TOP, 16, DOOR_H, {
          fill: 'accentSoft',
          r: 3,
          stroke: 'accent',
          width: 1.8,
        }),
        circle(APPROVAL_X, DOOR_TOP - 32, 12, { fill: 'accent', width: 1.6 }),
        path(`M${APPROVAL_X - 5} ${DOOR_TOP - 32}l3.4 3.6l6-7`, { stroke: 'paper', width: 2 }),
        label(APPROVAL_X, LABEL_Y, copy.approve, { size: 10.5, tone: 'accent' }),
      ],
      motion('rise', 820),
    ),
    pulse(APPROVAL_X, AGENT_Y, 24, 900),
    arrow(
      [
        [468, AGENT_Y],
        [DELETE_X - 24, AGENT_Y],
      ],
      { dash: '2 3', tone: 'muted' },
    ),
    // Borrado: sin llave, solo se abre si la aprobación se concedió a esa acción concreta.
    group(
      [
        rect(DELETE_X - 8, DOOR_TOP, 16, DOOR_H, {
          dash: '3 3',
          fill: 'sunken',
          stroke: 'muted',
          width: 1.2,
        }),
        label(DELETE_X, LABEL_Y, copy.delete, { size: 10.5, tone: 'muted' }),
      ],
      motion('rise', 1000),
    ),
    // Registro: cada puerta deja una marca en la misma línea de auditoría.
    line(44, AUDIT_Y, 596, AUDIT_Y, { dash: '2 4', stroke: 'muted', width: 1 }),
    group(
      [
        node(230, AUDIT_Y, 4),
        node(340, AUDIT_Y, 4),
        node(APPROVAL_X, AUDIT_Y, 4, true),
        node(DELETE_X, AUDIT_Y, 4),
      ],
      motion('fade', 1200),
    ),
    label(320, AUDIT_Y + 22, copy.audit, { size: 10.5, tone: 'muted' }),
    label(320, 370, copy.note, { size: 10.5, tone: 'muted' }),
  );
}
