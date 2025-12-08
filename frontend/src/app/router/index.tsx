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

// Pages - Courses
import { CourseCatalogPage } from '@/pages/courses/catalog';
import { CourseDetailsPage } from '@/pages/courses/details';
import LessonsPage from '@/pages/courses/lessons';
import LessonDetailPage from '@/pages/courses/lessons/detail';

// Pages - Student Dashboard
import { StudentDashboardPage } from '@/pages/student-dashboard';

// Pages - Combined Teacher/Admin Courses
import { DashboardCoursesPage } from '@/pages/DashboardCoursesPage';

// Pages - Admin Panel
import { AdminPanelPage } from '@/pages/admin-panel';

// Pages - Import/Export
import { ImportExportPage } from '@/pages/import-export';

// Generic Error Page
import { ErrorPage } from '@/pages/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  {
    path: '/courses',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
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
      {
        path: ':courseId/lessons',
        element: (
          <ProtectedRoute requiredRoles={['Student']}>
            <LessonsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ':courseId/lessons/:lessonId',
        element: (
          <ProtectedRoute requiredRoles={['Student']}>
            <LessonDetailPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/import-export',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
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
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'my-courses',
        element: (
          <ProtectedRoute requiredRoles={['Student']}>
            <StudentDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
  path: '/dashboard/courses',
  element: (
    <ProtectedRoute requiredRoles={['Teacher', 'Admin']}>
      <DashboardCoursesPage />
    </ProtectedRoute>
  ),
},
      {
        path: 'admin',
        element: (
          <ProtectedRoute requiredRoles={['Admin']}>
            <AdminPanelPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
]);
