import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, ToastProvider } from '@context/index';
import { ToastContainer, ErrorBoundary } from '@components/common';
import { router } from '@routes/index';

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
