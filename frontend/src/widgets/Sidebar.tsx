import { Link, useLocation } from 'react-router-dom'
import { BookOpen, LayoutDashboard, BookCopy, Settings, Users, Download } from 'lucide-react'
import { useAuth } from '@/features/auth'

export const Sidebar = () => {
    const { user } = useAuth()
    const location = useLocation()

    const isActive = (path: string) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true
        return false
    }

    return (
        <>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 px-6 pt-6 pb-8">
                <div className="rounded-lg p-2" style={{backgroundImage: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)'}}>
                    <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold" style={{color: 'var(--color-neutral-900)'}}>School Swedish</span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors"
                    style={isActive('/dashboard') ? {backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)'} : {color: 'var(--color-neutral-600)'}}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Главная</span>
                </Link>
                {user?.role === 'Student' && (
                    <Link
                        to="/courses"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-neutral-100)]"
                        style={isActive('/courses') ? {backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)'} : {color: 'var(--color-neutral-600)'}}
                    >
                        <BookOpen className="w-5 h-5" />
                        <span>Каталог курсов</span>
                    </Link>
                )}
                {user?.role === 'Student' && (
                    <Link
                        to="/dashboard/my-courses"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-neutral-100)]"
                        style={isActive('/dashboard/my-courses') ? {backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)'} : {color: 'var(--color-neutral-600)'}}
                    >
                        <BookCopy className="w-5 h-5" />
                        <span>Мои курсы</span>
                    </Link>
                )}
                <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-neutral-100)]"
                    style={isActive('/dashboard/settings') ? {backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)'} : {color: 'var(--color-neutral-600)'}}
                >
                    <Settings className="w-5 h-5" />
                    <span>Настройки</span>
                </Link>

                {/* Role-based menu items */}
                {user?.role === 'Teacher' && (
                    <Link
                        to="/dashboard/teacher"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-neutral-100)]"
                        style={isActive('/dashboard/teacher') ? {backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)'} : {color: 'var(--color-neutral-600)'}}
                    >
                        <BookCopy className="w-5 h-5" />
                        <span>Управление курсами</span>
                    </Link>
                )}

                {user?.role === 'Admin' && (
                    <>
                        <Link
                            to="/dashboard/admin"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-neutral-100)]"
                            style={isActive('/dashboard/admin') ? {backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)'} : {color: 'var(--color-neutral-600)'}}
                        >
                            <Users className="w-5 h-5" />
                            <span>Управление пользователями</span>
                        </Link>
                        <Link
                            to="/import-export"
                            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-neutral-100)]"
                            style={isActive('/import-export') ? {backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)'} : {color: 'var(--color-neutral-600)'}}
                        >
                            <Download className="w-5 h-5" />
                            <span>Импорт/Экспорт</span>
                        </Link>
                    </>
                )}
            </nav>

            {/* User Info & Logout */}
            <div className="px-4 py-4 border-t" style={{borderColor: 'var(--color-neutral-200)'}}>
                 <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{backgroundColor: 'var(--color-neutral-100)'}}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{backgroundImage: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)'}}>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                    </div>
                    <div>
                        <p className="font-semibold text-sm" style={{color: 'var(--color-neutral-900)'}}>
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs" style={{color: 'var(--color-neutral-600)'}}>{user?.role}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
