import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui'
import {
    BookOpen,
    Users,
    Zap,
    Award,
    ArrowRight,
    Globe,
    Check,
} from 'lucide-react'
import { useAuth } from '@/features/auth'

export const LandingPage = () => {
    const { isAuthenticated } = useAuth()

    return (
        <div style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-primary min-h-screen flex items-center justify-center">
                <div
                    className="absolute inset-0 justify-items-center"
                    style={{
                        backgroundImage: `
                            repeating-linear-gradient(
                                90deg,
                                var(--grid-overlay-color),
                                var(--grid-overlay-color) 1px,
                                transparent 1px,
                                transparent 20px
                            ),
                            repeating-linear-gradient(
                                0deg,
                                var(--grid-overlay-color),
                                var(--grid-overlay-color) 1px,
                                transparent 1px,
                                transparent 20px
                            )`,
                        backgroundSize: '20px 20px',
                    }}
                />
                <div className="relative container text-center py-24 justify-items-center">
                    <div className="max-w-4xl w-full mx-auto animate-on-scroll justify-items-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                            <Globe className="w-5 h-5 text-white" />
                            <span className="text-sm font-medium text-white">
                                Добро пожаловать в платформу обучения
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            Изучайте шведский язык онлайн
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Полнофункциональная платформа для обучения шведскому
                            языку с опытными преподавателями. Учитесь в любое
                            время, в любом месте!
                        </p>

                        {!isAuthenticated && (
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/auth/login"
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="w-full sm:w-auto gap-2 bg-white/10 backdrop-blur text-white border-white/30 hover:bg-white/20"
                                    >
                                        <span>Вход в систему</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link
                                    to="/auth/register"
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full sm:w-auto gap-2 border-0 shadow-xl"
                                        style={{
                                            backgroundColor: 'white',
                                            color: 'var(--color-primary-700)',
                                        }}
                                    >
                                        <span>Начать обучение</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                        {isAuthenticated && (
                            <Link to="/dashboard" className="inline-block">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="gap-2 border-0 shadow-xl"
                                    style={{
                                        backgroundColor: 'white',
                                        color: 'var(--color-primary-700)',
                                    }}
                                >
                                    <span>Перейти в кабинет</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 gap-20" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
                <div className="container animate-on-scroll justify-items-center">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <br />
                        <br />
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                            Почему выбирают нас
                        </h2>
                        <br />
                        <p className="text-lg sm:text-xl text-foreground/70">
                            Наши уникальные преимущества помогают студентам
                            достичь результатов
                        </p>
                        <br />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {[
                            {
                                icon: BookOpen,
                                title: 'Качественные материалы',
                                description:
                                    'Разработанные профессионалами учебные материалы',
                            },
                            {
                                icon: Users,
                                title: 'Опытные преподаватели',
                                description:
                                    'Сертифицированные преподаватели шведского языка',
                            },
                            {
                                icon: Zap,
                                title: 'Гибкое обучение',
                                description:
                                    'Учитесь в удобное для вас время и темпе',
                            },
                            {
                                icon: Award,
                                title: 'Сертификаты',
                                description:
                                    'Получайте признанные сертификаты после курсов',
                            },
                        ].map((feature, index) => {
                            const Icon = feature.icon
                            return (
                                <div
                                    key={index}
                                    className="group p-8 rounded-2xl border hover:border-primary-300 hover:shadow-xl transition-all duration-300"
                                    style={{backgroundColor: 'var(--bg-primary)', borderColor: 'var(--color-border)', color: 'var(--text-primary)'}}
                                >
                                    <div className="w-16 h-16 rounded-xl bg-linear-to-br from-primary-500 to-accent-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-base text-foreground/70 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-16" style={{backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)'}}>
                <div className="container animate-on-scroll justify-items-center">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <br />
                        <br />
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                            Наши курсы
                        </h2>
                        <br />
                        <p className="text-lg sm:text-xl text-foreground/70">
                            Мы предлагаем курсы для всех уровней подготовки - от
                            полных начинающих до продвинутых студентов
                        </p>
                        <br />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                        {[
                            {
                                title: 'Шведский для начинающих',
                                level: 'Начальный',
                                duration: '40 часов',
                                price: '5000 ₽',
                                gradient: 'from-green-400 to-blue-500',
                                features: [
                                    'Алфавит и произношение',
                                    'Базовая грамматика',
                                    'Повседневная лексика',
                                ],
                            },
                            {
                                title: 'Разговорный шведский',
                                level: 'Средний',
                                duration: '30 часов',
                                price: '7000 ₽',
                                gradient: 'from-purple-400 to-pink-500',
                                featured: true,
                                features: [
                                    'Разговорная практика',
                                    'Аудирование',
                                    'Расширенная лексика',
                                ],
                            },
                            {
                                title: 'Продвинутый шведский',
                                level: 'Продвинутый',
                                duration: '35 часов',
                                price: '9000 ₽',
                                gradient: 'from-orange-400 to-red-500',
                                features: [
                                    'Сложная грамматика',
                                    'Бизнес-шведский',
                                    'Литературный язык',
                                ],
                            },
                        ].map((course, index) => (
                            <div
                                key={index}
                                className={`group rounded-2xl overflow-hidden border-2 hover:shadow-2xl transition-all duration-300 ${
                                    course.featured
                                        ? 'border-primary-500 shadow-lg lg:-translate-y-2'
                                        : 'border-border hover:border-primary-300'
                                }`}
                                style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}
                            >
                                <div
                                    className={`bg-linear-to-br ${course.gradient} h-40 relative`}
                                >
                                    {course.featured && (
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 rounded-full text-sm font-semibold shadow-lg" style={{backgroundColor: 'rgba(255, 255, 255, 0.95)', color: 'var(--color-primary-700)'}}>
                                                Популярный
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-8" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
                                    <h3 className="text-2xl font-bold mb-4" style={{color: 'var(--text-primary)'}}>
                                        {course.title}
                                    </h3>
                                    <div className="space-y-2 mb-6 pb-6 border-b border-border">
                                        <div className="flex items-center gap-2 text-base text-foreground/70">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                                            <span>
                                                <strong>Уровень:</strong>{' '}
                                                {course.level}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-base text-foreground/70">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                                            <span>
                                                <strong>Длительность:</strong>{' '}
                                                {course.duration}
                                            </span>
                                        </div>
                                    </div>

                                    {course.features && (
                                        <div className="mb-6 space-y-2">
                                            {course.features.map(
                                                (feature, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-start gap-2"
                                                    >
                                                        <Check className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                                        <span className="text-sm text-foreground/70">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                    <p className="text-4xl font-bold text-primary-700 mb-6">
                                        {course.price}
                                    </p>
                                    {isAuthenticated ? (
                                        <Button
                                            variant={
                                                course.featured
                                                    ? 'primary'
                                                    : 'outline'
                                            }
                                            className="w-full py-3"
                                        >
                                            Записаться на курс
                                        </Button>
                                    ) : (
                                        <Link
                                            to="/auth/register"
                                            className="block"
                                        >
                                            <Button
                                                variant={
                                                    course.featured
                                                        ? 'primary'
                                                        : 'outline'
                                                }
                                                className="w-full py-3"
                                            >
                                                Записаться на курс
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            {!isAuthenticated && (
                <section
                    className="py-16 relative overflow-hidden"
                    style={{
                        backgroundImage:
                            'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 50%, var(--color-secondary-500) 100%)',
                    }}
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `
                                repeating-linear-gradient(
                                    90deg,
                                    var(--grid-overlay-color),
                                    var(--grid-overlay-color) 1px,
                                    transparent 1px,
                                    transparent 20px
                                ),
                                repeating-linear-gradient(
                                    0deg,
                                    var(--grid-overlay-color),
                                    var(--grid-overlay-color) 1px,
                                    transparent 1px,
                                    transparent 20px
                                )`,
                            backgroundSize: '20px 20px',
                        }}
                    />
                    <div className="relative container animate-on-scroll space-y-12 justify-items-center">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                Готовы начать обучение?
                            </h2>
                            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-12 leading-relaxed">
                                Присоединяйтесь к тысячам студентов, которые уже
                                изучают шведский язык и достигают своих целей
                            </p>
                            <Link to="/auth/register" className="inline-block">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="gap-2 border-0 shadow-xl"
                                    style={{
                                        backgroundColor: 'white',
                                        color: 'var(--color-primary-700)',
                                    }}
                                >
                                    <span>Создать аккаунт сейчас</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}
        </div>
    )
}
