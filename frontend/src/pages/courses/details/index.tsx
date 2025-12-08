import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetCourseById } from '@/features/courses';
import { useEnrollStudent } from '@/features/enrollments';
import { useGetStudentEnrollments } from '@/features/enrollments';
import { useAuth } from '@/features/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '@/shared/ui';
import { Clock, DollarSign, User, AlertCircle, Loader, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import { useState, useMemo } from 'react';
import { CourseTestsSection } from '@/components/CourseTestsSection';
import { format } from 'date-fns';

export const CourseDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrolled, setEnrolled] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const courseId = id ? parseInt(id) : 0;
  const { data: course, isLoading, error } = useGetCourseById(courseId);
  const { data: enrollmentsData } = useGetStudentEnrollments(user?.id || 0, { page: 1, pageSize: 100 });
  const enrollMutation = useEnrollStudent();

  const isAlreadyEnrolled = useMemo(() => {
    return enrollmentsData?.items?.some(e => e.courseId === courseId) || false;
  }, [enrollmentsData, courseId]);

  const isAdvancedCourse = course?.level === 'Advanced';

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (isAdvancedCourse && !selectedDate) return;
    try {
      await enrollMutation.mutateAsync({ courseId, studentId: user.id });
      setEnrolled(true);
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Курс не найден</h3>
                <p className="text-blue-900/70 mb-4">Курс не удалось загрузить или он больше недоступен.</p>
                <Button onClick={() => navigate('/courses')} className="w-full text-blue-600 hover:text-blue-800 border border-blue-200">
                  Вернуться в каталог
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/courses')}
            className="mb-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Вернуться в каталог
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">{course.title}</h1>
          <p className="text-lg text-blue-800/90 leading-relaxed">{course.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Info & Description */}
        <div className="lg:col-span-2 space-y-4">
          {/* Info Cards */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <User className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700/70">Уровень сложности</p>
                  <p className="font-semibold text-blue-900">
                    {course.level === 'Beginner' && 'Начинающий'}
                    {course.level === 'Intermediate' && 'Средний'}
                    {course.level === 'Advanced' && 'Продвинутый'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700/70">Длительность</p>
                  <p className="font-semibold text-blue-900">{course.durationHours} часов</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                <DollarSign className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-700/70">Стоимость</p>
                  <p className="font-semibold text-blue-900 text-lg">${course.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Описание курса</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-900/80 leading-relaxed whitespace-pre-wrap">{course.description}</p>
            </CardContent>
          </Card>

          {(enrolled || isAlreadyEnrolled) && <CourseTestsSection courseId={courseId} />}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {enrolled || isAlreadyEnrolled ? (
            <Card className="sticky top-4 bg-white shadow-sm border border-green-200 p-4">
              <div className="flex flex-col items-center text-center gap-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
                <h3 className="font-semibold text-lg">Вы записаны на курс!</h3>
                <p className="text-sm text-blue-900/70">Перейдите в раздел "Мои курсы", чтобы начать обучение.</p>
                <Button onClick={() => navigate('/dashboard/my-courses')} className="w-full text-blue-600 hover:text-blue-800 border border-blue-200">
                  Посмотреть мои курсы
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="sticky top-4 bg-white shadow-sm p-4">
              {isAdvancedCourse && (
                <div className="space-y-2 mb-4">
                  <label className="block text-sm font-semibold">Выберите дату начала курса *</label>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-blue-600" />
                    <input
                      type="date"
                      value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="flex-1 px-4 py-2 border rounded-lg bg-white text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  {!selectedDate && <p className="text-xs text-red-600">Дата начала обязательна для продвинутых курсов</p>}
                </div>
              )}

              <Button
                onClick={handleEnroll}
                disabled={enrollMutation.isPending || (isAdvancedCourse && !selectedDate)}
                className="w-full text-blue-600 hover:text-blue-800 border border-blue-200"
              >
                {enrollMutation.isPending ? 'Запись...' : 'Записаться на курс'}
              </Button>

              {enrollMutation.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                  <p className="text-sm text-red-600">Ошибка при записи на курс</p>
                </div>
              )}

              <div className="text-xs text-blue-900/70 mt-4 space-y-1">
                <p>✓ Доступ на неограниченный срок</p>
                <p>✓ Материалы курса</p>
                <p>✓ Сертификат по окончании</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
