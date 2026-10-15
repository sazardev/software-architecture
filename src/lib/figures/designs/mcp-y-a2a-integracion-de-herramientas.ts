import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const COPY = {
  en: {
    a2a: 'A2A',
    agent: 'AGENT',
    otherAgent: 'OTHER AGENT',
    tasks: 'TASKS',
    mcp: 'MCP',
    caption: 'Each connector is a contract: name, schema and permissions',
    title: 'MCP to tools, A2A to another agent',
    tools: ['DATA', 'FILES', 'TICKETS'],
  },
  es: {
    a2a: 'A2A',
    agent: 'AGENTE',
    otherAgent: 'OTRO AGENTE',
    tasks: 'TAREAS',
    mcp: 'MCP',
    caption: 'Cada conector es un contrato: nombre, esquema y permisos',
    title: 'MCP hacia herramientas, A2A hacia otro agente',
    tools: ['DATOS', 'ARCHIVOS', 'TICKETS'],
  },
} as const;

const TOOL_Y = [130, 200, 270] as const;

/**
Un agente se conecta a varias herramientas mediante un conector estándar (MCP) y, por otro lado,
delega tareas en otro agente de distinto proveedor (A2A). Cada enlace es un contrato explícito.
*/
export function mcpYA2a(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 62, copy.title, { size: 15 }),
    group(
      TOOL_Y.map((y, index) =>
        group(
          [
            rect(40, y - 20, 110, 40, { fill: 'paper', r: 8, width: 1.5 }),
            label(95, y + 4, copy.tools[index] ?? '', { size: 10.5, tracking: 1.2 }),
          ],
          motion('rise', index * 120),
        ),
      ),
    ),
    group(
      [
        arrow(
          [
            [150, 130],
            [248, 184],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [150, 200],
            [248, 200],
          ],
          { tone: 'ink' },
        ),
        arrow(
          [
            [150, 270],
            [248, 216],
          ],
          { tone: 'ink' },
        ),
        label(200, 112, copy.mcp, { size: 12, tone: 'accent', tracking: 2 }),
      ],
      motion('fade', 400),
    ),
    group(
      [
        rect(250, 160, 122, 80, { fill: 'brandSoft', r: 10, width: 1.8 }),
        label(311, 206, copy.agent, { size: 12, tone: 'ink', tracking: 1.6 }),
      ],
      motion('rise', 200),
    ),
    group(
      [
        rect(478, 160, 122, 80, { fill: 'paper', r: 10, width: 1.8 }),
        label(539, 206, copy.otherAgent, { size: 10.5, tone: 'ink', tracking: 1 }),
      ],
      motion('rise', 600),
    ),
    group(
      [
        arrow(
          [
            [372, 200],
            [476, 200],
          ],
          { flow: true, tone: 'accent', width: 2 },
        ),
        label(425, 186, copy.a2a, { size: 12, tone: 'accent', tracking: 2 }),
        label(425, 226, copy.tasks, { size: 9.5 }),
      ],
      motion('fade', 900),
    ),
    label(320, 360, copy.caption, { size: 10, tracking: 0.4 }),
  );
}
