import type { MermaidConfig } from 'mermaid';

/**
Tema de plano para todos los diagramas Mermaid de los artículos.
Usa las variables CSS del sitio (el SVG se inserta inline, así que las hereda) y el panel
es siempre oscuro, igual que los diagramas a medida de la portada.
*/
const themeCSS = `
  .node rect, .node circle, .node ellipse, .node path.basic, .node .label-container {
    fill: rgb(255 255 255 / 0.06) !important;
    filter: none !important;
    stroke: rgb(255 255 255 / 0.5) !important;
    stroke-width: 1.3px !important;
  }
  .node polygon.label-container, .node polygon, .node.decision path {
    fill: color-mix(in oklab, var(--color-accent-300) 10%, transparent) !important;
    filter: none !important;
    stroke: var(--color-accent-300) !important;
    stroke-width: 1.5px !important;
  }
  .node.is-selected .label-container, .node.is-selected rect, .node.is-selected polygon {
    stroke: var(--color-accent-300) !important;
    stroke-width: 2.4px !important;
  }
  .node.is-selected { filter: drop-shadow(0 0 8px color-mix(in oklab, var(--color-accent-300) 55%, transparent)); }
  .node:hover .label-container, .node:hover rect, .node:hover polygon {
    stroke: var(--color-accent-300) !important;
  }
  .nodeLabel, .nodeLabel p, .label, .label text, .label span, text.actor > tspan, .messageText,
  .loopText, .loopText > tspan, .labelText, .labelText > tspan, .classTitle, .classLabel .label {
    color: #fff;
    fill: #fff;
    font-family: var(--font-sans);
    font-size: 14px;
  }
  .flowchart-link, .messageLine0, .messageLine1, .relation, .actor-line, .loopLine {
    stroke: rgb(255 255 255 / 0.7);
    stroke-width: 1.4px;
  }
  .actor-line { stroke-opacity: 0.4; }
  .arrowheadPath, .marker, marker path, #arrowhead path {
    fill: rgb(255 255 255 / 0.85);
    stroke: rgb(255 255 255 / 0.85);
  }
  .edgeLabel, .edgeLabel p, .edgeLabel span, .edgeLabel .label {
    background-color: var(--color-brand-900);
    color: var(--color-accent-300);
    fill: var(--color-accent-300);
    font-family: var(--font-mono);
    font-size: 11.5px;
    letter-spacing: 0.04em;
  }
  .edgeLabel rect, .labelBkg { fill: var(--color-brand-900); opacity: 1; }
  .cluster rect {
    fill: rgb(255 255 255 / 0.03);
    stroke: rgb(255 255 255 / 0.3);
    stroke-dasharray: 4 4;
    stroke-width: 1.2px;
  }
  .cluster-label, .cluster-label span, .cluster-label .nodeLabel {
    color: var(--color-accent-300);
    fill: var(--color-accent-300);
    font-family: var(--font-mono);
    font-size: 12px;
  }
  .actor, .classGroup rect, g.classGroup line {
    fill: rgb(255 255 255 / 0.06);
    stroke: rgb(255 255 255 / 0.5);
  }
  .note { fill: color-mix(in oklab, var(--color-accent-300) 12%, transparent); stroke: var(--color-accent-300); }
  .noteText, .noteText > tspan { fill: #fff; }
`;

export const mermaidConfig: MermaidConfig = {
  flowchart: {
    curve: 'linear',
    htmlLabels: true,
    nodeSpacing: 44,
    padding: 16,
    rankSpacing: 58,
    useMaxWidth: false,
    wrappingWidth: 220,
  },
  sequence: { actorMargin: 28, messageMargin: 38, useMaxWidth: false, width: 112 },
  startOnLoad: false,
  theme: 'base',
  themeCSS,
  themeVariables: {
    background: 'transparent',
    darkMode: true,
    fontFamily: 'Instrument Sans Variable, ui-sans-serif, system-ui, sans-serif',
    lineColor: '#d7dcf0',
    primaryBorderColor: '#8da0e6',
    primaryColor: '#26377f',
    primaryTextColor: '#ffffff',
    secondaryColor: '#4a2a1c',
    tertiaryColor: '#1f2d6b',
    textColor: '#ffffff',
  },
};
