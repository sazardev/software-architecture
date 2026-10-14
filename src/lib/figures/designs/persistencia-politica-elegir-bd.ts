import { figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const BOX_X = [40, 190, 340, 490] as const;

const COPY = {
  en: {
    note: 'one store per access pattern is the price of polyglot persistence',
    stores: ['RELATIONAL', 'DOCUMENT', 'KEY-VALUE', 'SEARCH'],
    patterns: ['joins, transactions', 'whole aggregate', 'lookup by key', 'ranked full text'],
    title: 'Start from the queries, then pick the store',
  },
  es: {
    note: 'un almacén por patrón de acceso es el precio de la persistencia políglota',
    stores: ['RELACIONAL', 'DOCUMENTAL', 'CLAVE-VALOR', 'BÚSQUEDA'],
    patterns: ['joins, transacciones', 'un agregado', 'búsqueda por clave', 'texto con ranking'],
    title: 'Primero las consultas; después el almacén',
  },
} as const;

/**
Cada tipo de almacén responde bien a un patrón de acceso y mal a otros. Antes de elegir, hay que
escribir las consultas y escrituras que el sistema necesita.
*/
export function persistenciaPoliglotaElegirBd(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 66, copy.title, { size: 14 }),
    BOX_X.map((x, index) => {
      const isFirst = index === 0;

      return group(
        [
          rect(x, 130, 136, 120, {
            fill: isFirst ? 'accent' : 'paper',
            r: 8,
            stroke: isFirst ? undefined : 'ink',
            width: 1.5,
          }),
          label(x + 68, 180, copy.stores[index] ?? '', {
            size: 10.5,
            tone: isFirst ? 'paper' : 'ink',
            tracking: 1.1,
          }),
          label(x + 68, 220, copy.patterns[index] ?? '', {
            size: 9.5,
            tone: isFirst ? 'paper' : 'muted',
          }),
        ],
        motion('rise', index * 120),
      );
    }),
    label(320, 318, copy.note, { tone: 'muted' }),
  );
}
