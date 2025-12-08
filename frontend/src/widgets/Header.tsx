import { Link } from 'react-router-dom';
import { useAuth, useLogout } from '@/features/auth';
import { LogOut, User, Menu, X, BookCopy, Download } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const logout = useLogout();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white border-b border-primary-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 font-bold text-xl sm:text-2xl hover:scale-105 transition-transform"
          >
            <span className="text-blue-700 font-black">Школа шведского языка</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {isAuthenticated ? (
              <>
                {/* Кабинет */}
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-lg hover:bg-blue-50 transition font-semibold text-blue-600"
                >
                  Кабинет
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3 lg:gap-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl border border-blue-200">
                  <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="font-bold text-gray-800 text-sm">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-600">{user?.role}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-blue-50 text-blue-600 font-semibold transition"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  Выход
                </button>
              </>
            ) : (
              // Неавторизованные пользователи
              <div className="flex items-center gap-3 lg:gap-4">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 rounded-lg hover:bg-blue-50 font-semibold text-gray-800"
                >
                  Вход
                </Link>

                <Link
                  to="/auth/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-blue-50 text-blue-600 font-semibold"
                >
                  <User className="w-4 h-4" />
                  Регистрация
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-blue-50 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6 text-blue-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-200 py-4 space-y-4 bg-blue-50">
            {isAuthenticated ? (
              <>
                {/* Кабинет */}
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg hover:bg-blue-100 font-semibold text-blue-600 flex items-center gap-2"
                >
                  <BookCopy className="w-4 h-4" />
                  Кабинет
                </Link>

                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-xl border border-blue-200">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-gray-600">{user?.role}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-blue-50 text-blue-600 font-semibold transition"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  Выход
                </button>
              </>
            ) : (
              // Мобильное меню для неавторизованных
              <div className="space-y-3 px-4">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg hover:bg-blue-100 font-semibold text-gray-800"
                >
                  Вход
                </Link>

                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white hover:bg-blue-50 text-blue-600 font-semibold"
                >
                  <User className="w-4 h-4" />
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};
