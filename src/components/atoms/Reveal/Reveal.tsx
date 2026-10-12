import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

import { cn } from '@/lib/utils/cn';

type RevealProps = Readonly<{
  children: ReactNode;
  className?: string;
  /**
  Retraso en ms para escalonar elementos hermanos.
  */
  delay?: number;
}>;

/**
Aparece con un fundido suave cuando entra en el viewport (una sola vez).
*/
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const element = ref.current;

    if (element === null || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.every((entry) => !entry.isIntersecting)) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      className={cn('reveal', className)}
      data-visible={isVisible}
      ref={ref}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
