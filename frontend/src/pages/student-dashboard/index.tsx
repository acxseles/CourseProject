import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useGetStudentEnrollments, useCancelEnrollment } from '@/features/enrollments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@/shared/ui';
import { Loader, AlertCircle, Trash2 } from 'lucide-react';

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

  const handleCancel = (enrollmentId: number) => cancelMutation.mutate(enrollmentId);
  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 0;

  return (
    <div className="space-y-8 min-h-screen bg-blue-50 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">Мои курсы</h1>
        <p className="text-base sm:text-lg text-blue-700/70">
          Здесь вы можете просмотреть курсы, на которые вы записаны
        </p>
      </div>

      {/* Action Button */}
      <div>
        <Link to="/courses">
          <Button className="bg-white text-blue-600 hover:bg-blue-100 border border-blue-200">
            Найти новые курсы
          </Button>
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
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
                <p className="text-sm text-red-800">Не удалось загрузить ваши курсы. Попробуйте позже.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cancel Error */}
      {cancelError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Ошибка</h3>
                <p className="text-sm text-red-800">{cancelError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enrollments Grid */}
      {!isLoading && data?.items?.length ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.items.map((enrollment) => (
              <Card key={enrollment.id} className="hover:shadow-lg transition-shadow bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1 text-blue-900">{enrollment.courseTitle || enrollment.courseName}</CardTitle>
                      <CardDescription className="text-blue-700/70">
                        Записаны: {new Date(enrollment.enrollmentDate || enrollment.enrolledAt || '').toLocaleDateString('ru-RU')}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/courses/${enrollment.courseId}/lessons`} className="flex-1">
                      <Button className="w-full bg-white text-blue-600 hover:bg-blue-100 border border-blue-200">
                        Продолжить обучение
                      </Button>
                    </Link>
                    
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="text-blue-600 border border-blue-200 hover:bg-blue-100"
              >
                Предыдущая
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 p-0 ${p === page ? 'bg-blue-600 text-white' : 'text-blue-600 border border-blue-200 hover:bg-blue-100'}`}
                >
                  {p}
                </Button>
              ))}
              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="text-blue-600 border border-blue-200 hover:bg-blue-100"
              >
                Следующая
              </Button>
            </div>
          )}
        </>
      ) : (
        // Empty State
        !isLoading && (
          <Card className="bg-white">
            <CardContent className="pt-12 pb-12">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2 text-blue-900">Добро пожаловать!</h3>
                <p className="text-blue-700/70 mb-6">Посетите каталог курсов и выберите интересующий вас курс</p>
                <Link to="/courses">
                  <Button className="bg-white text-blue-600 hover:bg-blue-100 border border-blue-200">
                    Перейти в каталог
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
};
