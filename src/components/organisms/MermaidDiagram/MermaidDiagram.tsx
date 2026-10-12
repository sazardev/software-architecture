import { useEffect, useRef, useState } from 'react';

import { BlueprintFrame } from '@/components/atoms';
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
        const isDark = resolvedTheme === 'dark';

        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            fontFamily: 'Instrument Sans Variable, ui-sans-serif, system-ui, sans-serif',
            lineColor: isDark ? '#a8a29a' : '#6b655d',
            primaryBorderColor: isDark ? '#7f9bf0' : '#3b55c4',
            primaryColor: isDark ? '#1f2a52' : '#e6ebfb',
            primaryTextColor: isDark ? '#f4f1ec' : '#1b1814',
            secondaryColor: isDark ? '#4a2a1c' : '#fbe6d8',
            tertiaryColor: isDark ? '#26221d' : '#f4f0ea',
          },
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
        className="my-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        role="alert"
      >
        {error}
      </div>
    );
  }

  return (
    <BlueprintFrame className="bp-grid my-8 bg-neutral-50 dark:bg-neutral-950">
      <div aria-label="Diagrama" className="mermaid-diagram" ref={containerRef} role="img" />
    </BlueprintFrame>
  );
}
