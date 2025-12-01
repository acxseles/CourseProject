import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useGetStudentEnrollments, useCancelEnrollment } from '@/features/enrollments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/shared/ui';
import { BookOpen, Loader, AlertCircle, Trash2 } from 'lucide-react';

export const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [cancelError, setCancelError] = useState<string | null>(null);

  const { data, isLoading, error } = useGetStudentEnrollments(user?.id || 0, { page, pageSize });
  const cancelMutation = useCancelEnrollment(user?.id || 0, {
    onError: () => setCancelError('Ошибка при отмене записи на курс'),
    onSuccess: () => setCancelError(null),
  });

  const handleCancel = (enrollmentId: number) => {
    cancelMutation.mutate(enrollmentId);
  };

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Мои курсы</h1>
        <p className="text-base sm:text-lg text-foreground/70">
          Здесь вы можете просмотреть курсы, на которые вы записаны
        </p>
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <Link to="/courses">
          <Button className="bg-primary-600 hover:bg-primary-700">
            Найти новые курсы
          </Button>
        </Link>
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

      {/* Cancel Error State */}
      {cancelError && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Ошибка</h3>
                <p className="text-sm text-red-800">{cancelError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrollments Grid */}
      {!isLoading && data?.items && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {data.items.map((enrollment) => (
              <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{enrollment.courseTitle || enrollment.courseName}</CardTitle>
                      <CardDescription>
                        Записаны: {new Date(enrollment.enrollmentDate || enrollment.enrolledAt || '').toLocaleDateString('ru-RU')}
                      </CardDescription>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/60">Прогресс</span>
                      <span className="font-semibold">0%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-primary-600 hover:bg-primary-700">
                      Продолжить обучение
                    </Button>
                    <button
                      onClick={() => handleCancel(enrollment.id)}
                      disabled={cancelMutation.isPending}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-red-600 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
      {!isLoading && (!data?.items || data.items.length === 0) && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-primary-300 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Вы еще не записаны ни на один курс</h3>
              <p className="text-foreground/60 mb-6">Посетите каталог курсов и выберите интересующий вас курс</p>
              <Link to="/courses">
                <Button className="bg-primary-600 hover:bg-primary-700">
                  Перейти в каталог
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
