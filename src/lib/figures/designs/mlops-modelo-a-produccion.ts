import { arrow, figure, group, label, motion, poly, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    data: 'DATA',
    drift: 'DRIFT',
    loop: 'retrain on drift, or retire',
    model: 'MODEL',
    serve: 'SERVE',
    title: 'Every model is a versioned release',
  },
  es: {
    data: 'DATOS',
    drift: 'DERIVA',
    loop: 'reentrenar ante deriva, o retirar',
    model: 'MODELO',
    serve: 'SERVIR',
    title: 'Cada modelo es una versión publicada',
  },
} as const;

const stages = [
  { key: 'data', x: 60 },
  { key: 'model', x: 260 },
  { key: 'serve', x: 460 },
] as const;

/**
Datos, modelo y servicio se versionan por separado. La monitorización de deriva cierra el ciclo:
una señal de deriva dispara reentrenamiento o retirada, nunca un cambio silencioso en producción.
*/
export function mlopsModeloAProduccion(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    stages.map((stage, index) =>
      group(
        [
          rect(stage.x, 150, 120, 70, {
            fill: index === 1 ? 'brandSoft' : 'paper',
            r: 8,
            width: 1.5,
          }),
          label(stage.x + 60, 191, copy[stage.key], { size: 11, tracking: 1.4 }),
        ],
        motion('rise', index * 150),
      ),
    ),
    group(
      [
        arrow(
          [
            [182, 185],
            [256, 185],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [382, 185],
            [456, 185],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 500),
    ),
    group(
      [
        poly(
          [
            [520, 228],
            [520, 300],
            [120, 300],
            [120, 228],
          ],
          { dash: '4 4', stroke: 'muted', width: 1.4 },
        ),
        label(320, 292, copy.loop, { size: 10, tone: 'muted' }),
      ],
      motion('draw', 800),
    ),
  );
}
