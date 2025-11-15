import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { AuthLayout } from '@/widgets/AuthLayout';
import { MainLayout } from '@/widgets/MainLayout';
import { DashboardLayout } from '@/widgets/DashboardLayout';

// Pages
import { LandingPage } from '@/pages/landing';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { DashboardPage } from '@/pages/dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // NOTE: Add other dashboard pages here (e.g., my-courses, settings)
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
]);
