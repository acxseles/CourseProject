import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui'
import { useAuth } from '@/features/auth'

import beginnerImage from './image/Begginer.png'
import intermediateImage from './image/Intermadiate.png'
import advancedImage from './image/Advanced.png'

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="bg-white">
   {/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/30 to-white">
  <div className="absolute inset-0 overflow-hidden">
    {/* Уменьшенные фоны */}
    <div className="absolute top-1/5 left-1/4 w-48 h-48 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl"></div>
    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-yellow-100/30 rounded-full mix-blend-multiply filter blur-3xl"></div>
  </div>

  <div className="container mx-auto px-6 lg:px-8 relative text-center max-w-4xl mt-[-150px]">
    {/* Subtitle */}
    <div className="inline-flex items-center justify-center gap-2 px-6 py-3 mb-8 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 mx-auto">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <span className="text-sm font-medium text-gray-700">
        Добро пожаловать в платформу обучения
      </span>
    </div>

    {/* Main Heading */}
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-4 leading-tight">
      Изучайте шведский <br />
      <span className="text-blue-600">язык онлайн</span>
    </h1>

    {/* Description */}
    <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-loose px-4 sm:px-0">
      Профессиональная платформа для изучения шведского языка с опытными преподавателями. 
      Учитесь в удобном формате.
    </p>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-6">
      {!isAuthenticated ? (
        <>
          <Link to="/auth/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-64 py-6 sm:py-8 text-xl sm:text-2xl font-bold text-gray-700 hover:text-blue-600 border-2 border-gray-300 hover:border-blue-400 rounded-2xl transition-all duration-300 flex justify-center items-center"
            >
              Вход в систему
            </Button>
          </Link>

          <Link to="/auth/register" className="w-full sm:w-auto">
            <Button
              variant="primary"
              className="w-64 py-4 sm:py-6 text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center"
            >
              Начать обучение
            </Button>
          </Link>
        </>
      ) : (
        <Link to="/dashboard" className="inline-block mt-6">
          <Button
            variant="primary"
            className="w-64 py-4 sm:py-6 text-lg sm:text-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center"
          >
            Перейти в кабинет
          </Button>
        </Link>
      )}
    </div>
  </div>
</section>




      {/* Features Section */}
      <section className="py-32 bg-gray-50">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Почему выбирают нас
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 mb-16">
            Современный подход к изучению языка
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: "Качественные материалы", description: "Профессионально разработанные учебные материалы.", color: "bg-blue-50 border-blue-100" },
              { title: "Опытные преподаватели", description: "Сертифицированные носители шведского языка.", color: "bg-yellow-50 border-yellow-100" },
              { title: "Гибкое обучение", description: "Учитесь в удобном темпе в любое время.", color: "bg-green-50 border-green-100" },
              { title: "Сертификаты", description: "Официальные сертификаты после курсов.", color: "bg-purple-50 border-purple-100" },
            ].map((feature, index) => (
              <div key={index} className={`p-8 rounded-xl border ${feature.color} hover:shadow-lg transition-shadow duration-300`}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="bg-gray-50 py-32">
        <div className="container mx-auto text-center px-6 mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Наши курсы
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-16">
            Мы предлагаем курсы для всех уровней подготовки — от начинающих до продвинутых студентов
          </p>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
  {[
    { id: 1, title: "Для начинающих", level: "Начальный", duration: "40 часов", price: "5000 р", image: beginnerImage },
    { id: 2, title: "Разговорный", level: "Средний", duration: "30 часов", price: "7000 р", image: intermediateImage, featured: true },
    { id: 3, title: "Продвинутый", level: "Продвинутый", duration: "35 часов", price: "9000 р", image: advancedImage },
  ].map((course) => (
    <div
      key={course.id}
      className={`group rounded-2xl border-2 flex flex-col transition-all duration-300 overflow-hidden ${
        course.featured ? "border-blue-600 shadow-lg" : "border-gray-200 hover:border-blue-400"
      }`}
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Верх: изображение */}
      <div className="relative w-full h-48">
        <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        {course.featured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
              Популярный
            </span>
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-bold mb-3">{course.title}</h3>
        <div className="space-y-2 mb-4 text-gray-700 text-base">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span><strong>Уровень:</strong> {course.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span><strong>Длительность:</strong> {course.duration}</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-blue-600 mb-4">{course.price}</p>

        {/* Кнопка */}
        <Link
          to={`/courses/${course.id}`}
          className="w-full mt-auto py-4 text-gray-700 bg-white border border-gray-300 hover:border-blue-400 hover:text-blue-600 font-semibold text-lg rounded-xl text-center block"
        >
          {isAuthenticated ? "Перейти к курсу" : "Записаться на курс"}
        </Link>
      </div>
    </div>
  ))}
</div>

        </div>
      </section>
    </div>
  )
}
