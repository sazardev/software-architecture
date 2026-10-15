import { arrow, figure, group, heading, label, motion, rect } from '../figure-kit';
import type { Figure, FigureLocale } from '../figure-types';

const SUP = { x: 250, y: 98, w: 140, h: 46 } as const;

const agents = [
  { x: 130, key: 'a' },
  { x: 320, key: 'b' },
  { x: 510, key: 'c' },
] as const;

const AGENT_TOP = 236;
const AGENT_H = 52;
const AGENT_W = 136;

const COPY = {
  en: {
    agents: ['AGENT A', 'AGENT B', 'AGENT C'],
    context: 'OWN CONTEXT',
    cost: 'tokens · latency',
    supervisor: 'SUPERVISOR',
    title: 'One supervisor, separate contexts, a cost on every link',
    footer: 'THE COST LIVES ON EACH LINK',
  },
  es: {
    agents: ['AGENTE A', 'AGENTE B', 'AGENTE C'],
    context: 'CONTEXTO PROPIO',
    cost: 'tokens · latencia',
    supervisor: 'SUPERVISOR',
    title: 'Un supervisor, contextos separados y un coste en cada enlace',
    footer: 'EL COSTE VIVE EN CADA ENLACE',
  },
} as const;

/**
Un supervisor reparte tareas a agentes con contextos separados. Cada enlace cuesta tokens y
latencia: el dibujo los hace visibles, no solo la estructura.
*/
export function multiagenteCuandoUnAgenteBasta(locale: FigureLocale = 'es'): Figure {
  const copy = COPY[locale];

  return figure(
    heading(320, 56, copy.title, { size: 15 }),
    group(
      [
        rect(SUP.x, SUP.y, SUP.w, SUP.h, { fill: 'brandSoft', r: 4, width: 1.6 }),
        heading(SUP.x + SUP.w / 2, SUP.y + 29, copy.supervisor, { size: 13 }),
      ],
      motion('rise', 200),
    ),
    agents.map((agent, index) => {
      const name = copy.agents[index] ?? '';
      const left = agent.x - AGENT_W / 2;
      const isHot = agent.key === 'b';

      return group(
        [
          rect(agent.x - 82, AGENT_TOP - 14, 164, AGENT_H + 40, {
            dash: '4 4',
            r: 6,
            stroke: 'faint',
            width: 1,
          }),
          rect(left, AGENT_TOP, AGENT_W, AGENT_H, {
            fill: 'paper',
            r: 3,
            stroke: isHot ? 'accent' : 'ink',
            width: 1.6,
          }),
          heading(agent.x, AGENT_TOP + 32, name, { size: 13, tone: isHot ? 'accent' : 'ink' }),
          label(agent.x, AGENT_TOP + AGENT_H + 40, copy.context, { size: 10 }),
        ],
        motion('rise', 500 + index * 160),
      );
    }),
    group(
      [
        arrow(
          [
            [SUP.x + 14, SUP.y + SUP.h],
            [agents[0].x, AGENT_TOP - 4],
          ],
          { tone: 'muted' },
        ),
        arrow(
          [
            [SUP.x + SUP.w / 2, SUP.y + SUP.h],
            [agents[1].x, AGENT_TOP - 4],
          ],
          { flow: true, tone: 'accent', width: 1.8 },
        ),
        arrow(
          [
            [SUP.x + SUP.w - 14, SUP.y + SUP.h],
            [agents[2].x, AGENT_TOP - 4],
          ],
          { tone: 'muted' },
        ),
      ],
      motion('fade', 300),
    ),
    label(176, 176, copy.cost, { anchor: 'end', size: 10 }),
    label(332, 206, copy.cost, { anchor: 'start', size: 10, tone: 'accent' }),
    label(462, 176, copy.cost, { anchor: 'start', size: 10 }),
    group(
      [label(320, 356, copy.footer, { size: 11, tone: 'accent', tracking: 2 })],
      motion('fade', 1100),
    ),
  );
}
