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
  rect,
} from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const LANE = 190;

const COPY = {
  en: {
    completeness: 'COMPLETENESS',
    duplicates: 'DUPLICATES',
    freshness: 'FRESHNESS',
    human: 'human sampling check',
    license: 'LICENCE',
    model: 'MODEL',
    rights: 'RIGHTS',
    sources: 'SOURCES',
    synthetic: 'SYNTHETIC',
    title: 'Data for AI: quality, synthetic and licence',
  },
  es: {
    completeness: 'COMPLETITUD',
    duplicates: 'DUPLICADOS',
    freshness: 'VIGENCIA',
    human: 'verificación humana por muestreo',
    license: 'LICENCIA',
    model: 'MODELO',
    rights: 'DERECHOS',
    sources: 'FUENTES',
    synthetic: 'SINTÉTICO',
    title: 'Datos para IA: calidad, sintéticos y licencias',
  },
} as const;

const gates = [
  { x: 220, key: 'completeness' },
  { x: 310, key: 'freshness' },
  { x: 400, key: 'duplicates' },
] as const;

/**
Una tubería de datos: las fuentes pasan por filtros de calidad, los sintéticos entran por una
rama que se valida igual, y solo llega al modelo lo que supera la compuerta de licencia.
*/
export function calidadDatosParaIa(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    line(40, LANE, 600, LANE, { dash: '2 4', stroke: 'faint', width: 1 }),
    group(
      [
        rect(40, LANE - 30, 110, 60, { fill: 'paper', r: 6, width: 1.4 }),
        label(95, LANE + 4, copy.sources, { size: 10.5, tracking: 1.2 }),
      ],
      motion('rise'),
    ),
    group(
      [
        arrow(
          [
            [150, LANE],
            [211, LANE],
          ],
          { flow: true, width: 1.6 },
        ),
        arrow(
          [
            [229, LANE],
            [301, LANE],
          ],
          { flow: true, width: 1.6 },
        ),
        arrow(
          [
            [319, LANE],
            [391, LANE],
          ],
          { flow: true, width: 1.6 },
        ),
        arrow(
          [
            [409, LANE],
            [485, LANE],
          ],
          { flow: true, width: 1.6 },
        ),
      ],
      motion('fade', 300),
    ),
    gates.map((gate, index) =>
      group(
        [
          rect(gate.x - 8, LANE - 44, 16, 88, { fill: 'brandSoft', r: 3, width: 1.6 }),
          path(`M${gate.x - 4} ${LANE + 1}l3 3l5.5-6.5`, { stroke: 'ink', width: 1.8 }),
          label(gate.x, LANE - 62, copy[gate.key], { size: 9.5, tracking: 0.6 }),
        ],
        motion('rise', 400 + index * 160),
      ),
    ),
    group(
      [
        rect(175 - 58, 300, 116, 44, { dash: '4 4', fill: 'paper', r: 6, stroke: 'muted' }),
        label(175, 327, copy.synthetic, { size: 10.5, tone: 'muted', tracking: 1.2 }),
        arrow(
          [
            [175, 298],
            [175, 198],
          ],
          { tone: 'muted', width: 1.3 },
        ),
        label(175, 362, copy.human, { size: 10, tone: 'muted' }),
      ],
      motion('fade', 700),
    ),
    group(
      [
        rect(486, LANE - 64, 12, 128, { fill: 'accent', r: 2, stroke: undefined }),
        circle(492, LANE, 9, { fill: 'paper', width: 1.6 }),
        path(`M488.5 ${LANE}l2.5 2.5l4.5-5`, { stroke: 'accent', width: 1.8 }),
        label(492, LANE - 80, copy.license, { size: 10, tone: 'ink', tracking: 1.2 }),
        label(492, LANE + 84, copy.rights, { size: 10, tracking: 1.2 }),
      ],
      motion('rise', 1000),
    ),
    group(
      [
        arrow(
          [
            [508, LANE],
            [528, LANE],
          ],
          { flow: true, width: 1.6 },
        ),
        rect(532, LANE - 30, 68, 60, { fill: 'brandSoft', r: 6, width: 1.4 }),
        label(566, LANE + 4, copy.model, { size: 10.5, tone: 'ink', tracking: 1.2 }),
      ],
      motion('fade', 1200),
    ),
  );
}
