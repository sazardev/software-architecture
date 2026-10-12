import type { ReactNode } from 'react';

import { SiteFooter, SiteHeader } from '@/components/organisms';
import { useMessages } from '@/lib/i18n/use-messages';

type SiteShellProps = Readonly<{
  children: ReactNode;
}>;

export function SiteShell({ children }: SiteShellProps) {
  const messages = useMessages();

  return (
    <div className="paper-grain flex min-h-dvh flex-col">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-neutral-900 focus:px-5 focus:py-2 focus:text-sm focus:text-neutral-50"
        href="#contenido"
      >
        {messages.a11y.skipToContent}
      </a>
      <SiteHeader />
      <main className="relative z-10 flex-1" id="contenido">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
