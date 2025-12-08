import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { CheckCircle2, Users, Zap } from 'lucide-react'

export const AuthLayout = () => {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Branding (Hidden on mobile) */}
            <div
                className="hidden lg:flex lg:w-1/2 p-8 relative overflow-hidden"
                style={{ backgroundColor: '#3B82F6' }} // Синий фон вместо градиента
            >
                <div className="relative z-10 flex flex-col justify-between w-full">
                    {/* Logo */}
                    <Link
  to="/"
  className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity"
>
  <span className="text-2xl text-white font-bold">Школа шведского языка</span>
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
                                        <span className="text-lg text-white">{feature.text}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div
                className="flex-1 lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen"
                style={{ backgroundColor: '#3B82F6' }} // Синий фон
            >
                {/* Mobile Logo */}
                <Link to="/" className="lg:hidden mb-8 flex items-center gap-2">
                    <span className="text-xl font-bold text-white">
                        Школа шведского языка
                    </span>
                </Link>

                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
