import type { RoadmapPath } from '@/lib/roadmap/roadmap-registry';

/**
Geometría del plano de un roadmap (coordenadas SVG, sin DOM). Cada etapa es una columna; los
pasos bajan en las columnas pares y suben en las impares, así la línea serpentea como un trazado
de metro y los conectores entre etapas corren por las calles superior e inferior.
*/
export const ROADMAP_LAYOUT = {
  columnPitch: 368,
  columnWidth: 320,
  gutter: 40,
  headerHeight: 132,
  labelChars: 28,
  labelLines: 2,
  labelOffset: 32,
  nodeOffset: 44,
  nodeRadius: 19,
  padding: 56,
  rowHeight: 108,
} as const;

const CORNER = 14;

export type LayoutNode = {
  lines: string[];
  number: number;
  slug: string;
  stageIndex: number;
  x: number;
  y: number;
};

export type LayoutStage = {
  height: number;
  index: number;
  width: number;
  x: number;
  y: number;
};

export type LayoutSegment = {
  d: string;
  from: string;
  to: string;
};

export type RoadmapLayout = {
  height: number;
  nodes: LayoutNode[];
  segments: LayoutSegment[];
  stages: LayoutStage[];
  width: number;
};

/**
Parte un título en líneas de `maxChars` como máximo; la última se recorta con «…».
*/
export function wrapLabel(text: string, maxChars: number, maxLines: number): string[] {
  const lines: string[] = [];
  let current = '';

  for (const word of text.split(/\s+/)) {
    const candidate = current === '' ? word : `${current} ${word}`;

    if (current === '' || candidate.length <= maxChars) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current !== '') {
    lines.push(current);
  }

  if (lines.length <= maxLines) {
    return lines.map((line) => truncate(line, maxChars));
  }

  const kept = lines.slice(0, maxLines);
  const last = kept.at(-1) ?? '';

  kept[maxLines - 1] = truncate(`${last}…`, maxChars);

  return kept;
}

function truncate(line: string, maxChars: number): string {
  return line.length <= maxChars ? line : `${line.slice(0, maxChars - 1).trimEnd()}…`;
}

/**
Conector ortogonal con esquinas redondeadas que sale vertical hacia la calle `gutterY`, la
recorre en horizontal y entra vertical en el nodo destino.
*/
function connector(from: LayoutNode, to: LayoutNode, gutterY: number): string {
  const towardsGutter = gutterY > from.y ? 1 : -1;
  const backFromGutter = to.y > gutterY ? 1 : -1;

  return [
    `M${from.x} ${from.y}`,
    `V${gutterY - towardsGutter * CORNER}`,
    `Q${from.x} ${gutterY} ${from.x + CORNER} ${gutterY}`,
    `H${to.x - CORNER}`,
    `Q${to.x} ${gutterY} ${to.x} ${gutterY + backFromGutter * CORNER}`,
    `V${to.y}`,
  ].join('');
}

export function layoutRoadmap(path: RoadmapPath): RoadmapLayout {
  const L = ROADMAP_LAYOUT;
  const rows = Math.max(1, ...path.stages.map((stage) => stage.steps.length));
  const rowsTop = L.padding + L.headerHeight + L.gutter;
  const topGutter = L.padding + L.headerHeight + L.gutter / 2;
  const bottomGutter = rowsTop + rows * L.rowHeight + L.gutter / 2;
  const frameHeight = L.headerHeight + rows * L.rowHeight + L.gutter * 2;

  const stages = path.stages.map((stage): LayoutStage => ({
    height: frameHeight,
    index: stage.index,
    width: L.columnWidth,
    x: L.padding + stage.index * L.columnPitch,
    y: L.padding,
  }));

  const nodes = path.stages.flatMap((stage) =>
    stage.steps.map((step, index): LayoutNode => {
      const row = stage.index % 2 === 0 ? index : rows - 1 - index;

      return {
        lines: wrapLabel(step.entry.title, L.labelChars, L.labelLines),
        number: step.number,
        slug: step.entry.slug,
        stageIndex: stage.index,
        x: L.padding + stage.index * L.columnPitch + L.nodeOffset,
        y: rowsTop + row * L.rowHeight + L.rowHeight / 2,
      };
    }),
  );

  const segments = nodes.slice(1).map((to, index): LayoutSegment => {
    const from = nodes[index] ?? to;
    const isSameStage = from.stageIndex === to.stageIndex;
    const gutterY = from.stageIndex % 2 === 0 ? bottomGutter : topGutter;

    return {
      d: isSameStage ? `M${from.x} ${from.y}V${to.y}` : connector(from, to, gutterY),
      from: from.slug,
      to: to.slug,
    };
  });

  return {
    height: L.padding * 2 + frameHeight,
    nodes,
    segments,
    stages,
    width: L.padding * 2 + (path.stages.length - 1) * L.columnPitch + L.columnWidth,
  };
}
