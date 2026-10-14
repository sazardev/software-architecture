import { figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    cash: 'CASH 100',
    credit: 'CREDIT',
    debit: 'DEBIT',
    note: 'reversal: a new entry that cancels the old one',
    reversalDebit: 'REVENUE 100',
    reversalCredit: 'CASH 100',
    revenue: 'REVENUE 100',
    title: 'Immutable entries: corrections are reversals',
  },
  es: {
    cash: 'CAJA 100',
    credit: 'HABER',
    debit: 'DEBE',
    note: 'contraasiento: un asiento nuevo que anula el anterior',
    reversalDebit: 'INGRESO 100',
    reversalCredit: 'CAJA 100',
    revenue: 'INGRESO 100',
    title: 'Asientos inmutables: las correcciones son contraasientos',
  },
} as const;

/**
Cada cobro es un asiento de partida doble con el mismo importe en debe y en haber. Un error no se
edita: se anula con un contraasiento, y el asiento original sigue en el libro.
*/
export function pagosLibroMayorLedger(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 66, copy.title, { size: 14 }),
    label(180, 118, copy.debit, { size: 11, tone: 'muted', tracking: 2 }),
    label(460, 118, copy.credit, { size: 11, tone: 'muted', tracking: 2 }),
    group(
      [
        rect(60, 150, 240, 50, { fill: 'paper', r: 8, width: 1.5 }),
        label(180, 180, copy.cash, { size: 12, tracking: 1.2 }),
        rect(340, 150, 240, 50, { fill: 'paper', r: 8, width: 1.5 }),
        label(460, 180, copy.revenue, { size: 12, tracking: 1.2 }),
      ],
      motion('rise'),
    ),
    group(
      [
        rect(60, 230, 240, 50, { fill: 'accentSoft', r: 8, stroke: 'accent', width: 1.6 }),
        label(180, 260, copy.reversalDebit, { size: 12, tone: 'accent', tracking: 1.2 }),
        rect(340, 230, 240, 50, { fill: 'accentSoft', r: 8, stroke: 'accent', width: 1.6 }),
        label(460, 260, copy.reversalCredit, { size: 12, tone: 'accent', tracking: 1.2 }),
      ],
      motion('rise', 400),
    ),
    label(320, 324, copy.note, { tone: 'muted' }),
  );
}
