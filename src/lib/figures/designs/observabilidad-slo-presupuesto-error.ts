import { arrow, figure, group, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    budgetLeft: '38% left',
    budgetSpent: '62% spent',
    budget: 'ERROR BUDGET',
    slo: 'SLO 99.9%',
    signals: ['LOGS', 'METRICS', 'TRACES'],
  },
  es: {
    budgetLeft: 'restante 38 %',
    budgetSpent: 'consumido 62 %',
    budget: 'PRESUPUESTO DE ERROR',
    slo: 'SLO 99,9 %',
    signals: ['LOGS', 'MÉTRICAS', 'TRAZAS'],
  },
} as const;

const signalX = [60, 255, 450] as const;

/**
Las señales alimentan un SLI; el SLO fija el objetivo y el presupuesto de error es lo que queda
de la tolerancia al fallo en el periodo.
*/
export function observabilidadSloPresupuestoError(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    signalX.map((x, index) =>
      group(
        [
          rect(x, 90, 130, 44, { fill: 'paper', r: 6, width: 1.5 }),
          label(x + 65, 117, copy.signals[index] ?? '', { size: 10.5, tracking: 1.4 }),
        ],
        motion('rise', index * 120),
      ),
    ),
    group(
      [
        arrow(
          [
            [125, 134],
            [300, 186],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [320, 134],
            [320, 184],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [515, 134],
            [340, 186],
          ],
          { tone: 'muted' },
        ),
      ],
      motion('fade', 400),
    ),
    group(
      [
        rect(255, 186, 130, 44, { fill: 'paper', r: 6, width: 1.5 }),
        label(320, 213, 'SLI', { size: 11, tracking: 1.4 }),
      ],
      motion('rise', 500),
    ),
    group(
      [
        arrow(
          [
            [389, 208],
            [414, 208],
          ],
          { tone: 'ink' },
        ),
        rect(420, 186, 160, 44, { fill: 'accent', r: 6, stroke: undefined }),
        label(500, 213, copy.slo, { size: 11, tone: 'paper', tracking: 1.4 }),
      ],
      motion('rise', 650),
    ),
    label(60, 282, copy.budget, { anchor: 'start', size: 10.5, tracking: 1.6 }),
    rect(60, 300, 520, 28, { fill: 'paper', r: 6, width: 1.5 }),
    group([rect(60, 300, 322, 28, { fill: 'brandSoft', r: 6, stroke: undefined })], motion('rise')),
    label(60, 352, copy.budgetSpent, { anchor: 'start', size: 10.5, tone: 'muted' }),
    label(580, 352, copy.budgetLeft, { anchor: 'end', size: 10.5, tone: 'muted' }),
  );
}
