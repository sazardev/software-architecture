import { figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    abac: 'ABAC',
    abacExample: 'dept = finance',
    abacKind: 'attributes',
    rebac: 'ReBAC',
    rebacExample: 'owner of the doc',
    rbac: 'RBAC',
    rbacExample: 'role: editor',
    rbacKind: 'roles',
    rebacKind: 'relationships',
    title: 'Three ways to ask "who may do this?"',
  },
  es: {
    abac: 'ABAC',
    abacExample: 'depto = finanzas',
    abacKind: 'atributos',
    rebac: 'ReBAC',
    rebacExample: 'dueño del doc',
    rbac: 'RBAC',
    rbacExample: 'rol: editor',
    rbacKind: 'roles',
    rebacKind: 'relaciones',
    title: 'Tres formas de preguntar «¿quién puede hacer esto?»',
  },
} as const;

/**
Cada modelo responde la misma pregunta con una fuente distinta de verdad: el rol de la persona,
sus atributos o su relación con el recurso. Elegir mal obliga a duplicar reglas en cada servicio.
*/
export function autorizacionRbacAbacRebac(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];
  const cards = [
    { example: copy.rbacExample, kind: copy.rbacKind, name: copy.rbac, x: 50 },
    { example: copy.abacExample, kind: copy.abacKind, name: copy.abac, x: 240 },
    { example: copy.rebacExample, kind: copy.rebacKind, name: copy.rebac, x: 430 },
  ] as const;

  return figure(
    heading(320, 66, copy.title, { size: 15 }),
    cards.map((card, index) =>
      group(
        [
          rect(card.x, 120, 160, 200, {
            fill: index === 2 ? 'accent' : 'paper',
            r: 10,
            stroke: index === 2 ? undefined : 'ink',
            width: 1.5,
          }),
          label(card.x + 80, 160, card.name, {
            size: 13,
            tone: index === 2 ? 'paper' : 'ink',
            tracking: 1.6,
          }),
          label(card.x + 80, 190, card.kind, {
            size: 10,
            tone: index === 2 ? 'paper' : 'muted',
          }),
          rect(card.x + 16, 230, 128, 56, {
            fill: index === 2 ? 'paper' : 'brandSoft',
            r: 6,
            stroke: undefined,
          }),
          label(card.x + 80, 262, card.example, { size: 9, tone: 'ink' }),
        ],
        motion('rise', index * 150),
      ),
    ),
  );
}
