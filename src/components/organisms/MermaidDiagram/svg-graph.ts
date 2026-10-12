import { routeEdges, type RoutableNode, type Shape } from './edge-routing';

type GraphNode = {
  element: SVGGElement;
  halfH: number;
  halfW: number;
  offsetX: number;
  offsetY: number;
  shape: Shape;
  x: number;
  y: number;
};

type GraphEdge = {
  flow: SVGPathElement | null;
  from: string;
  label: SVGGElement | null;
  link: SVGPathElement;
  to: string;
};

type GraphNodeInfo = Readonly<{
  incoming: readonly string[];
  key: string;
  outgoing: readonly string[];
}>;

/**
Conexiones de cada nodo (se calculan una vez desde el SVG): permiten resaltar a sus vecinos.
*/
export type GraphInfo = Readonly<{ nodes: readonly GraphNodeInfo[] }>;

/**
Grafo editable sobre un flowchart de Mermaid ya renderizado: mover nodos (los conectores se
re-enrutan en ortogonal), resaltar/atenuar y consultar su estructura.
*/
export type FlowGraph = Readonly<{
  info: GraphInfo;
  moveNode: (key: string, dx: number, dy: number) => void;
  nodeKeyAt: (target: EventTarget | null) => string | null;
  /**
  Atenúa todo lo que no esté en `keys` (null = nada atenuado) y marca `selected`.
  */
  setFocus: (keys: ReadonlySet<string> | null, selected: string | null) => void;
}>;

function detectShape(element: SVGGElement): Shape {
  const polygon = element.querySelector('polygon');

  if (polygon !== null && polygon.points.length === 4) {
    return 'diamond';
  }

  return element.querySelector('circle, ellipse') === null ? 'rect' : 'ellipse';
}

function readNode(element: SVGGElement): GraphNode {
  const matrix = element.transform.baseVal.consolidate()?.matrix;
  const box = element.getBBox();

  return {
    element,
    halfH: Math.max(box.height / 2, 1),
    halfW: Math.max(box.width / 2, 1),
    offsetX: box.x + box.width / 2,
    offsetY: box.y + box.height / 2,
    shape: detectShape(element),
    x: matrix?.e ?? 0,
    y: matrix?.f ?? 0,
  };
}

/**
Los ids de Mermaid son `<svg>-flowchart-<id>-<n>` (nodos) y `<svg>-L_<from>_<to>_<n>` (enlaces).
Como los ids de nodo pueden contener `_`, el enlace se resuelve probando cada corte posible.
*/
function resolveEdge(
  linkId: string,
  keys: ReadonlySet<string>,
): Pick<GraphEdge, 'from' | 'to'> | null {
  const inner = /-L_(.+)_\d+$/.exec(linkId)?.[1];

  if (inner === undefined) {
    return null;
  }

  for (let index = 1; index < inner.length; index += 1) {
    const from = inner.slice(0, index);
    const to = inner.slice(index + 1);

    if (inner[index] === '_' && keys.has(from) && keys.has(to)) {
      return { from, to };
    }
  }

  return null;
}

function labelFor(svg: SVGSVGElement, linkId: string): SVGGElement | null {
  const dataId = /-(L_.+)$/.exec(linkId)?.[1];

  if (dataId === undefined) {
    return null;
  }

  const outer = svg.querySelector(`g.label[data-id="${CSS.escape(dataId)}"]`)?.parentElement;

  return outer instanceof SVGGElement ? outer : null;
}

function readInfo(nodes: ReadonlyMap<string, GraphNode>, edges: readonly GraphEdge[]): GraphInfo {
  return {
    nodes: nodes
      .keys()
      .map((key) => ({
        incoming: edges.filter((edge) => edge.to === key).map((edge) => edge.from),
        key,
        outgoing: edges.filter((edge) => edge.from === key).map((edge) => edge.to),
      }))
      .toArray(),
  };
}

function dim(element: Element | null, isDim: boolean): void {
  if (!(element instanceof SVGElement)) {
    return;
  }

  element.style.transition = 'filter 0.2s ease';
  element.style.filter = isDim ? 'opacity(0.2)' : '';
}

export function createFlowGraph(svg: SVGSVGElement): FlowGraph | null {
  const nodes = new Map<string, GraphNode>();
  const keyByElement = new Map<Element, string>();

  for (const element of svg.querySelectorAll<SVGGElement>('g.node')) {
    const key = /flowchart-(.+)-\d+$/.exec(element.id)?.[1];

    if (key === undefined) {
      continue;
    }

    nodes.set(key, readNode(element));
    keyByElement.set(element, key);
  }

  const keys = new Set(nodes.keys());
  const edges: GraphEdge[] = [];

  for (const link of svg.querySelectorAll<SVGPathElement>('path.flowchart-link')) {
    const ends = resolveEdge(link.id, keys);

    if (ends === null) {
      continue;
    }

    const next = link.nextElementSibling;
    const label = labelFor(svg, link.id);

    edges.push({
      ...ends,
      flow: next instanceof SVGPathElement && next.classList.contains('animate-flow') ? next : null,
      label,
      link,
    });
  }

  if (nodes.size === 0 || edges.length === 0) {
    return null;
  }

  function rerouteAll(): void {
    const routable = new Map<string, RoutableNode>();

    for (const [key, node] of nodes) {
      routable.set(key, {
        halfH: node.halfH,
        halfW: node.halfW,
        shape: node.shape,
        x: node.x + node.offsetX,
        y: node.y + node.offsetY,
      });
    }

    for (const [index, route] of routeEdges(routable, edges).entries()) {
      const edge = edges[index];

      if (route === null || edge === undefined) {
        continue;
      }

      edge.link.setAttribute('d', route.path);
      edge.link.style.removeProperty('stroke-dasharray');
      edge.flow?.setAttribute('d', route.path);
      edge.label?.setAttribute('transform', `translate(${route.label.x}, ${route.label.y})`);
    }
  }

  rerouteAll();

  return {
    info: readInfo(nodes, edges),
    moveNode(key, dx, dy) {
      const node = nodes.get(key);

      if (node === undefined) {
        return;
      }

      node.x += dx;
      node.y += dy;
      node.element.setAttribute('transform', `translate(${node.x}, ${node.y})`);

      for (const cluster of svg.querySelectorAll<SVGGElement>('g.cluster')) {
        cluster.style.opacity = '0.25';
      }

      rerouteAll();
    },
    nodeKeyAt(target) {
      const element = target instanceof Element ? target.closest('g.node') : null;

      return element === null ? null : (keyByElement.get(element) ?? null);
    },
    setFocus(focused, selected) {
      for (const [key, node] of nodes) {
        dim(node.element, focused !== null && !focused.has(key));
        node.element.classList.toggle('is-selected', key === selected);
      }

      for (const edge of edges) {
        const isRelated =
          focused === null ||
          (selected === null
            ? focused.has(edge.from) && focused.has(edge.to)
            : edge.from === selected || edge.to === selected);

        dim(edge.link, !isRelated);
        dim(edge.flow, !isRelated);
        dim(edge.label, !isRelated);
      }
    },
  };
}
