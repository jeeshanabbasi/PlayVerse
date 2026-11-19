import { RouterProvider } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider, ToastProvider } from '@context/index';
import { ToastContainer, ErrorBoundary } from '@components/common';
import { router } from '@routes/index';

export function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <ToastProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </ToastProvider>
        </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
