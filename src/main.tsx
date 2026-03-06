import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './app/context/AuthContext';
import { ErrorProvider } from './app/context/ErrorContext';
import { ErrorModal } from './app/components/ui/ErrorModal';
import App from './app/App';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <ErrorModal />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorProvider>
  </StrictMode>
);