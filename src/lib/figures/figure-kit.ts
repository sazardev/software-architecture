import type {
  CirclePrim,
  Figure,
  GroupPrim,
  Motion,
  MotionKind,
  Paint,
  PathPrim,
  Prim,
  RectPrim,
  TextPrim,
  Tone,
} from './figure-types';

export type Point = readonly [number, number];

const round = (value: number): number => Math.round(value * 100) / 100;

export function motion(kind: MotionKind, delay?: number): Motion {
  return { delay, kind };
}

/**
Trazo base del plano: tinta, 1.5 de grosor, sin relleno.
*/
export function path(d: string, paint: Paint = {}): PathPrim {
  return { d, kind: 'path', stroke: 'ink', width: 1.5, ...paint };
}

export function poly(points: readonly Point[], paint: Paint = {}, isClosed = false): PathPrim {
  const d = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`);

  return path(`${d.join('')}${isClosed ? 'Z' : ''}`, paint);
}

export function line(x1: number, y1: number, x2: number, y2: number, paint: Paint = {}): PathPrim {
  return poly(
    [
      [x1, y1],
      [x2, y2],
    ],
    paint,
  );
}

export function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  paint: Paint & Readonly<{ r?: number | undefined }> = {},
): RectPrim {
  return { h, kind: 'rect', r: 3, stroke: 'ink', w, width: 1.5, x, y, ...paint };
}

export function circle(cx: number, cy: number, r: number, paint: Paint = {}): CirclePrim {
  return { cx, cy, kind: 'circle', r, stroke: 'ink', width: 1.5, ...paint };
}

type TextOptions = Omit<TextPrim, 'kind' | 'text' | 'x' | 'y'>;

/**
Etiqueta de plano: mono, pequeña y espaciada, en gris cálido.
*/
export function label(x: number, y: number, text: string, options: TextOptions = {}): TextPrim {
  return {
    anchor: 'middle',
    font: 'mono',
    kind: 'text',
    size: 12,
    text,
    tone: 'muted',
    tracking: 1.6,
    x,
    y,
    ...options,
  };
}

/**
Texto de nodo: serif de visualización, más grande y en tinta.
*/
export function heading(x: number, y: number, text: string, options: TextOptions = {}): TextPrim {
  return label(x, y, text, { font: 'display', size: 16, tone: 'ink', tracking: 0, ...options });
}

export function group(items: readonly Prim[], withMotion?: Motion): GroupPrim {
  return { items, kind: 'group', motion: withMotion };
}

/**
Punto de control del plano: círculo con relleno de papel o de acento.
*/
export function node(cx: number, cy: number, r = 5, isHot = false, paint: Paint = {}): CirclePrim {
  return circle(cx, cy, r, { fill: isHot ? 'accent' : 'paper', ...paint });
}

/**
Anillo que late alrededor de un punto: llama la atención sobre lo importante de la figura.
*/
export function pulse(cx: number, cy: number, r = 14, delay = 0): CirclePrim {
  return circle(cx, cy, r, {
    fill: 'accent',
    motion: motion('pulse', delay),
    opacity: 0.4,
    stroke: undefined,
    width: undefined,
  });
}

/**
Cabeza de flecha rellena: apunta en la dirección `from → to`.
*/
export function arrowHead(from: Point, to: Point, tone: Tone = 'ink', size = 8): PathPrim {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const [tx, ty] = to;
  const spread = Math.PI / 7;
  const left: Point = [tx - size * Math.cos(angle - spread), ty - size * Math.sin(angle - spread)];
  const right: Point = [tx - size * Math.cos(angle + spread), ty - size * Math.sin(angle + spread)];

  return poly([to, left, right], { fill: tone, stroke: tone, width: 1 }, true);
}

type ArrowOptions = Readonly<{
  dash?: string | undefined;
  /**
  Superpone un trazo animado que marca el sentido del flujo.
  */
  flow?: boolean | undefined;
  tone?: Tone | undefined;
  width?: number | undefined;
}>;

/**
Flecha poligonal: la línea se acorta lo justo para que la cabeza apoye en el destino.
*/
export function arrow(points: readonly Point[], options: ArrowOptions = {}): GroupPrim {
  const { dash, flow = false, tone = 'ink', width = 1.5 } = options;
  const last = points.at(-1);
  const before = points.at(-2);

  if (last === undefined || before === undefined) {
    return group([]);
  }

  const angle = Math.atan2(last[1] - before[1], last[0] - before[0]);
  const trimmed: Point = [last[0] - 6 * Math.cos(angle), last[1] - 6 * Math.sin(angle)];
  const body = [...points.slice(0, -1), trimmed];
  const accent: Tone = tone === 'ink' ? 'accent' : tone;
  const items: Prim[] = [
    poly(body, { dash, stroke: flow ? 'faint' : tone, width }),
    arrowHead(before, last, flow ? accent : tone),
  ];

  if (flow) {
    items.push(poly(body, { dash: '5 7', motion: motion('flow'), stroke: accent, width: 1.9 }));
  }

  return group(items);
}

/**
Cota de plano: línea con marcas oblicuas en los extremos y rótulo junto a ella.
*/
export function dimension(
  from: Point,
  to: Point,
  text?: string,
  options: Readonly<{ offset?: number }> = {},
): GroupPrim {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const isHorizontal = Math.abs(y2 - y1) < Math.abs(x2 - x1);
  const tick = 5;
  const tone: Tone = 'muted';
  const items: Prim[] = [
    line(x1, y1, x2, y2, { stroke: tone, width: 1 }),
    ...[from, to].map(([x, y]) =>
      line(x - tick, y + tick, x + tick, y - tick, { stroke: tone, width: 1 }),
    ),
  ];

  if (text !== undefined) {
    const offset = options.offset ?? 14;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    items.push(
      isHorizontal
        ? label(mx, my - offset + 4, text, { size: 10 })
        : label(mx - offset, my, text, { rotate: -90, size: 10 }),
    );
  }

  return group(items, motion('fade', 900));
}

/**
Empaqueta una lista de primitivas como figura (sirve para fijar el tipo en cada diseño).
*/
export function figure(...items: readonly (Prim | readonly Prim[])[]): Figure {
  return items.flat();
}
