import { useEffect, useRef, useState } from 'react';

import { useTheme } from '@/lib/theme/theme-context';

type MermaidDiagramProps = Readonly<{
  chart: string;
}>;

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderChart() {
      try {
        const { default: mermaid } = await import('mermaid');
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
        });

        const { svg } = await mermaid.render(`mermaid-${crypto.randomUUID()}`, chart);

        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (renderError) {
        if (!isCancelled) {
          setError(
            renderError instanceof Error
              ? renderError.message
              : 'No se pudo renderizar el diagrama.',
          );
        }
      }
    }

    void renderChart();

    return () => {
      isCancelled = true;
    };
  }, [chart, resolvedTheme]);

  if (error) {
    return (
      <div
        className="my-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <div
      aria-label="Diagrama"
      className="mermaid-diagram my-6 flex justify-center"
      ref={containerRef}
      role="img"
    />
  );
}
