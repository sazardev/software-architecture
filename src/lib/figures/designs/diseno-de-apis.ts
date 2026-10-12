import {
  arrow,
  dimension,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  poly,
  pulse,
  rect,
  type Point,
} from '../figure-kit';
import type { Figure, Tone } from '../figure-types';

type Sheet = Readonly<{ x: number; y: number; w: number; h: number }>;

const v1: Sheet = { h: 190, w: 140, x: 214, y: 60 };
const v2: Sheet = { h: 196, w: 140, x: 286, y: 160 };

const consumers = [
  { name: 'Web', target: [214, 96] as Point, y: 56 },
  { name: 'iOS', target: [214, 164] as Point, y: 132 },
  { name: 'CLI', target: [286, 278] as Point, y: 236 },
  { name: 'B2B', target: [286, 330] as Point, y: 304 },
] as const;

/**
Hoja de contrato con la esquina doblada: el documento que comparten proveedor y consumidores.
*/
function sheet(at: Sheet, stroke: Tone, fill: Tone) {
  const fold = 18;
  const right = at.x + at.w;
  const bottom = at.y + at.h;

  return [
    poly(
      [
        [at.x, at.y],
        [right - fold, at.y],
        [right, at.y + fold],
        [right, bottom],
        [at.x, bottom],
      ],
      { fill, stroke, width: 1.8 },
      true,
    ),
    poly(
      [
        [right - fold, at.y],
        [right - fold, at.y + fold],
        [right, at.y + fold],
      ],
      { stroke, width: 1.2 },
    ),
  ];
}

/**
Campo del esquema: un punto y una barra, como una línea de una especificación.
*/
function field(x: number, y: number, width: number) {
  return [node(x, y, 3.5), line(x + 10, y, x + 10 + width, y, { stroke: 'muted', width: 3 })];
}

export function disenoDeApis(): Figure {
  return figure(
    // Consumidores: cada uno lee la versión que conoce.
    consumers.map((consumer, index) =>
      group(
        [
          rect(30, consumer.y, 110, 44, { fill: 'paper', r: 5 }),
          heading(85, consumer.y + 28, consumer.name, { font: 'mono', size: 14, tracking: 1 }),
          arrow([[140, consumer.y + 22], consumer.target], {
            tone: index < 2 ? 'muted' : 'brand',
            width: 1.4,
          }),
        ],
        motion('rise', 200 + index * 120),
      ),
    ),
    // v1: el contrato publicado, que sigue vivo.
    group(
      [
        ...sheet(v1, 'ink', 'brandSoft'),
        heading(232, 88, 'v1', { anchor: 'start', font: 'mono', size: 15 }),
        ...field(236, 112, 76),
        ...field(236, 134, 58),
        ...field(236, 156, 88),
      ],
      motion('rise', 0),
    ),
    // v2: el mismo contrato más un campo nuevo; nada se quita ni cambia de sentido.
    group(
      [
        ...sheet(v2, 'accent', 'paper'),
        heading(304, 188, 'v2', { anchor: 'start', font: 'mono', size: 15, tone: 'accent' }),
        ...field(308, 212, 76),
        ...field(308, 234, 58),
        ...field(308, 256, 88),
        node(308, 278, 3.5, true),
        line(318, 278, 384, 278, { dash: '4 4', stroke: 'accent', width: 3 }),
        label(398, 282, '+', { anchor: 'start', size: 14, tone: 'accent' }),
        label(356, 336, 'OpenAPI', { size: 10.5, tone: 'ink' }),
      ],
      motion('rise', 160),
    ),
    pulse(308, 278, 12, 900),
    // Proveedor: una sola implementación sirve las dos versiones.
    group(
      [
        rect(486, 168, 124, 74, { fill: 'paper', r: 5, width: 1.6 }),
        heading(548, 200, 'API', { font: 'mono', size: 15, tracking: 2 }),
        label(548, 224, 'HTTP · gRPC', { size: 10 }),
        line(354, 120, 486, 186, { dash: '3 5', stroke: 'muted', width: 1.2 }),
        line(426, 272, 486, 226, { dash: '3 5', stroke: 'muted', width: 1.2 }),
      ],
      motion('rise', 500),
    ),
    dimension([214, 388], [426, 388], 'Deprecation → Sunset'),
  );
}
