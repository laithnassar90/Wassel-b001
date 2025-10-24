import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { PageLoader } from '../components/PageLoader';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('../pages/LandingPage'));
const AuthPage = lazy(() => import('../pages/AuthPage'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const FindRide = lazy(() => import('../pages/FindRide'));
const OfferRide = lazy(() => import('../pages/OfferRide'));
const MyTrips = lazy(() => import('../pages/MyTrips'));
const Messages = lazy(() => import('../pages/Messages'));
const Payments = lazy(() => import('../pages/Payments'));
const Settings = lazy(() => import('../pages/Settings'));
const Profile = lazy(() => import('../pages/Profile'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Route wrapper components - these render AFTER RouterProvider is mounted
function LandingPageRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <LandingPage />
      </Suspense>
    </ErrorBoundary>
  );
}

function LoginRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <AuthPage mode="login" />
      </Suspense>
    </ErrorBoundary>
  );
}

function SignupRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <AuthPage mode="signup" />
      </Suspense>
    </ErrorBoundary>
  );
}

function AuthRedirect() {
  return <Navigate to="/auth/login" replace />;
}

function AppRedirect() {
  return <Navigate to="/app/dashboard" replace />;
}

function ProtectedAppLayout() {
  return (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  );
}

function DashboardRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}

function FindRideRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <FindRide />
      </Suspense>
    </ErrorBoundary>
  );
}

function OfferRideRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <OfferRide />
      </Suspense>
    </ErrorBoundary>
  );
}

function MyTripsRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <MyTrips />
      </Suspense>
    </ErrorBoundary>
  );
}

function MessagesRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Messages />
      </Suspense>
    </ErrorBoundary>
  );
}

function PaymentsRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Payments />
      </Suspense>
    </ErrorBoundary>
  );
}

function SettingsRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Settings />
      </Suspense>
    </ErrorBoundary>
  );
}

function ProfileRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Profile />
      </Suspense>
    </ErrorBoundary>
  );
}

function NotFoundRoute() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <NotFound />
      </Suspense>
    </ErrorBoundary>
  );
}

// Public routes
const publicRoutes: RouteObject[] = [
  {
    path: '/',
    Component: LandingPageRoute,
  },
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: LoginRoute,
      },
      {
        path: 'signup',
        Component: SignupRoute,
      },
      {
        path: '',
        Component: AuthRedirect,
      },
    ],
  },
];

// Protected routes (require authentication)
const protectedRoutes: RouteObject[] = [
  {
    path: '/app',
    Component: ProtectedAppLayout,
    children: [
      {
        path: 'dashboard',
        Component: DashboardRoute,
      },
      {
        path: 'find-ride',
        Component: FindRideRoute,
      },
      {
        path: 'offer-ride',
        Component: OfferRideRoute,
      },
      {
        path: 'trips',
        Component: MyTripsRoute,
      },
      {
        path: 'messages',
        Component: MessagesRoute,
      },
      {
        path: 'payments',
        Component: PaymentsRoute,
      },
      {
        path: 'settings',
        Component: SettingsRoute,
      },
      {
        path: 'profile/:userId?',
        Component: ProfileRoute,
      },
      {
        path: '',
        Component: AppRedirect,
      },
    ],
  },
];

// Error routes
const errorRoutes: RouteObject[] = [
  {
    path: '*',
    Component: NotFoundRoute,
  },
];

// Combine all routes
export const router = createBrowserRouter(
  [
    ...publicRoutes,
    ...protectedRoutes,
    ...errorRoutes,
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

// Export route paths from the separate routes file to avoid circular dependencies
export { routes } from './routes';
