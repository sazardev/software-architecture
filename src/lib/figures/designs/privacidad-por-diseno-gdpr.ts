import { arrow, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const STAGE_X = [40, 180, 320, 460] as const;
const COPY_X = [60, 245, 430] as const;

const COPY = {
  en: {
    copies: ['BACKUPS', 'LOGS', 'ANALYTICS'],
    note: 'one retention period per store, and one deletion job that checks them all',
    stages: ['COLLECT', 'USE', 'RETAIN', 'DELETE'],
    title: 'Personal data has a lifecycle; deletion must reach every copy',
  },
  es: {
    copies: ['RESPALDOS', 'LOGS', 'ANALÍTICA'],
    note: 'un plazo de conservación por almacén y un borrado que verifica cada uno',
    stages: ['RECOGER', 'USAR', 'CONSERVAR', 'BORRAR'],
    title: 'Los datos personales tienen ciclo de vida: el borrado llega a cada copia',
  },
} as const;

/**
Los datos siguen un ciclo: se recogen, se usan, se conservan con plazo y se borran. El borrado debe
propagarse también a respaldos, logs y analítica, o la eliminación queda incompleta.
*/
export function privacidadPorDisenoGdpr(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 66, copy.title, { size: 14 }),
    copy.stages.map((name, index) => {
      const isDelete = index === copy.stages.length - 1;

      return group(
        [
          rect(STAGE_X[index] ?? 0, 150, 120, 50, {
            fill: isDelete ? 'accent' : 'paper',
            r: 8,
            stroke: isDelete ? undefined : 'ink',
            width: 1.5,
          }),
          label((STAGE_X[index] ?? 0) + 60, 180, name, {
            size: 11,
            tone: isDelete ? 'paper' : 'ink',
            tracking: 1.2,
          }),
        ],
        motion('rise', index * 120),
      );
    }),
    [0, 1, 2].map((index) =>
      arrow(
        [
          [(STAGE_X[index] ?? 0) + 126, 175],
          [(STAGE_X[index + 1] ?? 0) - 6, 175],
        ],
        { tone: 'ink' },
      ),
    ),
    COPY_X.map((x, index) =>
      group(
        [
          line(520, 200, x + 75, 268, { dash: '4 4', stroke: 'muted', width: 1.3 }),
          rect(x, 270, 150, 40, { dash: '4 4', fill: 'sunken', r: 8, stroke: 'muted', width: 1.4 }),
          label(x + 75, 295, copy.copies[index] ?? '', {
            size: 10.5,
            tone: 'muted',
            tracking: 1.2,
          }),
        ],
        motion('fade', 700 + index * 120),
      ),
    ),
    label(320, 362, copy.note, { tone: 'muted' }),
  );
}
