import { arrow, circle, figure, group, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale, Prim } from '../figure-types';

const COPY = {
  es: {
    apply: 'APLICA',
    drift: 'DESVIACIÓN',
    live: 'ENTORNO',
    loop: 'RECONCILIADOR',
    observe: 'OBSERVA',
    read: 'LEE',
    repo: 'REPOSITORIO',
  },
  en: {
    apply: 'APPLIES',
    drift: 'DRIFT',
    live: 'ENVIRONMENT',
    loop: 'RECONCILER',
    observe: 'OBSERVES',
    read: 'READS',
    repo: 'REPOSITORY',
  },
} as const;

const FILES = ['vpc.tf', 'cluster.tf', 'app.yaml'] as const;

const CELLS = [
  { name: 'VPC', x: 448, y: 150 },
  { name: 'K8S', x: 532, y: 150 },
  { name: 'APP', x: 448, y: 230 },
  { name: 'DB', x: 532, y: 230 },
] as const;

const DRIFTED = 'DB';

const PANEL = { fill: 'sunken', r: 6, stroke: 'muted', width: 1.2 } as const;

const TITLE = { size: 11, tone: 'ink', tracking: 2.4 } as const;

const SMALL = { size: 10.5, tone: 'ink', tracking: 0 } as const;

function fileRow(name: string, index: number): Prim {
  const y = 150 + index * 40;

  return group(
    [
      rect(64, y, 132, 28, { fill: 'paper', r: 3, width: 1.2 }),
      label(76, y + 18, name, { ...SMALL, anchor: 'start' }),
    ],
    motion('rise', 300 + index * 120),
  );
}

function resourceCell(name: string, x: number, y: number): Prim {
  const isDrifted = name === DRIFTED;

  return group(
    [
      rect(
        x,
        y,
        60,
        44,
        isDrifted
          ? { fill: 'accentSoft', r: 4, stroke: 'accent', width: 2 }
          : { fill: 'paper', r: 4, stroke: 'muted', width: 1.2 },
      ),
      label(x + 30, y + 27, name, { ...SMALL, tone: isDrifted ? 'accent' : 'ink' }),
    ],
    motion('rise', 500),
  );
}

export function infraestructuraComoCodigoGitops(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    // Estado deseado: lo declarado en el repositorio, versionado.
    group(
      [
        rect(40, 120, 180, 170, PANEL),
        label(130, 108, copy.repo, TITLE),
        ...FILES.map((name, index) => fileRow(name, index)),
        label(130, 312, 'main', { ...SMALL, tone: 'muted' }),
      ],
      motion('rise', 150),
    ),
    // Estado real: lo que el proveedor o el clúster está ejecutando.
    group(
      [
        rect(420, 120, 180, 170, PANEL),
        label(510, 108, copy.live, TITLE),
        ...CELLS.map((cell) => resourceCell(cell.name, cell.x, cell.y)),
        label(562, 312, copy.drift, { size: 11, tone: 'accent', tracking: 1.6 }),
      ],
      motion('rise', 250),
    ),
    // Bucle: lee el repositorio, observa el entorno y aplica la corrección.
    group(
      [
        arrow(
          [
            [222, 205],
            [288, 205],
          ],
          { tone: 'muted', width: 1.4 },
        ),
        arrow(
          [
            [352, 205],
            [418, 205],
          ],
          { tone: 'muted', width: 1.4 },
        ),
        arrow(
          [
            [592, 116],
            [592, 76],
            [320, 76],
            [320, 174],
          ],
          { dash: '4 4', tone: 'muted', width: 1.4 },
        ),
        label(255, 194, copy.read, { size: 10, tone: 'muted' }),
        label(385, 194, copy.apply, { size: 10, tone: 'muted' }),
        label(415, 66, copy.observe, { size: 10, tone: 'muted' }),
      ],
      motion('fade', 700),
    ),
    group(
      [
        circle(320, 205, 30, { fill: 'paper', stroke: 'brand', width: 1.8 }),
        circle(320, 205, 8, { fill: 'brandSoft', width: 1 }),
        label(320, 262, copy.loop, { size: 11, tone: 'ink', tracking: 1.6 }),
      ],
      motion('rise', 400),
    ),
    // Desviación: el recurso cambiado a mano fuera del repositorio.
    group(
      [circle(562, 252, 37, { dash: '4 4', stroke: 'accent', width: 1.2 })],
      motion('fade', 1000),
    ),
  );
}
