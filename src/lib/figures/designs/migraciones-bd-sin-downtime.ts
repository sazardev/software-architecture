import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const STEP_Y = 170;
const STEP_W = 120;
const STEP_H = 70;

const steps = [
  { accent: false, x: 40 },
  { accent: false, x: 190 },
  { accent: true, x: 340 },
  { accent: false, x: 490 },
] as const;

const COPY = {
  en: {
    notes: ['nullable column', 'write both', 'copy in batches', 'drop the old one'],
    phases: ['1 EXPAND', '2 DUAL WRITE', '3 BACKFILL', '4 CONTRACT'],
    title: 'Four compatible phases',
  },
  es: {
    notes: ['columna nula', 'escribir ambas', 'copiar por lotes', 'quitar la antigua'],
    phases: ['1 EXPANDIR', '2 ESCRIBIR AMBAS', '3 RELLENAR', '4 CONTRAER'],
    title: 'Cuatro fases compatibles',
  },
} as const;

/**
Cada fase cambia una sola cosa y deja la base compatible con la versión anterior de la aplicación.
El backfill es la fase lenta: copia por lotes mientras el servicio sigue funcionando.
*/
export function migracionesBdSinDowntime(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 70, copy.title, { size: 15 }),
    steps.map((step, index) =>
      group(
        [
          rect(step.x, STEP_Y, STEP_W, STEP_H, {
            fill: step.accent ? 'accent' : 'paper',
            r: 8,
            stroke: step.accent ? undefined : 'ink',
            width: 1.5,
          }),
          label(step.x + STEP_W / 2, STEP_Y + 40, copy.phases[index] ?? '', {
            size: 10,
            tone: step.accent ? 'paper' : 'ink',
            tracking: 0.8,
          }),
          label(step.x + STEP_W / 2, STEP_Y + 102, copy.notes[index] ?? '', {
            size: 9.5,
            tone: 'muted',
            tracking: 0.6,
          }),
        ],
        motion('rise', index * 140),
      ),
    ),
    group(
      [
        arrow(
          [
            [164, 205],
            [186, 205],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [314, 205],
            [336, 205],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [464, 205],
            [486, 205],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 500),
    ),
  );
}
