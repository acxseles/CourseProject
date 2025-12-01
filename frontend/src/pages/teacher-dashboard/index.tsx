import { useState } from 'react';
import { useGetCourses } from '@/features/courses';
import { useDeleteCourse } from '@/features/courses';
import { useAuth } from '@/features/auth';
import { Card, CardContent, Button, Input } from '@/shared/ui';
import { BookOpen, Loader, AlertCircle, Trash2, Edit2, Plus, Users } from 'lucide-react';
import { CourseFormModal } from '@/components/CourseFormModal';

export const TeacherDashboardPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(undefined);
  const pageSize = 10;

  const { data, isLoading, error } = useGetCourses(
    {
      page,
      pageSize,
      search: search || undefined,
    },
    { scope: 'teacher' }
  );

  // Filter courses to only show those created by current teacher
  const filteredData = data ? {
    ...data,
    items: data.items.filter((course) => course.teacherId === user?.id),
    totalCount: data.items.filter((course) => course.teacherId === user?.id).length,
  } : null;

  const deleteMutation = useDeleteCourse();
  const totalPages = filteredData ? Math.ceil(filteredData.totalCount / pageSize) : 0;

  const handleDelete = (courseId: number) => {
    if (confirm('Вы уверены, что хотите удалить этот курс?')) {
      deleteMutation.mutate(courseId);
    }
  };

  const handleCreateClick = () => {
    setSelectedCourse(undefined);
    setIsModalOpen(true);
  };

  const handleEditClick = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Мои курсы</h1>
        <p className="text-base sm:text-lg text-foreground/70">
          Управляйте вашими курсами и отслеживайте студентов
        </p>
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <Button onClick={handleCreateClick} className="bg-primary-600 hover:bg-primary-700">
          <Plus className="w-4 h-4 mr-2" />
          Создать новый курс
        </Button>
      </div>

      {/* Modal */}
      <CourseFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} course={selectedCourse} />

      {/* Search */}
      <div className="mb-6">
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Ошибка загрузки</h3>
                <p className="text-sm text-red-800">Не удалось загрузить ваши курсы. Попробуйте позже.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses Table */}
      {!isLoading && filteredData && filteredData.items.length > 0 && (
        <>
          <div className="space-y-4 mb-8">
            {filteredData.items.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                          <p className="text-sm text-foreground/60 mb-3">{course.description}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-foreground/60">Уровень:</span>
                              <p className="font-semibold">
                                {course.level === 'Beginner' && 'Начинающий'}
                                {course.level === 'Intermediate' && 'Средний'}
                                {course.level === 'Advanced' && 'Продвинутый'}
                              </p>
                            </div>
                            <div>
                              <span className="text-foreground/60">Часов:</span>
                              <p className="font-semibold">{course.durationHours}h</p>
                            </div>
                            <div>
                              <span className="text-foreground/60">Цена:</span>
                              <p className="font-semibold">${course.price}</p>
                            </div>
                            <div>
                              <span className="text-foreground/60">Студентов:</span>
                              <p className="font-semibold">0</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Users className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleEditClick(course)}
                        variant="outline"
                        size="sm"
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(course.id)}
                        disabled={deleteMutation.isPending}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
      {!isLoading && filteredData && filteredData.items.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-primary-300 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Вы еще не создали ни одного курса</h3>
              <p className="text-foreground/60 mb-6">Нажмите кнопку выше, чтобы создать ваш первый курс</p>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Создать курс
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
