import { useAuth } from '@/features/auth'
import { getInitials } from '@/shared/lib'
import { User, Mail, Shield } from 'lucide-react'

export const DashboardPage = () => {
    const { user } = useAuth()

    return (
        <div>
            {/* Welcome Header */}
            <div className="mb-6 lg:mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                    Добро пожаловать,{' '}
                    <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                        {user?.firstName}
                    </span>
                    !
                </h1>
                <p className="text-base sm:text-lg text-foreground/70">
                    Ваше путешествие по изучению шведского языка начинается
                    здесь.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column: User Profile */}
                <div
                    className="lg:col-span-2 rounded-2xl border shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8"
                    style={{
                        backgroundColor: 'var(--bg-primary)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--text-primary)',
                    }}
                >
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
                            <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                            Информация профиля
                        </h2>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {/* Full Name */}
                        <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-primary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground/70 mb-1">
                                    Полное имя
                                </p>
                                <p className="text-lg sm:text-xl font-semibold text-foreground break-words">
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4 p-4 bg-secondary-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-secondary-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground/70 mb-1">
                                    Email адрес
                                </p>
                                <p className="text-lg sm:text-xl font-semibold text-foreground break-all">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-start gap-4 p-4 bg-accent-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-accent-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground/70 mb-2">
                                    Роль в системе
                                </p>
                                <span
                                    className={`inline-block px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base bg-linear-to-r from-primary-100 to-secondary-100 text-foreground`}
                                >
                                    {user?.role === 'Student'
                                        ? 'Студент'
                                        : user?.role === 'Teacher'
                                        ? 'Преподаватель'
                                        : 'Администратор'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Avatar & Courses */}
                <div className="space-y-6 lg:space-y-8">
                    {/* Avatar Card */}
                    <div className="bg-gradient-to-br from-primary-600 via-accent-500 to-secondary-600 text-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-8">
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 border-4 border-white/30">
                                <span className="text-4xl font-bold text-white">
                                    {getInitials(
                                        user?.firstName || '',
                                        user?.lastName || ''
                                    )}
                                </span>
                            </div>
                            <p className="text-2xl font-bold text-center mb-2">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-white/90 text-center break-all px-4">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Courses Section */}
                    <div
                        className="rounded-2xl border shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8"
                        style={{
                            backgroundColor: 'var(--bg-primary)',
                            borderColor: 'var(--color-border)',
                            color: 'var(--text-primary)',
                        }}
                    >
                    </div>
                </div>
            </div>
        </div>
    )
}
