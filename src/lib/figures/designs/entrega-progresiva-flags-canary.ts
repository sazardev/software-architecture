import { arrow, figure, group, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const STEP_Y = 170;
const STEP_W = 140;
const STEP_H = 60;
const stepX = [60, 250, 440] as const;
const STEP_LABELS = ['5 %', '25 %', '100 %'] as const;

const COPY = {
  en: {
    note: 'traffic moves with a flag, not with a deployment',
    rollback: 'rollback: flag off, no deploy',
    title: 'GRADUAL EXPOSURE',
  },
  es: {
    note: 'el tráfico se mueve con una bandera, no con un despliegue',
    rollback: 'revertir: bandera apagada, sin desplegar',
    title: 'EXPOSICIÓN GRADUAL',
  },
} as const;

/**
El tráfico sube por escalones y cada escalón exige métricas sanas. Si algo falla, la bandera
vuelve atrás en segundos, sin esperar a un nuevo despliegue.
*/
export function entregaProgresivaFlagsCanary(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    label(320, 92, copy.title, { size: 10.5, tracking: 2 }),
    stepX.map((x, index) =>
      group(
        [
          rect(x, STEP_Y, STEP_W, STEP_H, { fill: 'paper', r: 8, width: 1.5 }),
          label(x + STEP_W / 2, STEP_Y + 36, STEP_LABELS[index] ?? '', {
            size: 14,
            tracking: 1,
          }),
        ],
        motion('rise', index * 140),
      ),
    ),
    group(
      [
        arrow(
          [
            [204, STEP_Y + STEP_H / 2],
            [246, STEP_Y + STEP_H / 2],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [394, STEP_Y + STEP_H / 2],
            [436, STEP_Y + STEP_H / 2],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 400),
    ),
    group(
      [
        arrow(
          [
            [510, 240],
            [510, 300],
            [130, 300],
            [130, 240],
          ],
          { tone: 'accent' },
        ),
        label(320, 320, copy.rollback, { size: 10.5, tone: 'accent' }),
      ],
      motion('draw', 700),
    ),
    label(320, 372, copy.note, { tone: 'muted' }),
  );
}
