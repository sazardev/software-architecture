import { useEffect, useRef } from 'react';

import { useMessages } from '@/lib/i18n/use-messages';

/**
Barra fina fija en la parte superior con el avance de lectura del documento.
*/
export function ReadingProgress() {
  const messages = useMessages();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const { scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;

      barRef.current?.style.setProperty('--progress', String(progress));
    }

    function schedule() {
      if (frame === 0) {
        frame = requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
      title={messages.a11y.readingProgress}
    >
      <div className="h-full origin-left scale-x-[var(--progress,0)] bg-accent-500" ref={barRef} />
    </div>
  );
}
