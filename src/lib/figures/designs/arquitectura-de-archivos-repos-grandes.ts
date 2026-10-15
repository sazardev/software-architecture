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

type Point = readonly [number, number];

type ModuleBox = Readonly<{
  frame: Readonly<{ h: number; w: number; x: number; y: number }>;
  links: readonly (readonly [Point, Point])[];
  nodes: readonly Point[];
}>;

const COPY = {
  en: {
    bypass: 'DIRECT ACCESS TO INTERNALS',
    modules: ['ORDERS', 'PAYMENTS', 'CATALOG'],
    title: 'Modules talk only through their doors',
  },
  es: {
    bypass: 'ACCESO DIRECTO A LO INTERNO',
    modules: ['PEDIDOS', 'PAGOS', 'CATÁLOGO'],
    title: 'Los módulos se hablan solo por sus puertas',
  },
} as const;

// Cada módulo: un marco, sus archivos internos y cómo se enlazan entre sí.
const MODULES: readonly ModuleBox[] = [
  {
    frame: { h: 240, w: 200, x: 44, y: 104 },
    links: [
      [
        [72, 170],
        [118, 158],
      ],
      [
        [118, 158],
        [168, 176],
      ],
      [
        [72, 170],
        [88, 240],
      ],
      [
        [88, 240],
        [138, 226],
      ],
      [
        [138, 226],
        [186, 250],
      ],
      [
        [138, 226],
        [118, 292],
      ],
      [
        [118, 292],
        [168, 300],
      ],
    ],
    nodes: [
      [72, 170],
      [118, 158],
      [168, 176],
      [88, 240],
      [138, 226],
      [186, 250],
      [118, 292],
      [168, 300],
    ],
  },
  {
    frame: { h: 112, w: 186, x: 410, y: 104 },
    links: [
      [
        [430, 150],
        [470, 170],
      ],
      [
        [470, 170],
        [520, 150],
      ],
      [
        [520, 150],
        [560, 176],
      ],
      [
        [470, 170],
        [480, 196],
      ],
    ],
    nodes: [
      [430, 150],
      [470, 170],
      [520, 150],
      [560, 176],
      [480, 196],
    ],
  },
  {
    frame: { h: 112, w: 186, x: 410, y: 232 },
    links: [
      [
        [432, 286],
        [476, 300],
      ],
      [
        [476, 300],
        [520, 280],
      ],
      [
        [520, 280],
        [560, 310],
      ],
      [
        [476, 300],
        [500, 318],
      ],
    ],
    nodes: [
      [432, 286],
      [476, 300],
      [520, 280],
      [560, 310],
      [500, 318],
    ],
  },
];

// Puertas (API pública): centro de cada una, en la pared de su módulo.
const DOORS: readonly Point[] = [
  [244, 164],
  [244, 274],
  [410, 166],
  [410, 302],
];

function moduleBox(box: ModuleBox, name: string, index: number) {
  const { frame } = box;

  return group(
    [
      rect(frame.x, frame.y, frame.w, frame.h, { fill: 'paper', r: 8, width: 1.5 }),
      label(frame.x + frame.w / 2, frame.y + 24, name, { size: 11, tone: 'ink', tracking: 2 }),
      ...box.links.map(([[x1, y1], [x2, y2]]) =>
        line(x1, y1, x2, y2, { stroke: 'faint', width: 1 }),
      ),
      ...box.nodes.map(([x, y]) => circle(x, y, 5, { fill: 'paper', stroke: 'muted', width: 1.2 })),
    ],
    motion('rise', 200 + index * 160),
  );
}

/**
Cada módulo oculta sus archivos. Solo las puertas (su API pública) cruzan la frontera, y el
acceso directo a lo interno queda fuera del grafo.
*/
export function arquitecturaDeArchivosReposGrandes(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 60, copy.title, { size: 15 }),
    line(44, 84, 596, 84, { dash: '2 4', stroke: 'muted', width: 1 }),
    MODULES.map((box, index) => moduleBox(box, copy.modules[index] ?? '', index)),
    group(
      [
        arrow(
          [
            [251, 164],
            [403, 166],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
        arrow(
          [
            [251, 274],
            [330, 274],
            [330, 302],
            [403, 302],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
      ],
      motion('fade', 900),
    ),
    DOORS.map(([cx, cy]) =>
      rect(cx - 7, cy - 14, 14, 28, { fill: 'accent', r: 3, stroke: undefined, width: undefined }),
    ),
    label(258, 146, 'API', { anchor: 'start', size: 9.5, tone: 'accent' }),
    group(
      [
        path('M118 292Q300 380 476 300', { dash: '4 4', stroke: 'muted', width: 1.4 }),
        line(282, 328, 294, 340, { stroke: 'ink', width: 1.6 }),
        line(294, 328, 282, 340, { stroke: 'ink', width: 1.6 }),
        label(288, 362, copy.bypass, { size: 10 }),
      ],
      motion('fade', 1200),
    ),
  );
}
