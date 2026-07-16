import { Outlet } from 'react-router-dom';
import { Header } from '@components/layout/Header';
import { Footer } from '@components/layout/Footer';

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-dvh">
      <a
        href="#main-content"
        className="sr-only-focusable fixed top-4 left-4 z-[600] px-4 py-2 bg-primary text-white rounded-xl"
      >
        Skip to content
      </a>

      <Header />

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
