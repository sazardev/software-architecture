import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useMessages } from '@/lib/i18n/use-messages';

import type { DiagramContext } from './diagram-context';
import { enhanceSvg } from './enhance-svg';
import { createFlowGraph, type FlowGraph, type GraphInfo } from './svg-graph';
import { ToolButton, ToolIcon } from './ToolButton';
import { useDiagramExport } from './use-diagram-export';
import { useViewerGestures } from './use-viewer-gestures';

type DiagramViewerProps = Readonly<{
  context: DiagramContext;
  markup: string;
  onClose: () => void;
  svgId: string;
}>;

type Natural = Readonly<{ height: number; width: number }>;

const ZOOM_STEP = 1.25;

/**
Visor a pantalla completa. El zoom redimensiona el SVG (no lo escala con CSS), así que siempre
se re-dibuja nítido. Permite mover, hacer zoom, reacomodar nodos de los flowcharts, resaltar las
conexiones de un nodo y exportar lo que se ve a PNG/SVG.
*/
export function DiagramViewer({ context, markup, onClose, svgId }: DiagramViewerProps) {
  const { diagram } = useMessages();
  const dialogRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<FlowGraph | null>(null);
  const naturalRef = useRef<Natural>({ height: 0, width: 0 });
  const [info, setInfo] = useState<GraphInfo | null>(null);
  const [layoutVersion, setLayoutVersion] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const { fit, view, zoomBy } = useViewerGestures({
    graphRef,
    onSelect: setSelectedKey,
    viewportRef,
  });
  const { error, exportPng, exportSvg, isBusy } = useDiagramExport(
    () => contentRef.current?.querySelector('svg') ?? null,
  );

  // Inserta una copia propia del SVG (ids distintos) y la prepara; también restablece la disposición.
  useEffect(() => {
    const content = contentRef.current;

    if (content === null) {
      return;
    }

    content.innerHTML = markup.split(svgId).join(`${svgId}-viewer`);

    const svg = content.querySelector('svg');

    if (svg === null) {
      return;
    }

    const box = svg.viewBox.baseVal;

    svg.removeAttribute('style');
    svg.setAttribute('class', 'block overflow-visible');
    svg.setAttribute('text-rendering', 'geometricPrecision');
    enhanceSvg(svg);

    graphRef.current = createFlowGraph(svg);
    naturalRef.current = { height: box.height, width: box.width };
    setInfo(graphRef.current?.info ?? null);
    setSelectedKey(null);
    fit(naturalRef.current);
  }, [fit, layoutVersion, markup, svgId]);

  // Zoom nítido: se dimensiona el SVG a su tamaño real en pantalla en lugar de escalar una capa.
  useLayoutEffect(() => {
    const svg = contentRef.current?.querySelector('svg');
    const { height, width } = naturalRef.current;

    svg?.setAttribute('width', String(width * view.k));
    svg?.setAttribute('height', String(height * view.k));
  }, [view.k, layoutVersion, info]);

  // Resalta el nodo seleccionado y sus vecinos.
  useEffect(() => {
    const graph = graphRef.current;

    if (graph === null || info === null) {
      return;
    }

    const node = info.nodes.find((candidate) => candidate.key === selectedKey);

    if (node === undefined) {
      graph.setFocus(null, null);
    } else {
      graph.setFocus(new Set([node.key, ...node.incoming, ...node.outgoing]), node.key);
    }
  }, [info, selectedKey]);

  // Teclado, foco inicial y bloqueo del scroll de la página mientras el visor está abierto.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();

        return;
      }

      switch (event.key) {
        case '+':
        case '=': {
          zoomBy(ZOOM_STEP);
          break;
        }
        case '-': {
          zoomBy(1 / ZOOM_STEP);
          break;
        }
        case '0': {
          fit(naturalRef.current, true);
          break;
        }
        default: {
          break;
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [fit, onClose, zoomBy]);

  const isEditable = info !== null;
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio;
  const snap = (value: number) => Math.round(value * dpr) / dpr;

  return createPortal(
    <div
      aria-label={context.title}
      aria-modal="true"
      className="fixed inset-0 z-[100] flex flex-col bg-brand-950 text-white outline-none"
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
    >
      <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/15 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg leading-tight font-medium">{context.title}</p>
          {context.section === null ? null : (
            <p className="mt-0.5 truncate font-mono text-[0.68rem] tracking-[0.14em] text-accent-300 uppercase">
              {context.section}
            </p>
          )}
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          {error === null ? null : (
            <span className="mr-2 text-xs text-accent-300" role="alert">
              {error}
            </span>
          )}
          <ToolButton
            label={diagram.zoomOut}
            onClick={() => {
              zoomBy(1 / ZOOM_STEP);
            }}
          >
            −
          </ToolButton>
          <span aria-live="polite" className="w-12 text-center font-mono text-xs text-neutral-300">
            {Math.round(view.k * 100)}%
          </span>
          <ToolButton
            label={diagram.zoomIn}
            onClick={() => {
              zoomBy(ZOOM_STEP);
            }}
          >
            +
          </ToolButton>
          <ToolButton
            label={diagram.fit}
            onClick={() => {
              fit(naturalRef.current, true);
            }}
          >
            <ToolIcon name="fit" />
          </ToolButton>
          {isEditable ? (
            <ToolButton
              label={diagram.resetLayout}
              onClick={() => {
                setLayoutVersion((version) => version + 1);
              }}
            >
              <ToolIcon name="reset" />
            </ToolButton>
          ) : null}
          <ToolButton disabled={isBusy} label={diagram.exportPng} onClick={exportPng}>
            <ToolIcon name="download" />
            PNG
          </ToolButton>
          <ToolButton disabled={isBusy} label={diagram.exportSvg} onClick={exportSvg}>
            <ToolIcon name="download" />
            SVG
          </ToolButton>
          <ToolButton label={diagram.close} onClick={onClose}>
            <ToolIcon name="close" />
          </ToolButton>
        </div>
      </header>

      <div
        className="bp-panel relative min-h-0 flex-1 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
        data-editable={isEditable}
        ref={viewportRef}
        style={{ backgroundPosition: `${view.x}px ${view.y}px` }}
      >
        <div
          className="mermaid-viewer absolute top-0 left-0"
          ref={contentRef}
          style={{ transform: `translate(${snap(view.x)}px, ${snap(view.y)}px)` }}
        />
        <p className="pointer-events-none absolute bottom-3 left-4 max-w-[calc(100%-2rem)] truncate rounded-sm bg-brand-950/70 px-2 py-1 text-xs text-neutral-300">
          {isEditable ? diagram.hintFlow : diagram.hintStatic}
        </p>
      </div>
    </div>,
    document.body,
  );
}
