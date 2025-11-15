import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, Users, Zap } from 'lucide-react'

export const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row" style={{backgroundColor: 'var(--bg-primary)'}}>
            {/* Left Side - Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 p-8 relative overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)'}}>
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                <div className="relative z-10 flex flex-col justify-between w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                            <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-2xl font-bold">School Swedish</span>
                    </Link>

                    {/* Center Content */}
                    <div className="my-auto">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            Начните свой путь к знанию шведского языка
                        </h2>
                        <p className="text-xl text-white/90 mb-12 leading-relaxed">
                            Присоединяйтесь к платформе обучения с профессиональными
                            преподавателями и современными материалами
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            {[
                                {
                                    icon: CheckCircle2,
                                    text: 'Интерактивные уроки и задания',
                                },
                                {
                                    icon: Users,
                                    text: 'Опытные сертифицированные преподаватели',
                                },
                                {
                                    icon: Zap,
                                    text: 'Гибкий график обучения',
                                },
                            ].map((feature, index) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 text-white"
                                    >
                                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-lg text-white">
                                            {feature.text}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-white/80 text-sm">
                        © 2024 School Swedish. Все права защищены.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen" style={{backgroundColor: 'var(--bg-primary)'}}>
                {/* Mobile Logo */}
                <Link to="/" className="lg:hidden mb-8 flex items-center gap-2">
                    <div className="bg-gradient-primary rounded-lg p-2">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-foreground">School Swedish</span>
                </Link>

                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
