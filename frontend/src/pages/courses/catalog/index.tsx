import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetCourses } from '@/features/courses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input } from '@/shared/ui';
import { Loader, AlertCircle } from 'lucide-react';

export const CourseCatalogPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const pageSize = 12;

  const { data, isLoading, error } = useGetCourses({
    page,
    pageSize,
    search: search || undefined,
    level: level || undefined,
  });

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div className="min-h-screen bg-blue-50 p-6 sm:p-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Каталог курсов</h1>
        <p className="text-lg text-gray-700">Выберите курс для изучения шведского языка</p>
      </div>

      {/* Filters and Search */}
      <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Поиск по названию</label>
          <Input
            placeholder="Название курса..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Уровень сложности</label>
          <select
            value={level}
            onChange={(e) => {
              setLevel(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 border rounded-md bg-white"
          >
            <option value="">Все уровни</option>
            <option value="Beginner">Начинающий</option>
            <option value="Intermediate">Средний</option>
            <option value="Advanced">Продвинутый</option>
          </select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={() => {
              setSearch('');
              setLevel('');
              setPage(1);
            }}
            variant="outline"
            className="w-full"
          >
            Очистить фильтры
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-8">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-1">Ошибка загрузки</h3>
            <p className="text-sm text-red-800">Не удалось загрузить курсы. Попробуйте позже.</p>
          </div>
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && data?.items && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.items.map((course) => (
              <Link key={course.id} to={`/courses/${course.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer bg-white">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="text-xs mt-2">
                      Преподаватель: {course.teacherName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">{course.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Длительность:</span>
                        <span className="font-semibold">{course.durationHours} часов</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Цена:</span>
                        <span className="font-semibold text-primary-600">${course.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Предыдущая
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  variant={p === page ? 'default' : 'outline'}
                  className="w-10 h-10 p-0"
                >
                  {p}
                </Button>
              ))}
              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                Следующая
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && (!data?.items || data.items.length === 0) && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">Курсы не найдены</h3>
          <p className="text-gray-500 mb-4">Попробуйте изменить параметры поиска</p>
          <Button
            onClick={() => {
              setSearch('');
              setLevel('');
              setPage(1);
            }}
            variant="outline"
          >
            Показать все курсы
          </Button>
        </div>
      )}
    </div>
  );
};
