import { arrow, figure, group, heading, label, motion, node, pulse, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const WINDOW_X = 320;
const WINDOW_Y = 96;
const WINDOW_W = 280;
const WINDOW_H = 224;
const GATE_X = 262;
const GATE_CY = 206;
const CHIP_X = 44;
const CHIP_W = 150;
const CHIP_H = 30;

const COPY = {
  en: {
    filter: 'FILTER',
    footer: 'more context is not more attention: every token competes with the rest',
    layers: ['system · rules (stable)', 'tools · schemas', 'recent history', 'current task'],
    sources: ['INSTRUCTIONS', 'TOOLS', 'HISTORY', 'DOCUMENTS', 'STATE'],
    title: 'Context: what enters the window',
    window: 'WINDOW',
  },
  es: {
    filter: 'FILTRO',
    footer: 'más contexto no es más atención: cada token compite con los demás',
    layers: [
      'sistema · reglas (estable)',
      'herramientas · esquemas',
      'historial reciente',
      'tarea actual',
    ],
    sources: ['INSTRUCCIONES', 'HERRAMIENTAS', 'HISTORIAL', 'DOCUMENTOS', 'ESTADO'],
    title: 'Contexto: qué entra en la ventana',
    window: 'VENTANA',
  },
} as const;

const SOURCE_CENTERS = [111, 157, 203, 249, 295] as const;

// Estable (sunken), herramientas (brandSoft) y tarea actual (accent, la idea clave).
const LAYER_FILLS = ['sunken', 'brandSoft', 'sunken', 'accent'] as const;

/**
Ventana de contexto como recurso escaso: fuentes de distinta persistencia pasan por un filtro que
decide qué entra, y la ventana solo recibe lo que la tarea necesita en ese paso.
*/
export function contextEngineeringYMemoria(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 56, copy.title, { size: 15 }),
    SOURCE_CENTERS.map((cy, index) =>
      group(
        [
          rect(CHIP_X, cy - CHIP_H / 2, CHIP_W, CHIP_H, { fill: 'paper', r: 15, width: 1.2 }),
          label(CHIP_X + CHIP_W / 2, cy + 4, copy.sources[index] ?? '', { size: 10.5 }),
          arrow(
            [
              [CHIP_X + CHIP_W + 4, cy],
              [GATE_X - 6, GATE_CY + (cy - GATE_CY) * 0.35],
            ],
            { tone: 'ink', width: 1 },
          ),
        ],
        motion('rise', 100 + index * 90),
      ),
    ),
    group(
      [
        rect(GATE_X, WINDOW_Y - 4, 18, WINDOW_H + 8, { fill: 'brandSoft', r: 3, width: 1.4 }),
        label(GATE_X + 9, WINDOW_Y - 14, copy.filter, { size: 10 }),
      ],
      motion('fade', 300),
    ),
    pulse(GATE_X + 9, GATE_CY, 22, 900),
    node(GATE_X + 9, GATE_CY, 6, true, { width: 1.2 }),
    arrow(
      [
        [GATE_X + 24, GATE_CY],
        [WINDOW_X - 8, GATE_CY],
      ],
      { tone: 'ink', flow: true, width: 1.6 },
    ),
    group(
      [
        rect(WINDOW_X, WINDOW_Y, WINDOW_W, WINDOW_H, { fill: 'paper', r: 14, width: 1.6 }),
        label(WINDOW_X + WINDOW_W / 2, WINDOW_Y + WINDOW_H + 20, copy.window, { size: 10 }),
      ],
      motion('rise', 500),
    ),
    copy.layers.map((text, index) =>
      group(
        [
          rect(WINDOW_X + 16, WINDOW_Y + 16 + index * 48, WINDOW_W - 32, 36, {
            fill: LAYER_FILLS[index] ?? 'sunken',
            r: 8,
            width: 1,
          }),
          label(WINDOW_X + 32, WINDOW_Y + 38 + index * 48, text, {
            anchor: 'start',
            size: 10.5,
            tone: index === 3 ? 'paper' : 'ink',
          }),
        ],
        motion('rise', 700 + index * 120),
      ),
    ),
    label(320, 360, copy.footer, { size: 10, tone: 'muted', tracking: 0.4 }),
  );
}
