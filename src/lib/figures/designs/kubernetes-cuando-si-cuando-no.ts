import { arrow, circle, figure, group, label, line, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    controlPlane: 'CONTROL PLANE',
    manifest: 'MANIFEST',
    managed: 'SERVERLESS',
    nodeA: 'NODE A',
    nodeB: 'NODE B',
    reconcile: 'RECONCILE',
    schedule: 'SCHEDULE',
    api: 'API',
    shortRoute: 'SHORT ROUTE',
    footer: 'WHEN THE LOAD IS SIMPLE, THE PLANE IS OVERHEAD',
    title: 'KUBERNETES',
  },
  es: {
    controlPlane: 'PLANO DE CONTROL',
    manifest: 'MANIFIESTO',
    managed: 'SIN SERVIDOR',
    nodeA: 'NODO A',
    nodeB: 'NODO B',
    reconcile: 'RECONCILIA',
    schedule: 'PLANIFICA',
    api: 'API',
    shortRoute: 'RUTA CORTA',
    footer: 'CUANDO LA CARGA ES SIMPLE, EL PLANO SOBRA',
    title: 'KUBERNETES',
  },
} as const;

const PLANE = { x: 180, y: 56, w: 380, h: 112 };
const NODES = [
  { x: 200, label: 'nodeA', slots: [222, 260, 298] },
  { x: 380, label: 'nodeB', slots: [402, 440, 478] },
] as const;

type WorkerNode = (typeof NODES)[number];

function workerNode(copy: (typeof COPY)[FigureLocale], node: WorkerNode, delay: number) {
  return group(
    [
      rect(node.x, 240, 150, 70, { fill: 'brandSoft', r: 4, width: 1.6 }),
      ...node.slots.map((x) => rect(x, 266, 16, 16, { fill: 'paper', r: 2, width: 1.4 })),
      label(node.x + 75, 332, copy[node.label], { size: 10 }),
    ],
    motion('rise', delay),
  );
}

export function kubernetesCuandoSiCuandoNo(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];
  const planeNodes = [250, 370, 490];

  return figure(
    label(44, 84, copy.title, { anchor: 'start', tone: 'ink', tracking: 3 }),
    group(
      [
        rect(PLANE.x, PLANE.y, PLANE.w, PLANE.h, { fill: 'sunken', r: 4, width: 1.5 }),
        label(PLANE.x + 16, PLANE.y + 22, copy.controlPlane, { anchor: 'start', size: 10 }),
        line(250, 130, 370, 130, { stroke: 'muted', width: 1 }),
        line(370, 130, 490, 130, { stroke: 'muted', width: 1 }),
        ...planeNodes.map((x) => circle(x, 130, 7, { fill: 'paper', width: 1.6 })),
        label(250, 156, copy.api, { size: 10 }),
        label(370, 156, copy.schedule, { size: 10 }),
        label(490, 156, copy.reconcile, { size: 10 }),
      ],
      motion('fade', 200),
    ),
    group(
      [
        rect(40, 110, 116, 48, { fill: 'paper', r: 3, width: 1.5 }),
        label(98, 138, copy.manifest, { size: 10 }),
        arrow(
          [
            [156, 134],
            [178, 134],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 350),
    ),
    group(
      [
        arrow(
          [
            [300, 170],
            [300, 236],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [455, 170],
            [455, 236],
          ],
          { tone: 'muted' },
        ),
      ],
      motion('fade', 420),
    ),
    workerNode(copy, NODES[0], 500),
    workerNode(copy, NODES[1], 650),
    group(
      [
        arrow(
          [
            [98, 158],
            [98, 296],
          ],
          { dash: '4 4', tone: 'accent', width: 2 },
        ),
        rect(40, 300, 116, 48, { fill: 'accentSoft', r: 3, stroke: 'accent', width: 1.8 }),
        label(98, 328, copy.managed, { size: 10, tone: 'ink' }),
        label(108, 232, copy.shortRoute, { anchor: 'start', size: 10, tone: 'accent' }),
      ],
      motion('rise', 800),
    ),
    label(44, 384, copy.footer, { anchor: 'start', size: 10 }),
  );
}
