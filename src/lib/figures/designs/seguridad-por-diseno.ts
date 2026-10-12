import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  node,
  path,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

// Diagrama de flujo de datos: dos límites de confianza y el punto de la frontera donde se valida.
const gate = { x: 196, y: 200 } as const;
const inner = { x: 404, y: 170 } as const;

function boundary(x: number, y: number, w: number, h: number, name: string, delay: number) {
  return group(
    [
      rect(x, y, w, h, { dash: '6 6', r: 10, stroke: 'muted', width: 1.4 }),
      label(x + 12, y + 22, name, { anchor: 'start', size: 11 }),
    ],
    motion('rise', delay),
  );
}

function check(cx: number, cy: number, isHot: boolean) {
  const stroke = isHot ? 'paper' : 'ink';

  return group([
    node(cx, cy, 13, isHot, { width: 1.8 }),
    path(`M${cx - 6} ${cy}L${cx - 2} ${cy + 5}L${cx + 6} ${cy - 5}`, { stroke, width: 2 }),
  ]);
}

export function seguridadPorDiseno(): Figure {
  return figure(
    label(96, 70, 'INTERNET', { tone: 'ink', tracking: 2.4 }),
    boundary(gate.x, 44, 428, 316, 'TB-1', 150),
    boundary(inner.x, 74, 208, 256, 'TB-2', 300),
    // Entidad externa: el dato no confiable nace fuera de toda frontera.
    group(
      [rect(30, 174, 112, 52, { fill: 'paper', r: 2, width: 1.6 }), heading(86, 206, 'App')],
      motion('rise'),
    ),
    // Procesos y almacén dentro de las fronteras.
    group(
      [circle(300, 200, 38, { fill: 'brandSoft', width: 1.6 }), heading(300, 206, 'API')],
      motion('rise', 250),
    ),
    group(
      [circle(508, 150, 34, { fill: 'paper', width: 1.6 }), heading(508, 156, 'Core')],
      motion('rise', 400),
    ),
    group(
      [
        line(450, 262, 566, 262, { width: 1.6 }),
        line(450, 298, 566, 298, { width: 1.6 }),
        heading(508, 286, 'DB', { font: 'mono', size: 14 }),
      ],
      motion('rise', 500),
    ),
    // Flujos de datos.
    arrow(
      [
        [142, 200],
        [262, 200],
      ],
      { flow: true, width: 1.8 },
    ),
    arrow(
      [
        [334, 184],
        [474, 156],
      ],
      { tone: 'muted' },
    ),
    arrow(
      [
        [508, 184],
        [508, 256],
      ],
      { tone: 'muted' },
    ),
    // La validación vive en la frontera; dentro se vuelve a comprobar (defensa en profundidad).
    pulse(gate.x, gate.y, 22, 700),
    check(gate.x, gate.y, true),
    // Frontera: autenticación y esquema; la autorización por recurso, dentro, en el servicio.
    label(gate.x - 14, 252, 'authn · schema', { anchor: 'end', size: 10.5, tone: 'ink' }),
    check(inner.x, inner.y, false),
    label(inner.x - 4, 118, 'authz', { anchor: 'end', size: 10.5, tone: 'ink' }),
    label(inner.x - 4, 134, 'mTLS', { anchor: 'end', size: 10.5 }),
    label(320, 384, 'DFD', { size: 10, tracking: 3 }),
  );
}
