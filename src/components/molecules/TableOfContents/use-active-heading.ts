import { useEffect, useState } from 'react';

/**
Observa los encabezados visibles y devuelve el id del que se está leyendo.
*/
export function useActiveHeading(ids: string[], isEnabled: boolean): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isEnabled || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id);
          } else {
            visible.delete(entry.target.id);
          }
        }

        const first = ids.find((id) => visible.has(id));

        if (first !== undefined) {
          setActiveId(first);
        }
      },
      { rootMargin: '-96px 0px -65% 0px' },
    );

    for (const id of ids) {
      const element = document.querySelector(`#${CSS.escape(id)}`);

      if (element !== null) {
        observer.observe(element);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [isEnabled, ids]);

  return activeId;
}
