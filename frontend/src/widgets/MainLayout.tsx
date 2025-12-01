import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'

export const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen flex bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-[280px]" style={{backgroundColor: 'var(--bg-primary)', borderRightColor: 'var(--color-border)', borderRightWidth: '1px'}}>
                <Sidebar />
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
                        <Sidebar />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header with Mobile Menu */}
                <div className="flex items-center justify-between lg:hidden px-4 h-16" style={{backgroundColor: 'var(--bg-primary)', borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px'}}>
                    <button
                        type="button"
                        className="p-2"
                        style={{color: 'var(--color-neutral-600)'}}
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <Header />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}
