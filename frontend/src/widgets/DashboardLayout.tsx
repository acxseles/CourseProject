import { Outlet, Link } from 'react-router-dom'
import { useState } from 'react'
import { BookOpen, Menu, X, LayoutDashboard, BookCopy, Settings, LogOut } from 'lucide-react'
import { useLogout, useAuth } from '@/features/auth'
import { Button } from '@/shared/ui'
import { Footer } from './Footer'

const SidebarContent = () => {
    const { user } = useAuth()
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
                    className="flex items-center gap-3 px-4 py-3 rounded-lg font-semibold"
                    style={{backgroundColor: 'var(--color-primary-100)', color: 'var(--color-primary-700)'}}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Главная</span>
                </Link>
                <Link
                    to="/my-courses"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-neutral-100)]"
                    style={{color: 'var(--color-neutral-600)'}}
                >
                    <BookCopy className="w-5 h-5" />
                    <span>Мои курсы</span>
                </Link>
                <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-[var(--color-neutral-100)]"
                    style={{color: 'var(--color-neutral-600)'}}
                >
                    <Settings className="w-5 h-5" />
                    <span>Настройки</span>
                </Link>
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


export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const logout = useLogout()

    return (
        <div className="min-h-screen flex" style={{backgroundColor: 'var(--color-neutral-50)'}}>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-[280px]" style={{backgroundColor: 'var(--bg-primary)', borderRightColor: 'var(--color-border)', borderRightWidth: '1px'}}>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
                    <aside className="relative flex flex-col w-[280px] max-w-[calc(100%-3rem)]" style={{backgroundColor: 'var(--bg-primary)'}}>
                        <button
                            type="button"
                            className="absolute top-4 right-4 p-1 lg:hidden"
                            style={{color: 'var(--color-neutral-600)'}}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Dashboard Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 sm:px-6 lg:justify-end" style={{backgroundColor: 'var(--bg-primary)', borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px'}}>
                    <button
                        type="button"
                        className="p-2 lg:hidden"
                        style={{color: 'var(--color-neutral-600)'}}
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium" style={{color: 'var(--color-neutral-600)'}}>Добро пожаловать!</span>
                        <Button
                            variant="danger"
                            onClick={logout}
                            className="gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Выход</span>
                        </Button>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="container mx-auto max-w-none">
                        <Outlet />
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    )
}
