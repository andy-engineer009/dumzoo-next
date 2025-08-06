'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store';

// Redux Provider component to wrap the app
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      {children}
    </ReduxProvider>
  );
} 