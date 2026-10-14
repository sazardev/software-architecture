import { figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const ROW_Y = [140, 210, 280] as const;

const COPY = {
  en: {
    active: 'ACTIVE',
    catalog: 'SERVICE CATALOG · ONE ROW PER SERVICE',
    deprecated: 'DEPRECATED',
    note: 'every deprecated API carries a sunset date',
    owners: ['team A', 'team B', 'team C'],
    services: ['ORDERS API', 'PAYMENTS API', 'SEARCH API'],
    title: 'Every service has an owner, a state and a contract',
  },
  es: {
    active: 'ACTIVA',
    catalog: 'CATÁLOGO DE SERVICIOS · UNA FILA POR SERVICIO',
    deprecated: 'OBSOLETA',
    note: 'cada API obsoleta lleva una fecha de retiro',
    owners: ['equipo A', 'equipo B', 'equipo C'],
    services: ['API DE PEDIDOS', 'API DE PAGOS', 'API DE BÚSQUEDA'],
    title: 'Cada servicio tiene dueño, estado y contrato',
  },
} as const;

const states = [{ deprecated: false }, { deprecated: true }, { deprecated: false }] as const;

/**
El catálogo es una tabla viva: cada servicio tiene un dueño, un estado y un contrato publicado.
Una API obsoleta no desaparece en silencio; figura con su fecha de retiro hasta que se apaga.
*/
export function catalogoServiciosGobiernoApis(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    label(320, 112, copy.catalog, { size: 10, tone: 'muted', tracking: 1.6 }),
    ROW_Y.map((y, index) => {
      const state = states[index];
      const isDeprecated = state?.deprecated ?? false;

      return group(
        [
          rect(60, y, 520, 48, { fill: 'paper', r: 6, width: 1.4 }),
          label(80, y + 29, copy.services[index] ?? '', {
            anchor: 'start',
            size: 10.5,
            tracking: 1.2,
          }),
          label(300, y + 29, copy.owners[index] ?? '', {
            anchor: 'start',
            size: 10,
            tone: 'muted',
          }),
          rect(462, y + 12, 98, 24, {
            fill: isDeprecated ? 'accent' : 'brandSoft',
            r: 12,
            stroke: isDeprecated ? undefined : 'ink',
            width: 1.2,
          }),
          label(511, y + 28, isDeprecated ? copy.deprecated : copy.active, {
            size: 9.5,
            tone: isDeprecated ? 'paper' : 'ink',
            tracking: 1,
          }),
        ],
        motion('rise', index * 140),
      );
    }),
    label(320, 368, copy.note, { size: 10, tone: 'muted' }),
  );
}
