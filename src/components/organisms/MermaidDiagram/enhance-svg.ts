const SVG_NS = 'http://www.w3.org/2000/svg';

/**
Anima un SVG de Mermaid ya renderizado: nodos y etiquetas entran en cascada y cada conector
recibe un trazo superpuesto que fluye (mismo lenguaje que los diagramas a medida del sitio).
Solo toca clases y estilos: la geometría que calculó Mermaid se conserva.
*/
export function enhanceSvg(svg: SVGSVGElement): void {
  const reveal = svg.querySelectorAll<SVGElement>('g.cluster, g.node, g.edgeLabel, g.actor');

  reveal.forEach((element, index) => {
    element.classList.add('animate-fade');
    element.style.animationDelay = `${Math.min(index * 45, 900)}ms`;
  });

  const links = svg.querySelectorAll<SVGPathElement>('path.flowchart-link');

  links.forEach((link) => {
    // Mermaid ya dibuja punteados los enlaces `-.->`; solo se anima el trazo sólido.
    if (
      link.classList.contains('edge-pattern-dotted') ||
      link.classList.contains('edge-pattern-dashed')
    ) {
      return;
    }

    const flow = document.createElementNS(SVG_NS, 'path');

    flow.setAttribute('d', link.getAttribute('d') ?? '');
    flow.setAttribute('class', 'animate-flow');
    flow.setAttribute('fill', 'none');
    flow.setAttribute('pointer-events', 'none');
    flow.style.stroke = 'var(--color-accent-300)';
    flow.style.strokeDasharray = '5 7';
    flow.style.strokeLinecap = 'round';
    flow.style.strokeWidth = '1.8px';
    link.after(flow);
  });
}
