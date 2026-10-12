import type { MouseEvent } from 'react';

import { copyWithToast } from '@/lib/ui/clipboard';
import { pageUrl } from '@/lib/ui/reading-links';
import { showToast } from '@/lib/ui/toast';

/**
Delegado de clic para el artículo: al pulsar el "#" de un encabezado copia su enlace
(la navegación al ancla sigue su curso normal). El texto del aviso viaja en el atributo
`data-copied-label` del artículo para no depender de contexto React.
*/
export function copyHeadingLink(event: MouseEvent<HTMLElement>): void {
  const { currentTarget, target } = event;

  if (!(target instanceof Element)) {
    return;
  }

  const anchor = target.closest<HTMLAnchorElement>('a.heading-anchor');
  const label = currentTarget.dataset.copiedLabel;

  if (label === undefined || anchor === null || anchor.hash === '') {
    return;
  }

  void copyWithToast(`${pageUrl(location)}${anchor.hash}`, () => {
    showToast(label);
  });
}
