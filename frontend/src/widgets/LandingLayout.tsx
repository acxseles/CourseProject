import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export const LandingLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}
