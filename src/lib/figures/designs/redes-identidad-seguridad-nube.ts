import {
  arrow,
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

const workload = { x: 282, y: 200 } as const;
const gateX = 400;
const db = { x: 504, y: 200 } as const;

/**
Zona de red: un rectángulo con su nombre en la esquina. La red virtual contiene dos subredes
contiguas (aplicación y datos), nunca una subred dentro de otra.
*/
function zone(
  x: number,
  y: number,
  w: number,
  h: number,
  name: string,
  fill: 'paper' | 'brandSoft',
  delay: number,
) {
  return group(
    [
      rect(x, y, w, h, { fill, r: 10, width: 1.5 }),
      label(x + 12, y + 20, name, { anchor: 'start', size: 10.5 }),
    ],
    motion('rise', delay),
  );
}

/**
Cilindro de base de datos dibujado con dos elipses y los costados.
*/
function cylinder(cx: number, cy: number) {
  const rx = 26;
  const ry = 8;
  const top = cy - 22;
  const bottom = cy + 22;

  return group(
    [
      path(
        `M${cx - rx} ${top}L${cx - rx} ${bottom}A${rx} ${ry} 0 0 0 ${cx + rx} ${bottom}L${cx + rx} ${top}`,
        { fill: 'paper', width: 1.6 },
      ),
      path(
        `M${cx - rx} ${top}A${rx} ${ry} 0 1 0 ${cx + rx} ${top}A${rx} ${ry} 0 1 0 ${cx - rx} ${top}Z`,
        {
          fill: 'paper',
          width: 1.6,
        },
      ),
      heading(cx, cy + 12, 'DB', { font: 'mono', size: 13, tracking: 1.5 }),
    ],
    motion('fade', 700),
  );
}

export function redesIdentidadSeguridadNube(): Figure {
  return figure(
    // Red virtual con dos subredes contiguas: aplicación (izquierda) y datos (derecha).
    zone(128, 28, 492, 344, 'VNET', 'paper', 0),
    zone(176, 72, 212, 256, 'SUBNET', 'brandSoft', 150),
    zone(412, 72, 184, 256, 'SUBNET', 'brandSoft', 300),
    // Internet y punto de entrada controlado.
    label(56, 186, 'WWW', { tone: 'ink' }),
    group(
      [
        rect(110, 182, 36, 36, { fill: 'paper', r: 4, width: 1.6 }),
        label(128, 205, 'LB', { size: 11, tone: 'ink' }),
      ],
      motion('fade', 400),
    ),
    arrow(
      [
        [72, 200],
        [108, 200],
      ],
      { width: 1.5 },
    ),
    arrow(
      [
        [148, 200],
        [workload.x - 22, workload.y],
      ],
      { width: 1.5 },
    ),
    label(212, 192, '443', { size: 10 }),
    // Acceso directo bloqueado: la red plana no existe.
    group(
      [
        line(60, 92, 162, 142, { dash: '4 4', stroke: 'muted', width: 1.3 }),
        line(166, 140, 178, 156, { stroke: 'muted', width: 1.6 }),
        line(178, 140, 166, 156, { stroke: 'muted', width: 1.6 }),
      ],
      motion('fade', 900),
    ),
    // Identidad de carga de trabajo: la única idea en acento.
    pulse(workload.x, workload.y, 26, 1000),
    node(workload.x, workload.y, 18, true, { width: 1.8 }),
    label(workload.x, workload.y + 44, 'APP', { tone: 'ink' }),
    label(workload.x, workload.y - 32, 'OIDC', { size: 10 }),
    // Compuerta de identidad en la frontera entre las dos subredes.
    group(
      [
        rect(gateX - 1.5, 186, 3, 28, { fill: 'paper', r: 0, stroke: undefined }),
        rect(gateX - 7, 160, 14, 26, { fill: 'ink', r: 2, stroke: undefined }),
        rect(gateX - 7, 214, 14, 26, { fill: 'ink', r: 2, stroke: undefined }),
        label(gateX, 152, 'IAM', { size: 9.5, tone: 'ink' }),
      ],
      motion('fade', 600),
    ),
    arrow(
      [
        [workload.x + 22, workload.y],
        [db.x - 30, db.y],
      ],
      { flow: true, tone: 'brand', width: 2 },
    ),
    label(350, 192, 'TLS', { size: 10 }),
    cylinder(db.x, db.y),
    group(
      [
        rect(478, 242, 52, 24, { fill: 'brandSoft', r: 4, width: 1.3 }),
        label(504, 258, 'KMS', { size: 10.5, tone: 'ink' }),
      ],
      motion('fade', 800),
    ),
    // Salida filtrada: solo por NAT.
    group(
      [
        line(workload.x, workload.y + 52, workload.x, 296, {
          dash: '3 3',
          stroke: 'muted',
          width: 1.2,
        }),
        rect(workload.x - 22, 298, 44, 22, { fill: 'paper', r: 4, width: 1.3 }),
        label(workload.x, 313, 'NAT', { size: 10.5, tone: 'ink' }),
        arrow(
          [
            [workload.x, 322],
            [workload.x, 390],
          ],
          { dash: '3 3', tone: 'muted', width: 1.2 },
        ),
      ],
      motion('fade', 1100),
    ),
  );
}
