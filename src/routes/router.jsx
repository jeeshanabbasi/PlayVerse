import { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { MainLayout } from '@components/layout';
import { Loading } from '@components/common';

const HomePage = lazy(() => import('@pages/Home'));
const GamesPage = lazy(() => import('@pages/Games'));
const GameDetailsPage = lazy(() => import('@pages/GameDetails'));
const PlayPage = lazy(() => import('@pages/Play'));
const NotFoundPage = lazy(() => import('@pages/NotFound'));

function RouteFallback() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Loading size="lg" label="Loading" />
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  );
}

function GamesSlugRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/game/${slug}`} replace />;
}

export const router = createBrowserRouter([
  {
    path: 'play/:slug',
    element: withSuspense(PlayPage),
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'games',
        element: withSuspense(GamesPage),
      },
      {
        path: 'game/:slug',
        element: withSuspense(GameDetailsPage),
      },
      {
        path: 'games/:slug',
        element: <GamesSlugRedirect />,
      },
      {
        path: '*',
        element: withSuspense(NotFoundPage),
      },
    ],
  },
]);
