import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookCopy, Users, Download } from 'lucide-react';
import { useAuth } from '@/features/auth';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const linkClasses = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
      isActive(path)
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="flex flex-col h-full">
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <Link to="/dashboard" className={linkClasses('/dashboard')}>
          <LayoutDashboard className="w-5 h-5" />
          <span>Главная</span>
        </Link>

        {/* Студент */}
        {user?.role === 'Student' && (
          <>
            <Link to="/courses" className={linkClasses('/courses')}>
              <BookCopy className="w-5 h-5" />
              <span>Каталог курсов</span>
            </Link>
            <Link to="/dashboard/my-courses" className={linkClasses('/dashboard/my-courses')}>
              <BookCopy className="w-5 h-5" />
              <span>Мои курсы</span>
            </Link>
          </>
        )}

        {/* Учитель и Админ — одна страница управления курсами */}
        {(user?.role === 'Teacher' || user?.role === 'Admin') && (
          <Link to="/dashboard/courses" className={linkClasses('/dashboard/courses')}>
            <BookCopy className="w-5 h-5" />
            <span>Управление курсами</span>
          </Link>
        )}

        {/* Админ — дополнительные страницы */}
        {user?.role === 'Admin' && (
          <>
            <Link to="/dashboard/admin" className={linkClasses('/dashboard/admin')}>
              <Users className="w-5 h-5" />
              <span>Управление пользователями</span>
            </Link>
            <Link to="/import-export" className={linkClasses('/import-export')}>
              <Download className="w-5 h-5" />
              <span>Импорт/Экспорт</span>
            </Link>
          </>
        )}
      </nav>

      {/* User Info */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-blue-500 via-purple-400 to-pink-500">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-semibold text-sm text-gray-900">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-600">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
