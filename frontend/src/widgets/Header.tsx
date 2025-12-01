import { Link } from 'react-router-dom'
import { useAuth, useLogout } from '@/features/auth'
import { Button, ThemeSwitcher } from '@/shared/ui'
import { BookOpen, LogOut, User, Menu, X, BookCopy, Download } from 'lucide-react'
import { useState } from 'react'

export const Header = () => {
    const { isAuthenticated, user } = useAuth()
    const logout = useLogout()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 shadow-md" style={{backgroundColor: 'var(--bg-primary)', borderBottomColor: 'var(--color-primary-400)', borderBottomWidth: '2px'}}>
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 sm:gap-3 font-bold text-xl sm:text-2xl hover:scale-105 transition-transform"
                    >
                        <div className="rounded-lg p-1.5 sm:p-2 shadow-lg" style={{backgroundImage: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)'}}>
                            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <span className="hidden sm:inline font-black" style={{backgroundImage: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>School Swedish</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4 lg:gap-6">
                        <ThemeSwitcher />
                        {isAuthenticated ? (
                            <>
                                <Link to="/courses">
                                    <Button variant="ghost" className="text-foreground font-bold hover:text-primary-600">
                                        Курсы
                                    </Button>
                                </Link>

                                <Link to="/dashboard">
                                    <Button variant="ghost" className="text-foreground font-bold hover:text-primary-600">
                                        Кабинет
                                    </Button>
                                </Link>

                                <div className="flex items-center gap-3 lg:gap-4 px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl border border-primary-200">
                                    <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                                        {user?.firstName?.[0]}
                                        {user?.lastName?.[0]}
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className="font-bold text-foreground text-sm">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{user?.role}</p>
                                    </div>
                                </div>

                                <Button
                                    variant="destructive"
                                    onClick={logout}
                                    className="gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="hidden lg:inline">Выход</span>
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 lg:gap-4">
                                <Link to="/auth/login">
                                    <Button variant="ghost" className="text-foreground font-bold hover:text-primary-600">
                                        Вход
                                    </Button>
                                </Link>
                                <Link to="/auth/register">
                                    <Button variant="primary" className="gap-2">
                                        <User className="w-4 h-4" />
                                        <span>Регистрация</span>
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-primary-100 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6 text-primary-500" />
                        ) : (
                            <Menu className="w-6 h-6 text-primary-500" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t-2 border-primary-200 py-4 space-y-4 bg-gradient-to-b from-primary-50 to-background">
                        <div className="px-4 flex items-center justify-between">
                            <span className="text-sm font-semibold text-foreground">Тема</span>
                            <ThemeSwitcher />
                        </div>

                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl border border-primary-200">
                                    <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                                        {user?.firstName?.[0]}
                                        {user?.lastName?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{user?.role}</p>
                                    </div>
                                </div>

                                <Link
                                    to="/courses"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block"
                                >
                                    <Button variant="ghost" className="w-full text-foreground font-bold justify-start hover:bg-primary-50 gap-2">
                                        <BookCopy className="w-4 h-4" />
                                        Курсы
                                    </Button>
                                </Link>

                                <Link
                                    to="/dashboard"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block"
                                >
                                    <Button variant="ghost" className="w-full text-foreground font-bold justify-start hover:bg-primary-50">
                                        Кабинет
                                    </Button>
                                </Link>

                                {user?.role === 'Admin' && (
                                    <Link
                                        to="/import-export"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block"
                                    >
                                        <Button variant="ghost" className="w-full text-foreground font-bold justify-start hover:bg-primary-50 gap-2">
                                            <Download className="w-4 h-4" />
                                            Импорт/Экспорт
                                        </Button>
                                    </Link>
                                )}

                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        logout()
                                        setMobileMenuOpen(false)
                                    }}
                                    className="w-full gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Выход</span>
                                </Button>
                            </>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    to="/auth/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block"
                                >
                                    <Button variant="ghost" className="w-full text-foreground font-bold justify-start hover:bg-primary-50">
                                        Вход
                                    </Button>
                                </Link>
                                <Link
                                    to="/auth/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block"
                                >
                                    <Button variant="primary" className="w-full gap-2">
                                        <User className="w-4 h-4" />
                                        <span>Регистрация</span>
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>
    )
}
