import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppProviders } from '@/app/providers/AppProviders';
import { router } from '@/app/router';
import '@/styles/index.css';

// El postbuild inyecta SEO estático (data-prerender) para crawlers; el router gestiona el <head>.
for (const element of document.head.querySelectorAll('[data-prerender]')) {
  element.remove();
}

const rootElement = document.querySelector('#root');

if (!rootElement) {
  throw new Error('No se encontró el elemento #root');
}

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
