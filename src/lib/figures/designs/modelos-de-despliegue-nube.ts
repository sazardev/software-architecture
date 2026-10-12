import {
  arrow,
  circle,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  poly,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const zoneTop = 52;
const zoneHeight = 136;

/**
Frontera de un modelo de despliegue: borde discontinuo y rótulo en la esquina.
*/
function zone(x: number, y: number, w: number, h: number, tag: string, delay: number) {
  return group(
    [
      rect(x, y, w, h, { dash: '6 4', r: 6, width: 1.4 }),
      label(x + 12, y + 22, tag, { anchor: 'start', size: 11, tone: 'ink' }),
    ],
    motion('rise', delay),
  );
}

export function modelosDeDespliegueNube(): Figure {
  const tenants = [0, 1, 2].flatMap((col) =>
    [0, 1].map((row) =>
      rect(56 + col * 44, 98 + row * 34, 34, 24, { fill: 'brandSoft', width: 1.2 }),
    ),
  );

  return figure(
    label(320, 32, 'NIST SP 800-145', { size: 11, tone: 'ink', tracking: 3 }),
    // Pública: una infraestructura, muchas organizaciones.
    zone(24, zoneTop, 186, zoneHeight, 'N ORG', 0),
    group(tenants, motion('rise', 120)),
    // Privada: una sola organización.
    zone(226, zoneTop, 186, zoneHeight, '1 ORG', 160),
    group([rect(262, 98, 114, 58, { fill: 'brandSoft', r: 4 })], motion('rise', 280)),
    // Comunitaria: varias organizaciones con intereses compartidos.
    zone(428, zoneTop, 186, zoneHeight, 'K ORG', 320),
    group(
      [
        rect(452, 92, 138, 72, { fill: 'paper', r: 10, stroke: 'muted', width: 1.2 }),
        ...[466, 506, 546].map((x) => rect(x, 106, 30, 44, { fill: 'brandSoft', width: 1.2 })),
      ],
      motion('rise', 440),
    ),
    // Híbrida: composición de dos infraestructuras que siguen siendo distintas.
    zone(24, 204, 592, 180, '1 + N', 480),
    group(
      [
        rect(48, 236, 248, 128, { dash: '6 4', r: 5, stroke: 'muted', width: 1.2 }),
        label(60, 256, 'DC', { anchor: 'start', size: 10 }),
        rect(344, 236, 248, 128, { dash: '6 4', r: 5, stroke: 'muted', width: 1.2 }),
        label(356, 256, 'REGION', { anchor: 'start', size: 10 }),
        line(296, 300, 344, 300, { dash: '3 5', stroke: 'muted', width: 1.4 }),
        label(320, 290, 'WAN', { size: 10 }),
        ...[372, 400, 428].map((x) => rect(x, 296, 20, 20, { fill: 'brandSoft', width: 1.2 })),
      ],
      motion('rise', 600),
    ),
    // Gravedad de los datos: la aplicación vive junto a los datos, dentro de la misma frontera.
    circle(118, 304, 36, { dash: '2 4', stroke: 'muted', width: 1 }),
    pulse(118, 304, 26, 900),
    group(
      [
        circle(118, 304, 22, { fill: 'accent', width: 1.8 }),
        heading(118, 309, 'DB', { font: 'mono', size: 13, tracking: 1 }),
        rect(196, 284, 76, 40, { fill: 'paper', r: 4 }),
        heading(234, 309, 'APP', { font: 'mono', size: 12, tracking: 1 }),
      ],
      motion('fade', 760),
    ),
    arrow(
      [
        [194, 304],
        [158, 304],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    // La alternativa: la aplicación lejos de los datos paga la frontera en cada ida y vuelta.
    group(
      [
        rect(480, 284, 76, 40, { dash: '4 4', r: 4, stroke: 'muted', width: 1.2 }),
        heading(518, 309, 'APP', { font: 'mono', size: 12, tone: 'muted', tracking: 1 }),
        poly(
          [
            [500, 324],
            [470, 346],
            [170, 346],
            [146, 330],
          ],
          { dash: '3 5', stroke: 'muted', width: 1.2 },
        ),
        line(313, 339, 327, 353, { stroke: 'ink', width: 1.6 }),
        line(313, 353, 327, 339, { stroke: 'ink', width: 1.6 }),
        label(320, 376, 'RTT', { size: 10 }),
      ],
      motion('fade', 1000),
    ),
  );
}
