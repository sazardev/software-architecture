import {
  arrow,
  dimension,
  figure,
  group,
  heading,
  label,
  line,
  motion,
  pulse,
  rect,
} from '../figure-kit';
import type { Figure } from '../figure-types';

const LINK_Y = 124;
const BREAK_X = 320;

function box(x: number, y: number, text: string, delay: number) {
  return group(
    [
      rect(x, y, 84, 40, { fill: 'paper', r: 4, width: 1.5 }),
      heading(x + 42, y + 25, text, { font: 'mono', size: 12, tracking: 1.5 }),
    ],
    motion('fade', delay),
  );
}

export function nubeHibridaEnDetalle(): Figure {
  return figure(
    // Dos zonas distintas: el centro propio y la región del proveedor.
    group(
      [
        rect(24, 72, 250, 264, { fill: 'paper', r: 8, width: 1.6 }),
        label(149, 56, 'ON-PREM', { tone: 'ink', tracking: 3 }),
      ],
      motion('rise'),
    ),
    group(
      [
        rect(366, 72, 250, 264, { fill: 'brandSoft', r: 8, width: 1.6 }),
        label(491, 56, 'CLOUD', { tone: 'ink', tracking: 3 }),
      ],
      motion('rise', 120),
    ),
    // Lado local: el flujo que sigue en pie sin el enlace.
    box(44, 104, 'APP', 300),
    box(170, 104, 'DATA', 380),
    box(44, 268, 'EDGE', 460),
    box(170, 268, 'IdP', 540),
    arrow(
      [
        [86, 268],
        [86, 144],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    arrow(
      [
        [128, 124],
        [170, 124],
      ],
      { flow: true, tone: 'brand', width: 1.8 },
    ),
    line(170, 276, 128, 144, { dash: '3 5', stroke: 'muted', width: 1.2 }),
    label(212, 214, 'LOCAL', { size: 11, tone: 'brand' }),
    // Lado de la nube: plano de control, identidad, telemetría y despliegue.
    box(386, 104, 'CONTROL', 620),
    box(512, 104, 'SSO', 700),
    box(386, 268, 'LOGS', 780),
    box(512, 268, 'IaC', 860),
    group(
      [
        line(428, 144, 428, 268, { dash: '3 5', stroke: 'muted', width: 1.2 }),
        line(554, 144, 554, 268, { dash: '3 5', stroke: 'muted', width: 1.2 }),
        label(491, 214, 'API', { size: 11 }),
      ],
      motion('fade', 900),
    ),
    // El enlace: un solo punto de fallo, cortado.
    group(
      [
        line(254, LINK_Y, BREAK_X - 12, LINK_Y, { width: 1.8 }),
        line(BREAK_X + 12, LINK_Y, 386, LINK_Y, { width: 1.8 }),
        line(BREAK_X - 7, LINK_Y - 7, BREAK_X + 7, LINK_Y + 7, { stroke: 'accent', width: 2.4 }),
        line(BREAK_X - 7, LINK_Y + 7, BREAK_X + 7, LINK_Y - 7, { stroke: 'accent', width: 2.4 }),
        label(BREAK_X, LINK_Y - 26, 'LINK', { size: 11 }),
        label(BREAK_X, LINK_Y + 32, 'OFFLINE', { size: 10, tone: 'accent' }),
      ],
      motion('fade', 600),
    ),
    pulse(BREAK_X, LINK_Y, 18, 1000),
    dimension([274, 366], [366, 366], 'RTT'),
  );
}
