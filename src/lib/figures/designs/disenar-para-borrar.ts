import {
  arrow,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const MODULE_TOP = 150;
const MODULE_H = 84;
const MODULE_W = 128;
const BASE = 368;
const COLUMNS = [130, 320, 510] as const;

// Lecturas diarias del registro: caen hasta cero antes de la última fase.
const DAYS = [36, 32, 34, 28, 24, 20, 16, 12, 8, 6, 4, 2, 0, 0] as const;

const COPY = {
  en: {
    actions: ['STOP WRITES', 'STOP READS', 'DELETE'],
    gate: 'CONFIRMED',
    module: 'billing',
    phase: 'PHASE',
    registry: 'USAGE REGISTRY · 14 DAYS',
    removed: 'removed',
    title: 'MODULE BEING RETIRED',
    zero: 'ZERO READS',
  },
  es: {
    actions: ['DEJAR DE ESCRIBIR', 'DEJAR DE LEER', 'BORRAR'],
    gate: 'CONFIRMADO',
    module: 'facturación',
    phase: 'FASE',
    registry: 'REGISTRO DE USO · 14 DÍAS',
    removed: 'retirado',
    title: 'MÓDULO EN RETIRADA',
    zero: 'CERO LECTURAS',
  },
} as const;

/**
Cruz de tachado sobre una flecha: marca que ese flujo ya no existe.
*/
function cross(x: number, y: number) {
  const size = 5;

  return group([
    line(x - size, y - size, x + size, y + size, { stroke: 'ink', width: 1.8 }),
    line(x + size, y - size, x - size, y + size, { stroke: 'ink', width: 1.8 }),
  ]);
}

/**
Fase 1: el módulo sigue vivo, pero ya no recibe escrituras nuevas.
*/
function writePhase(x: number, name: string) {
  const left = x - MODULE_W / 2;

  return group([
    rect(left, MODULE_TOP, MODULE_W, MODULE_H, { fill: 'paper' }),
    heading(x, 192, name, { size: 14 }),
    line(x - 40, 214, x + 40, 214, { stroke: 'faint' }),
    line(x - 40, 224, x + 14, 224, { stroke: 'faint' }),
    arrow(
      [
        [left - 30, 118],
        [left + 10, 160],
      ],
      { dash: '4 4', tone: 'muted' },
    ),
    cross(left - 14, 138),
  ]);
}

/**
Fase 2: el módulo se atenúa; las lecturas se han migrado y el registro lo confirma.
*/
function readPhase(x: number, name: string) {
  const left = x - MODULE_W / 2;

  return group([
    rect(left, MODULE_TOP, MODULE_W, MODULE_H, {
      dash: '4 4',
      fill: 'sunken',
      stroke: 'muted',
      width: 1.2,
    }),
    heading(x, 192, name, { size: 14, tone: 'muted' }),
    arrow(
      [
        [x, 98],
        [x, 146],
      ],
      { dash: '4 4', tone: 'muted' },
    ),
    cross(x, 122),
  ]);
}

/**
Fase 3: el hueco que queda tras borrar. Solo el contorno, para que se vea el sitio.
*/
function removePhase(x: number, text: string) {
  return group([
    rect(x - MODULE_W / 2, MODULE_TOP, MODULE_W, MODULE_H, {
      dash: '2 4',
      r: 4,
      stroke: 'faint',
      width: 1,
    }),
    label(x, 196, text, { size: 11, tone: 'muted' }),
  ]);
}

/**
Registro de uso: barras diarias que caen a cero y un nodo que confirma el cero.
*/
function registry(copy: (typeof COPY)[FigureLocale]) {
  return group(
    [
      rect(44, 300, 552, 84, { fill: 'sunken', r: 4, stroke: undefined }),
      label(60, 320, copy.registry, { anchor: 'start', size: 11, tone: 'ink', tracking: 1.4 }),
      line(60, BASE, 390, BASE, { stroke: 'muted', width: 1 }),
      ...DAYS.map((height, index) =>
        rect(60 + index * 24, BASE - height, 14, height, {
          fill: 'brandSoft',
          r: 2,
          stroke: undefined,
        }),
      ),
      pulse(520, 326, 20, 800),
      node(520, 326, 7, true),
      label(520, 364, copy.zero, { size: 10, tone: 'ink' }),
    ],
    motion('rise', 1200),
  );
}

export function disenarParaBorrar(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];
  const [first, second, third] = COLUMNS;

  return figure(
    label(44, 84, copy.title, { anchor: 'start', tone: 'ink', tracking: 3 }),
    group(
      [
        writePhase(first, copy.module),
        label(first, 262, `${copy.phase} 1`, { size: 11, tone: 'ink' }),
        label(first, 278, copy.actions[0], { size: 10 }),
      ],
      motion('rise', 200),
    ),
    group(
      [
        readPhase(second, copy.module),
        label(second, 262, `${copy.phase} 2`, { size: 11, tone: 'ink' }),
        label(second, 278, copy.actions[1], { size: 10 }),
      ],
      motion('rise', 400),
    ),
    group(
      [
        removePhase(third, copy.removed),
        label(third, 262, `${copy.phase} 3`, { size: 11, tone: 'ink' }),
        label(third, 278, copy.actions[2], { size: 10 }),
      ],
      motion('rise', 600),
    ),
    // Flujo entre fases: el paso a la última solo se da tras la confirmación.
    arrow(
      [
        [first + MODULE_W / 2 + 6, 192],
        [second - MODULE_W / 2 - 6, 192],
      ],
      { tone: 'muted' },
    ),
    arrow(
      [
        [second + MODULE_W / 2 + 6, 192],
        [third - MODULE_W / 2 - 6, 192],
      ],
      { flow: true, tone: 'muted' },
    ),
    line(415, 114, 415, 292, { dash: '2 4', stroke: 'muted', width: 1 }),
    label(415, 106, copy.gate, { size: 10, tone: 'ink' }),
    registry(copy),
  );
}
