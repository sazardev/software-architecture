import { circle, figure, group, heading, label, line, motion, pulse } from '../figure-kit';
import type { Figure } from '../figure-types';

const ROW_SIN = 150;
const ROW_CON = 270;
const RECOVERY_X = 300;

const sinJitter = [292, 296, 300, 300, 304, 300, 296, 304, 300, 298] as const;
const conJitter = [120, 176, 232, 301, 355, 412, 458, 512, 560, 596] as const;

/**
Sin jitter, todos los clientes reintentan a la vez y golpean al servicio que acaba de
recuperarse. Con jitter, la misma carga llega repartida en el tiempo.
*/
export function reintentosConJitter(): Figure {
  return figure(
    heading(320, 60, 'Mismos reintentos, distinto impacto', { size: 15 }),
    label(60, 110, 'SIN JITTER', { anchor: 'start', size: 11, tone: 'accent', tracking: 2 }),
    group([line(60, ROW_SIN, 600, ROW_SIN, { stroke: 'ink', width: 1.4 })], motion('draw', 200)),
    group(
      sinJitter.map((x, index) =>
        circle(x, ROW_SIN + ((index % 3) - 1) * 6, 5, { fill: 'accent', stroke: undefined }),
      ),
      motion('fade', 400),
    ),
    pulse(RECOVERY_X, ROW_SIN, 18, 900),
    label(60, 226, 'CON JITTER', { anchor: 'start', size: 11, tracking: 2 }),
    group([line(60, ROW_CON, 600, ROW_CON, { stroke: 'ink', width: 1.4 })], motion('draw', 800)),
    group(
      conJitter.map((x, index) =>
        circle(x, ROW_CON + (index % 2 === 0 ? -4 : 4), 5, {
          fill: 'brandSoft',
          stroke: 'ink',
          width: 1.2,
        }),
      ),
      motion('fade', 1000),
    ),
    label(RECOVERY_X, 340, 'servicio recuperado', { tone: 'muted' }),
    label(320, 372, 'el tiempo se reparte; la capacidad no cambia', { tone: 'muted' }),
  );
}
