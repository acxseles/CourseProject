import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/login/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { CoursesCatalogPage } from './pages/courses/CoursesCatalogPage';
import { useAuthStore } from './features/auth/model/authStore';
import { CourseFormPage } from './pages/admin/CourseFormPage';
import { useEffect } from 'react';
import { MyCoursesPage } from './pages/student/MyCoursesPage';
import { CourseLessonsPage } from './pages/courses/CourseLessonsPage';
import { Layout } from './shared/ui/Layout';
import { LessonPage } from './pages/courses/LessonPage';
import { TestPage } from './pages/courses/TestPage';
import { UsersManagementPage } from './pages/admin/UsersManagementPage';
import { LessonFormPage } from './pages/courses/LessonFormPage';
import { ManageTestsPage } from './pages/admin/ManageTestsPage';
import { ImportExportPage } from './pages/admin/ImportExportPage';
import { CourseStudentsPage } from './pages/courses/CourseStudentsPage';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};


function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

 if (isCheckingAuth) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка...</div>;
  }

  return (
    <>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/courses" element={
            <Layout>
              <CoursesCatalogPage />
            </Layout>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/my-courses" element={
            <PrivateRoute>
              <Layout>
                <MyCoursesPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/new" element={
            <PrivateRoute>
              <Layout>
                <CourseFormPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/edit/:id" element={
            <PrivateRoute>
              <Layout>
                <CourseFormPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/:courseId/lessons" element={
            <PrivateRoute>
              <Layout>
                <CourseLessonsPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/:courseId/lesson/:lessonId" element={
            <PrivateRoute>
              <Layout>
                <LessonPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/:courseId/lesson/:lessonId/test" element={
            <PrivateRoute>
              <Layout>
                <TestPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/:courseId/lesson/:lessonId/manage-test" element={
            <PrivateRoute>
              <Layout>
                <ManageTestsPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/:courseId/lesson/new" element={
            <PrivateRoute>
              <Layout>
                <LessonFormPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/:courseId/lesson/:lessonId/edit" element={
            <PrivateRoute>
              <Layout>
                <LessonFormPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/users" element={
            <PrivateRoute>
              <Layout>
                <UsersManagementPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/import-export" element={
            <PrivateRoute>
              <Layout>
                <ImportExportPage />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/course/:courseId/students" element={
  <PrivateRoute>
    <Layout>
      <CourseStudentsPage />
    </Layout>
  </PrivateRoute>
} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;