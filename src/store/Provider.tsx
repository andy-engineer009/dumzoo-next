'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';
import { useState } from 'react';

// Redux Provider component to wrap the app
export function Provider({ children }: { children: React.ReactNode }) {
  // Create a client instance for React Query
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ReduxProvider store={store}>
        {children}
      </ReduxProvider>
    </QueryClientProvider>
  );
} 