import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Layouts
import { AuthLayout } from '@/widgets/AuthLayout';
import { LandingLayout } from '@/widgets/LandingLayout';
import { MainLayout } from '@/widgets/MainLayout';
import { DashboardLayout } from '@/widgets/DashboardLayout';

// Pages - Auth
import { LandingPage } from '@/pages/landing';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';

// Pages - Dashboard & Profile
import { DashboardPage } from '@/pages/dashboard';
import { SettingsPage } from '@/pages/settings';

// Pages - Courses
import { CourseCatalogPage } from '@/pages/courses/catalog';
import { CourseDetailsPage } from '@/pages/courses/details';

// Pages - Student Dashboard
import { StudentDashboardPage } from '@/pages/student-dashboard';

// Pages - Teacher Dashboard
import { TeacherDashboardPage } from '@/pages/teacher-dashboard';

// Pages - Admin Panel
import { AdminPanelPage } from '@/pages/admin-panel';

// Pages - Import/Export
import { ImportExportPage } from '@/pages/import-export';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
    ],
  },
  {
    path: '/courses',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute requiredRoles={['Student', 'Admin']}>
            <CourseCatalogPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ':id',
        element: (
          <ProtectedRoute requiredRoles={['Student']}>
            <CourseDetailsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/import-export',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <ImportExportPage />
          </ProtectedRoute>
        ),
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
      {
        path: 'my-courses',
        element: (
          <ProtectedRoute requiredRoles={['Student']}>
            <StudentDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'teacher',
        element: <TeacherDashboardPage />,
      },
      {
        path: 'admin',
        element: <AdminPanelPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
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