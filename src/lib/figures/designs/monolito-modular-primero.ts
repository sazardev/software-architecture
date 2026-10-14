import { arrow, figure, group, heading, label, line, motion, rect } from '../figure-kit';
import type { Figure } from '../figure-types';

const MODULE_Y = 124;
const MODULE_W = 150;
const MODULE_H = 120;
const modules = [
  { name: 'PEDIDOS', x: 76 },
  { name: 'PAGOS', x: 245 },
  { name: 'ENVÍOS', x: 414 },
] as const;

/**
Un proceso con módulos. Los módulos se hablan solo por su API pública; el acceso directo a
los datos de otro módulo queda prohibido.
*/
export function monolitoModularPrimero(): Figure {
  return figure(
    group(
      [
        rect(40, 80, 560, 260, { fill: 'paper', r: 14, width: 1.5 }),
        label(60, 104, 'UN PROCESO', { anchor: 'start', size: 10.5 }),
      ],
      motion('fade'),
    ),
    modules.map((module, index) =>
      group(
        [
          rect(module.x, MODULE_Y, MODULE_W, MODULE_H, { fill: 'brandSoft', r: 8, width: 1.5 }),
          label(module.x + MODULE_W / 2, MODULE_Y + 30, module.name, { size: 11, tracking: 1.4 }),
          rect(module.x + 22, MODULE_Y + 56, MODULE_W - 44, 22, { fill: 'paper', r: 4, width: 1 }),
          label(module.x + MODULE_W / 2, MODULE_Y + 71, 'API PÚBLICA', { size: 9.5 }),
          rect(module.x + 22, MODULE_Y + 86, MODULE_W - 44, 20, { fill: 'paper', r: 4, width: 1 }),
          label(module.x + MODULE_W / 2, MODULE_Y + 100, 'DATOS PROPIOS', { size: 9 }),
        ],
        motion('rise', index * 160),
      ),
    ),
    group(
      [
        arrow(
          [
            [MODULE_W + 80, MODULE_Y + 67],
            [245, MODULE_Y + 67],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [MODULE_W + 249, MODULE_Y + 67],
            [414, MODULE_Y + 67],
          ],
          { tone: 'ink' },
        ),
      ],
      motion('fade', 600),
    ),
    group(
      [
        line(150, 268, 490, 268, { dash: '5 5', stroke: 'accent', width: 1.6 }),
        label(320, 288, 'acceso directo a los datos de otro módulo: prohibido', {
          size: 10.5,
          tone: 'accent',
        }),
      ],
      motion('draw', 900),
    ),
    heading(320, 60, 'Fronteras dentro de un solo proceso', { size: 15 }),
  );
}
