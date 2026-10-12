import { useState } from 'react';

import { useMessages } from '@/lib/i18n/use-messages';

import { downloadPng, downloadSvg } from './export-diagram';

function fileBaseName(): string {
  const slug = location.pathname.split('/').findLast((part) => part !== '') ?? 'diagram';

  return `${slug}-diagram`;
}

/**
Exportación a PNG/SVG del diagrama que devuelva `getSvg`; expone el estado para la UI.
*/
export function useDiagramExport(getSvg: () => SVGSVGElement | null) {
  const messages = useMessages();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(kind: 'png' | 'svg'): Promise<void> {
    const svg = getSvg();

    if (svg === null) {
      return;
    }

    setIsBusy(true);
    setError(null);

    try {
      if (kind === 'png') {
        await downloadPng(svg, fileBaseName());
      } else {
        downloadSvg(svg, fileBaseName());
      }
    } catch {
      setError(messages.diagram.exportError);
    } finally {
      setIsBusy(false);
    }
  }

  return {
    error,
    exportPng: () => void run('png'),
    exportSvg: () => void run('svg'),
    isBusy,
  };
}
