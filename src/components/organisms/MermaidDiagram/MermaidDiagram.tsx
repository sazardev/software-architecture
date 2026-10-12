import { useEffect, useRef, useState, type PointerEvent } from 'react';

import { BlueprintFrame } from '@/components/atoms';
import { useMessages } from '@/lib/i18n/use-messages';

import { readDiagramContext, type DiagramContext } from './diagram-context';
import { DiagramViewer } from './DiagramViewer';
import { enhanceSvg } from './enhance-svg';
import { mermaidConfig } from './mermaid-theme';
import { ToolButton, ToolIcon } from './ToolButton';
import { useDiagramExport } from './use-diagram-export';

type MermaidDiagramProps = Readonly<{
  chart: string;
}>;

const ZOOM_LEVELS = [1, 1.5, 2, 3] as const;
/**
Ancho mínimo (px) del lienzo en "ajustar": por debajo el texto deja de leerse y se prefiere scroll/arrastre.
*/
const MIN_READABLE_WIDTH = 640;

type Natural = Readonly<{ width: number }>;
type Rendered = Readonly<{ markup: string; svgId: string }>;

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const messages = useMessages();
  const frameRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ left: number; top: number; x: number; y: number } | null>(null);
  const [isNear, setIsNear] = useState(false);
  const [natural, setNatural] = useState<Natural | null>(null);
  const [rendered, setRendered] = useState<Rendered | null>(null);
  const [viewerContext, setViewerContext] = useState<DiagramContext | null>(null);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const zoom = ZOOM_LEVELS[zoomIndex] ?? 1;
  const {
    error: exportError,
    exportPng,
    exportSvg,
    isBusy,
  } = useDiagramExport(() => containerRef.current?.querySelector('svg') ?? null);

  // Carga mermaid y renderiza solo cuando el diagrama se acerca al viewport.
  useEffect(() => {
    const element = frameRef.current;

    if (element === null) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.every((entry) => !entry.isIntersecting)) {
          return;
        }

        setIsNear(true);
        observer.disconnect();
      },
      { rootMargin: '400px 0px' },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isNear) {
      return;
    }

    let isCancelled = false;

    async function renderChart() {
      try {
        const { default: mermaid } = await import('mermaid');

        mermaid.initialize(mermaidConfig);

        const svgId = `mermaid-${crypto.randomUUID()}`;
        const { svg } = await mermaid.render(svgId, chart);
        const container = containerRef.current;

        if (isCancelled || container === null) {
          return;
        }

        container.innerHTML = svg;

        const svgElement = container.querySelector('svg');

        if (svgElement === null) {
          return;
        }

        const box = svgElement.viewBox.baseVal;

        svgElement.removeAttribute('height');
        svgElement.removeAttribute('width');
        svgElement.removeAttribute('style');
        svgElement.setAttribute('class', 'block h-auto w-full');
        enhanceSvg(svgElement);
        setNatural({ width: box.width });
        setRendered({ markup: svg, svgId });
      } catch (renderError) {
        if (!isCancelled) {
          setError(renderError instanceof Error ? renderError.message : messages.diagram.error);
        }
      }
    }

    void renderChart();

    return () => {
      isCancelled = true;
    };
  }, [chart, isNear, messages.diagram.error]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current;

    if (viewport === null || event.pointerType !== 'mouse') {
      return;
    }

    dragRef.current = {
      left: viewport.scrollLeft,
      top: viewport.scrollTop,
      x: event.clientX,
      y: event.clientY,
    };
    viewport.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    const viewport = viewportRef.current;

    if (drag === null || viewport === null) {
      return;
    }

    viewport.scrollLeft = drag.left - (event.clientX - drag.x);
    viewport.scrollTop = drag.top - (event.clientY - drag.y);
  }

  function endDrag() {
    dragRef.current = null;
  }

  if (error !== null) {
    return (
      <div
        className="my-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        role="alert"
      >
        {error}
      </div>
    );
  }

  const canvasStyle =
    natural === null
      ? undefined
      : {
          maxWidth: `${natural.width * zoom}px`,
          minWidth: `${Math.min(natural.width, MIN_READABLE_WIDTH) * zoom}px`,
          width: `${zoom * 100}%`,
        };

  return (
    <BlueprintFrame className="not-prose my-8 border-brand-950 dark:border-brand-950">
      <div className="bp-panel relative min-h-48" ref={frameRef}>
        <div className="absolute top-3 right-3 left-3 z-10 flex flex-wrap items-center justify-end gap-1.5">
          {exportError === null ? null : (
            <span className="mr-2 text-xs text-accent-300" role="alert">
              {exportError}
            </span>
          )}
          <ToolButton
            disabled={zoomIndex === 0}
            label={messages.diagram.zoomOut}
            onClick={() => {
              setZoomIndex((index) => Math.max(0, index - 1));
            }}
          >
            −
          </ToolButton>
          <ToolButton
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            label={messages.diagram.zoomIn}
            onClick={() => {
              setZoomIndex((index) => Math.min(ZOOM_LEVELS.length - 1, index + 1));
            }}
          >
            +
          </ToolButton>
          <ToolButton
            disabled={zoomIndex === 0}
            label={messages.diagram.zoomReset}
            onClick={() => {
              setZoomIndex(0);
            }}
          >
            <ToolIcon name="fit" />
          </ToolButton>
          <ToolButton
            className="hidden sm:flex"
            disabled={rendered === null || isBusy}
            label={messages.diagram.exportPng}
            onClick={exportPng}
          >
            <ToolIcon name="download" />
            PNG
          </ToolButton>
          <ToolButton
            className="hidden sm:flex"
            disabled={rendered === null || isBusy}
            label={messages.diagram.exportSvg}
            onClick={exportSvg}
          >
            <ToolIcon name="download" />
            SVG
          </ToolButton>
          <ToolButton
            disabled={rendered === null}
            label={messages.diagram.expand}
            onClick={() => {
              if (frameRef.current !== null) {
                setViewerContext(readDiagramContext(frameRef.current));
              }
            }}
          >
            <ToolIcon name="expand" />
          </ToolButton>
        </div>
        <div
          aria-label={messages.diagram.label}
          className="mermaid-diagram overflow-auto p-6 pt-14 sm:p-10 sm:pt-14"
          onPointerCancel={endDrag}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          ref={viewportRef}
          role="img"
        >
          <div className="mx-auto" ref={containerRef} style={canvasStyle} />
        </div>
      </div>
      {viewerContext !== null && rendered !== null ? (
        <DiagramViewer
          context={viewerContext}
          markup={rendered.markup}
          onClose={() => {
            setViewerContext(null);
          }}
          svgId={rendered.svgId}
        />
      ) : null}
    </BlueprintFrame>
  );
}
