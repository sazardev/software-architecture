import {
  circle,
  dimension,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const CX = 236;
const CY = 200;

type Layer = Readonly<{
  dash?: string;
  fill: 'brandSoft' | 'paper' | 'sunken';
  r: number;
  tags: readonly Readonly<{ angle: number; text: string }>[];
}>;

// Capas accidentales, de fuera hacia dentro: plataforma, integración y persistencia.
const layers: readonly Layer[] = [
  {
    dash: '5 7',
    fill: 'sunken',
    r: 168,
    tags: [
      { angle: -90, text: 'K8S' },
      { angle: 180, text: 'CI' },
      { angle: 90, text: 'YAML' },
      { angle: 0, text: 'SDK' },
    ],
  },
  {
    fill: 'brandSoft',
    r: 126,
    tags: [
      { angle: -135, text: 'MQ' },
      { angle: -45, text: 'CACHE' },
      { angle: 135, text: 'DTO' },
      { angle: 45, text: 'ORM' },
    ],
  },
  {
    fill: 'paper',
    r: 86,
    tags: [
      { angle: -90, text: 'SQL' },
      { angle: 90, text: 'HTTP' },
    ],
  },
];

function ringTag(radius: number, angle: number, text: string) {
  const rad = (angle * Math.PI) / 180;
  const x = CX + radius * Math.cos(rad);
  const y = CY + radius * Math.sin(rad) + 4;

  return label(Math.round(x), Math.round(y), text, { size: 10.5, tone: 'ink' });
}

function layer(item: Layer, index: number, inner: number) {
  const mid = (item.r + inner) / 2;

  return group(
    [
      circle(CX, CY, item.r, {
        dash: item.dash,
        fill: item.fill,
        stroke: index === 0 ? 'muted' : 'ink',
        width: index === 0 ? 1.2 : 1.5,
      }),
      ...item.tags.map((tag) => ringTag(mid, tag.angle, tag.text)),
    ],
    motion('rise', index * 160),
  );
}

// Barra de coste: un tramo corto esencial frente a un tramo largo accidental.
const BAR_X = 506;
const BAR_TOP = 70;
const BAR_SPLIT = 286;
const BAR_BOTTOM = 330;

export function complejidadEsencialYAccidental(): Figure {
  return figure(
    layers.map((item, index) => layer(item, index, layers[index + 1]?.r ?? 44)),
    group(
      [
        circle(CX, CY, 44, { fill: 'accent', width: 1.8 }),
        heading(CX, CY + 7, 'f(x)', { size: 20 }),
      ],
      motion('fade', 600),
    ),
    pulse(CX, CY, 52, 1000),
    // Lectura del coste: la mayor parte de la barra es lo que rodea al núcleo.
    group(
      [
        rect(BAR_X, BAR_TOP, 44, BAR_SPLIT - BAR_TOP, { fill: 'brandSoft', r: 2 }),
        line(BAR_X, 142, BAR_X + 44, 142, { stroke: 'muted', width: 1 }),
        line(BAR_X, 214, BAR_X + 44, 214, { stroke: 'muted', width: 1 }),
        rect(BAR_X, BAR_SPLIT, 44, BAR_BOTTOM - BAR_SPLIT, { fill: 'accent', r: 2 }),
        label(BAR_X + 22, 54, 'Σ', { size: 13, tone: 'ink' }),
      ],
      motion('rise', 700),
    ),
    dimension([BAR_X + 64, BAR_TOP], [BAR_X + 64, BAR_SPLIT - 4], 'n×', { offset: -16 }),
    dimension([BAR_X + 64, BAR_SPLIT + 4], [BAR_X + 64, BAR_BOTTOM], '1×', { offset: -16 }),
    line(CX + 44, CY + 30, BAR_X - 4, BAR_SPLIT + 22, {
      dash: '2 4',
      stroke: 'muted',
      width: 1.2,
    }),
    label(BAR_X + 22, 356, 'Brooks 1986', { size: 10 }),
  );
}
