import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    agents: 'AGENTS',
    architect: 'ARCHITECT',
    footer: 'FLOW METRICS, NOT TYPING',
    spec: 'SPEC',
    title: 'Specify, delegate, verify',
  },
  es: {
    agents: 'AGENTES',
    architect: 'ARQUITECTO',
    footer: 'MÉTRICAS DE FLUJO, NO DE TECLEO',
    spec: 'ESPECIFICACIÓN',
    title: 'Especificar, delegar, verificar',
  },
} as const;

const SPEC_ROWS = [0, 1, 2, 3] as const;
const AGENT_Y = [130, 195, 260] as const;

/**
El arquitecto como puesto de control: la especificación entra, los agentes ejecutan y nada llega
a producción sin pasar por la verificación. Las métricas miden el flujo, no las líneas escritas.
*/
export function trabajoDelArquitectoConAgentes(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 56, copy.title, { size: 15 }),
    group(
      [
        rect(44, 118, 150, 156, { fill: 'sunken', r: 6, width: 1.4 }),
        label(119, 146, copy.spec, { size: 11, tracking: 1.4 }),
        ...SPEC_ROWS.map((index) =>
          line(68, 168 + index * 22, index === 3 ? 120 : 170, 168 + index * 22, {
            stroke: 'muted',
            width: 1.2,
          }),
        ),
      ],
      motion('rise', 200),
    ),
    group(
      [
        arrow(
          [
            [200, 196],
            [296, 196],
          ],
          { flow: true, width: 2 },
        ),
        arrow(
          [
            [344, 196],
            [496, 196],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
      ],
      motion('fade', 300),
    ),
    group(
      [
        rect(306, 100, 28, 192, { fill: 'brandSoft', r: 4, width: 1.5 }),
        circle(320, 196, 22, { fill: 'paper', stroke: 'accent', width: 2 }),
        path('M311 196l6 6l12-12', { stroke: 'accent', width: 2.2 }),
        label(320, 318, copy.architect, { size: 11, tone: 'ink', tracking: 1.4 }),
      ],
      motion('rise', 400),
    ),
    pulse(320, 196, 34, 800),
    group([
      ...AGENT_Y.map((y, index) =>
        group(
          [
            circle(528, y, 16, { fill: 'brandSoft', width: 1.6 }),
            label(528, y + 4, 'AI', { font: 'mono', size: 11, tone: 'ink' }),
          ],
          motion('rise', 500 + index * 120),
        ),
      ),
      label(528, 318, copy.agents, { size: 11, tone: 'ink', tracking: 1.4 }),
    ]),
    line(44, 344, 596, 344, { dash: '2 4', stroke: 'muted', width: 1 }),
    label(320, 372, copy.footer, { size: 11, tone: 'muted' }),
  );
}
