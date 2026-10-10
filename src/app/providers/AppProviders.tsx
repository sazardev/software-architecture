import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { lazy, type ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 30 * 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60_000,
    },
  },
});

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(async () => {
      const { ReactQueryDevtools: ReactQueryDevtoolsComponent } =
        await import('@tanstack/react-query-devtools');
      return { default: ReactQueryDevtoolsComponent };
    })
  : null;

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
