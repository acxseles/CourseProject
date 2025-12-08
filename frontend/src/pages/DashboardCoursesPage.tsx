import { useState } from 'react';
import { useGetCourses, useDeleteCourse } from '@/features/courses';
import { useAuth } from '@/features/auth';
import { Card, CardContent, Button, Input } from '@/shared/ui';
import { Loader, AlertCircle, Trash2, Plus } from 'lucide-react';
import { CourseFormModal } from '@/components/CourseFormModal';
import { useQueryClient } from '@tanstack/react-query';

export const DashboardCoursesPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;

  const isTeacher = user?.role === 'Teacher';
  const isAdmin = user?.role === 'Admin';

  const { data, isLoading, error } = useGetCourses(
    { page, pageSize, search: search || undefined },
    { scope: isTeacher ? 'teacher' : 'all' }
  );

  const filteredData = data
    ? {
        ...data,
        items: isTeacher
          ? data.items.filter((course) => course.teacherId === user?.id)
          : data.items,
        totalCount: isTeacher
          ? data.items.filter((course) => course.teacherId === user?.id).length
          : data.items.length,
      }
    : null;

  const totalPages = filteredData ? Math.ceil(filteredData.totalCount / pageSize) : 0;
  const deleteMutation = useDeleteCourse();

  const handleDelete = (courseId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот курс?')) {
      deleteMutation.mutate(courseId, {
        onSuccess: () => {
          queryClient.setQueryData(['courses'], (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              items: oldData.items.filter((course: any) => course.id !== courseId),
              totalCount: oldData.totalCount - 1,
            };
          });
        },
      });
    }
  };

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4 sm:px-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isTeacher ? 'Мои курсы' : 'Курсы'}
        </h1>
        <p className="text-lg text-gray-700">
          {isTeacher
            ? 'Управляйте вашими курсами и отслеживайте студентов'
            : 'Создавайте и удаляйте курсы'}
        </p>
      </div>

      {/* Create Course Button */}
      {(isTeacher || isAdmin) && (
        <Button
          onClick={handleCreateClick}
          className="text-blue-600 bg-blue-100 hover:bg-blue-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Создать новый курс
        </Button>
      )}

      {/* Modal */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Search */}
      <div>
        <Input
          placeholder="Поиск по названию курса..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Ошибка загрузки</h3>
                <p className="text-sm text-red-800">Не удалось загрузить курсы. Попробуйте позже.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses List */}
      {!isLoading && filteredData && filteredData.items.length > 0 && (
        <div className="space-y-4">
          {filteredData.items.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Уровень:</span>
                        <p className="font-semibold">
                          {course.level === 'Beginner' && 'Начинающий'}
                          {course.level === 'Intermediate' && 'Средний'}
                          {course.level === 'Advanced' && 'Продвинутый'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Часов:</span>
                        <p className="font-semibold">{course.durationHours}h</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Цена:</span>
                        <p className="font-semibold">${course.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {(isTeacher || isAdmin) && (
                    <div className="flex gap-2 flex-shrink-0 mt-2 md:mt-0">
                      <Button
                        onClick={() => handleDelete(course.id)}
                        disabled={deleteMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-blue-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                variant="outline"
                className="text-blue-600"
              >
                Предыдущая
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  variant={p === page ? 'default' : 'outline'}
                  className="w-10 h-10 p-0 text-blue-600"
                >
                  {p}
                </Button>
              ))}
              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                variant="outline"
                className="text-blue-600"
              >
                Следующая
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredData && filteredData.items.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">
                {isTeacher ? 'Вы еще не создали ни одного курса' : 'Курсы отсутствуют'}
              </h3>
              <p className="text-gray-600 mb-6">
                Нажмите кнопку выше, чтобы создать {isTeacher ? 'ваш первый курс' : 'курс'}
              </p>
              {(isTeacher || isAdmin) && (
                <Button
                  onClick={handleCreateClick}
                  className="text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Создать курс
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
