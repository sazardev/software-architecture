/**
Enrutado ortogonal de conectores entre nodos de un diagrama: cada conector sale y entra por el
lado que corresponde a la posición relativa de los nodos, toca el borde real de la forma (rombo,
elipse o rectángulo) y reparte los puertos cuando varios conectores comparten lado.
*/
export type Shape = 'diamond' | 'ellipse' | 'rect';

type Point = Readonly<{ x: number; y: number }>;

/**
`x`/`y` son el centro del nodo.
*/
export type RoutableNode = Readonly<{
  halfH: number;
  halfW: number;
  shape: Shape;
  x: number;
  y: number;
}>;

export type RouteEnds = Readonly<{ from: string; to: string }>;

export type Route = Readonly<{ label: Point; path: string }>;

type Side = 'bottom' | 'left' | 'right' | 'top';

type Plan = Readonly<{
  into: Side;
  out: Side;
  source: RoutableNode;
  target: RoutableNode;
}>;

type Slot = Readonly<{ edge: number; end: 'from' | 'to'; length: number; order: number }>;

type Port = Readonly<{ count: number; offset: number; position: number }>;

const BRIDGE_STEP = 12;

const CORNER_RADIUS = 10;
const MAX_PORT_SPACING = 22;

/**
Profundidad (desde el centro) del borde a `offset` del eje: el rombo se estrecha hacia sus
vértices y la elipse se curva; el rectángulo es plano.
*/
function surfaceDepth(shape: Shape, half: number, across: number, offset: number): number {
  const ratio = Math.min(Math.abs(offset) / across, 0.98);

  switch (shape) {
    case 'diamond': {
      return half * (1 - ratio);
    }
    case 'ellipse': {
      return half * Math.sqrt(1 - ratio * ratio);
    }
    case 'rect': {
      return half;
    }
  }
}

function portPoint(node: RoutableNode, side: Side, offset: number): Point {
  if (side === 'top' || side === 'bottom') {
    const depth = surfaceDepth(node.shape, node.halfH, node.halfW, offset);

    return { x: node.x + offset, y: node.y + (side === 'bottom' ? depth : -depth) };
  }

  const depth = surfaceDepth(node.shape, node.halfW, node.halfH, offset);

  return { x: node.x + (side === 'right' ? depth : -depth), y: node.y + offset };
}

function isVerticalSide(side: Side): boolean {
  return side === 'bottom' || side === 'top';
}

function makePlan(source: RoutableNode, target: RoutableNode, isVertical: boolean): Plan {
  const dx = target.x - source.x;
  const dy = target.y - source.y;

  if (isVertical) {
    return {
      into: dy >= 0 ? 'top' : 'bottom',
      out: dy >= 0 ? 'bottom' : 'top',
      source,
      target,
    };
  }

  return { into: dx >= 0 ? 'left' : 'right', out: dx >= 0 ? 'right' : 'left', source, target };
}

const OBSTACLE_MARGIN = 6;

function isHittingNode(start: Point, end: Point, node: RoutableNode): boolean {
  return (
    Math.max(start.x, end.x) > node.x - node.halfW - OBSTACLE_MARGIN &&
    Math.min(start.x, end.x) < node.x + node.halfW + OBSTACLE_MARGIN &&
    Math.max(start.y, end.y) > node.y - node.halfH - OBSTACLE_MARGIN &&
    Math.min(start.y, end.y) < node.y + node.halfH + OBSTACLE_MARGIN
  );
}

/**
Cuántos nodos ajenos cruzaría la ruta del plan (con puertos centrados): sirve para elegir lados.
*/
function collisions(plan: Plan, obstacles: readonly RoutableNode[]): number {
  const start = portPoint(plan.source, plan.out, 0);
  const end = portPoint(plan.target, plan.into, 0);
  const points = routeBetween(start, end, plan.out, 0);

  return obstacles.filter((node) =>
    points.some((point, index) => {
      const next = points[index + 1];

      return next !== undefined && isHittingNode(point, next, node);
    }),
  ).length;
}

/**
El eje con más separación (relativa al tamaño de los nodos) decide por qué lados se conectan; si
esa ruta cruzaría otros nodos, se prueba el otro eje y se queda la que menos cruce.
*/
function planBetween(
  source: RoutableNode,
  target: RoutableNode,
  obstacles: readonly RoutableNode[],
): Plan {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const isVertical =
    Math.abs(dy) / (source.halfH + target.halfH) >= Math.abs(dx) / (source.halfW + target.halfW);
  const preferred = makePlan(source, target, isVertical);
  const others = obstacles.filter((node) => node !== source && node !== target);

  if (collisions(preferred, others) === 0) {
    return preferred;
  }

  const alternate = makePlan(source, target, !isVertical);

  return collisions(alternate, others) < collisions(preferred, others) ? alternate : preferred;
}

function towards(from: Point, to: Point, distance: number): Point {
  const length = Math.hypot(to.x - from.x, to.y - from.y) || 1;

  return {
    x: from.x + ((to.x - from.x) / length) * distance,
    y: from.y + ((to.y - from.y) / length) * distance,
  };
}

/**
Polilínea con esquinas redondeadas (cuadráticas), como las que dibuja Mermaid.
*/
function roundedPath(points: readonly Point[]): string {
  const [first, ...rest] = points;

  if (first === undefined) {
    return '';
  }

  let path = `M${first.x} ${first.y}`;

  for (const [index, corner] of rest.entries()) {
    const previous = points[index];
    const next = rest[index + 1];

    if (previous === undefined || next === undefined) {
      path += `L${corner.x} ${corner.y}`;
      continue;
    }

    const radius = Math.min(
      CORNER_RADIUS,
      Math.hypot(corner.x - previous.x, corner.y - previous.y) / 2,
      Math.hypot(next.x - corner.x, next.y - corner.y) / 2,
    );
    const before = towards(corner, previous, radius);
    const after = towards(corner, next, radius);

    path += `L${before.x} ${before.y}Q${corner.x} ${corner.y} ${after.x} ${after.y}`;
  }

  return path;
}

/**
Recta si los puertos están alineados; si no, un tramo puente que se desplaza `shift` desde la mitad.
*/
function routeBetween(start: Point, end: Point, outSide: Side, shift: number): readonly Point[] {
  const isVertical = isVerticalSide(outSide);
  const gap = Math.abs(isVertical ? start.x - end.x : start.y - end.y);

  if (gap < 0.75) {
    return [start, end];
  }

  if (isVertical) {
    const middle = clampBetween((start.y + end.y) / 2 + shift, start.y, end.y);

    return [start, { x: start.x, y: middle }, { x: end.x, y: middle }, end];
  }

  const middle = clampBetween((start.x + end.x) / 2 + shift, start.x, end.x);

  return [start, { x: middle, y: start.y }, { x: middle, y: end.y }, end];
}

/**
Mantiene el puente dentro del tramo (con margen para que las esquinas redondeadas respiren).
*/
function clampBetween(value: number, a: number, b: number): number {
  const margin = Math.min(CORNER_RADIUS, Math.abs(b - a) / 2);

  return Math.min(Math.max(value, Math.min(a, b) + margin), Math.max(a, b) - margin);
}

/**
Escalona los puentes de los conectores que salen del mismo lado hacia el mismo sentido, para que
no se solapen ni se crucen: el puente más alejado del origen va el último.
*/
function bridgeShift(port: Port | undefined, direction: number): number {
  if (port === undefined || port.count < 2) {
    return 0;
  }

  const rank = direction < 0 ? port.position : port.count - 1 - port.position;

  return (rank - (port.count - 1) / 2) * BRIDGE_STEP;
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/**
Reparte los conectores que comparten lado de un nodo, ordenados por la posición del otro extremo
para minimizar cruces. Devuelve el desplazamiento a lo largo del lado por `edge:end`.
*/
function assignOffsets(plans: readonly (Plan | null)[], edges: readonly RouteEnds[]) {
  const groups = new Map<string, Slot[]>();

  function add(nodeKey: string, side: Side, slot: Omit<Slot, 'length'>, node: RoutableNode) {
    const key = `${nodeKey}:${side}`;
    const length = (isVerticalSide(side) ? node.halfW : node.halfH) * 2;

    groups.set(key, [...(groups.get(key) ?? []), { ...slot, length }]);
  }

  for (const [index, plan] of plans.entries()) {
    const edge = edges[index];

    if (plan === null || edge === undefined) {
      continue;
    }

    const isVertical = isVerticalSide(plan.out);

    add(
      edge.from,
      plan.out,
      { edge: index, end: 'from', order: isVertical ? plan.target.x : plan.target.y },
      plan.source,
    );
    add(
      edge.to,
      plan.into,
      { edge: index, end: 'to', order: isVertical ? plan.source.x : plan.source.y },
      plan.target,
    );
  }

  const offsets = new Map<string, Port>();

  for (const slots of groups.values()) {
    const sorted = slots.toSorted((a, b) => a.order - b.order || a.edge - b.edge);
    const spacing = Math.min(
      MAX_PORT_SPACING,
      ((sorted[0]?.length ?? 0) * 0.6) / Math.max(sorted.length - 1, 1),
    );

    for (const [position, slot] of sorted.entries()) {
      offsets.set(`${slot.edge}:${slot.end}`, {
        count: sorted.length,
        offset: (position - (sorted.length - 1) / 2) * spacing,
        position,
      });
    }
  }

  return offsets;
}

/**
Ruta cada conector; `null` si falta un extremo o es un bucle sobre el mismo nodo.
*/
export function routeEdges(
  nodes: ReadonlyMap<string, RoutableNode>,
  edges: readonly RouteEnds[],
): (Route | null)[] {
  const plans = edges.map((edge) => {
    const source = nodes.get(edge.from);
    const target = nodes.get(edge.to);

    const isRoutable = source !== undefined && target !== undefined && source !== target;

    return isRoutable ? planBetween(source, target, nodes.values().toArray()) : null;
  });
  const offsets = assignOffsets(plans, edges);

  return plans.map((plan, index) => {
    if (plan === null) {
      return null;
    }

    const fromPort = offsets.get(`${index}:from`);
    const start = portPoint(plan.source, plan.out, fromPort?.offset ?? 0);
    const end = portPoint(plan.target, plan.into, offsets.get(`${index}:to`)?.offset ?? 0);
    const direction = isVerticalSide(plan.out) ? end.x - start.x : end.y - start.y;
    const points = routeBetween(start, end, plan.out, bridgeShift(fromPort, direction));
    const [, bridgeStart, bridgeEnd] = points;
    const label =
      bridgeStart !== undefined && bridgeEnd !== undefined
        ? midpoint(bridgeStart, bridgeEnd)
        : midpoint(start, end);

    return { label, path: roundedPath(points) };
  });
}
