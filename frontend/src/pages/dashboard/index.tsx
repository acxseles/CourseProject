import { useAuth } from '@/features/auth'
import { getInitials } from '@/shared/lib'
import { User, Mail, Shield } from 'lucide-react'

export const DashboardPage = () => {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-blue-50 p-6 sm:p-12">
            {/* Welcome Header */}
            <div className="mb-8 text-center sm:text-left max-w-6xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                    Добро пожаловать,{' '}
                    <span className="text-primary-600">{user?.firstName}</span>!
                </h1>
                <p className="text-lg text-gray-700">
                    Ваше путешествие по изучению шведского языка начинается здесь.
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Left Column: User Profile */}
                <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8">
                    <div className="flex items-center gap-4 mb-6 sm:mb-8">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary-500 flex items-center justify-center">
                            <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Информация профиля
                        </h2>
                    </div>

                    <div className="space-y-6 sm:space-y-8">
                        {/* Full Name */}
                        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-500 mb-1">
                                    Полное имя
                                </p>
                                <p className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                                    {user?.firstName} {user?.lastName}
                                </p>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-500 mb-1">
                                    Email адрес
                                </p>
                                <p className="text-lg sm:text-xl font-semibold text-gray-900 break-all">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-xl">
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-500 mb-2">
                                    Роль в системе
                                </p>
                                <span className="inline-block px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base bg-purple-100 text-purple-700">
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

               

                    
                </div>
            </div>
      
    )
}
