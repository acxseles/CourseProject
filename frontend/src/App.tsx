import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { router } from './app/router';
import { useAuthStore } from './features/auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();

    // Initialize theme from localStorage or system preference
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      htmlElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
