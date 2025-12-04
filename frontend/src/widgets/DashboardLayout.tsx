import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, LogOut } from 'lucide-react'
import { useLogout } from '@/features/auth'
import { Button } from '@/shared/ui'
import { Sidebar } from './Sidebar'

export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const logout = useLogout()

    return (
        <div
            className="min-h-screen flex"
            style={{ backgroundColor: 'var(--color-neutral-50)' }}
        >
            {/* Desktop Sidebar */}
            <aside
                className="hidden lg:flex lg:flex-col w-[280px]"
                style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderRightColor: 'var(--color-border)',
                    borderRightWidth: '1px',
                }}
            >
                <Sidebar />
            </aside>

            {/* Mobile Sidebar */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/60"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                    <aside
                        className="relative flex flex-col w-[280px] max-w-[calc(100%-3rem)]"
                        style={{ backgroundColor: 'var(--bg-primary)' }}
                    >
                        <button
                            type="button"
                            className="absolute top-4 right-4 p-1 lg:hidden"
                            style={{ color: 'var(--color-neutral-600)' }}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <Sidebar />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Dashboard Header */}
                <header
                    className="sticky top-0 z-30 flex h-16 items-center justify-between px-4 sm:px-6 lg:justify-end"
                    style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderBottomColor: 'var(--color-border)',
                        borderBottomWidth: '1px',
                    }}
                >
                    <button
                        type="button"
                        className="p-2 lg:hidden"
                        style={{ color: 'var(--color-neutral-600)' }}
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-4">
                        <span
                            className="text-sm font-medium"
                            style={{ color: 'var(--color-neutral-600)' }}
                        >
                            Добро пожаловать!
                        </span>
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

                <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">
                    <div className="container mx-auto flex flex-col gap-4 pb-3">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
