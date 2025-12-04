import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetCourseById } from '@/features/courses';
import { useEnrollStudent } from '@/features/enrollments';
import { useGetStudentEnrollments } from '@/features/enrollments';
import { useAuth } from '@/features/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/shared/ui';
import { BookOpen, Clock, DollarSign, User, AlertCircle, Loader, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
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

  // Check if student is already enrolled in this course
  const isAlreadyEnrolled = useMemo(() => {
    return enrollmentsData?.items?.some(e => e.courseId === courseId) || false;
  }, [enrollmentsData, courseId]);

  // Check if course is advanced
  const isAdvancedCourse = course?.level === 'Advanced';

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }

    // For advanced courses, date is required
    if (isAdvancedCourse && !selectedDate) {
      return;
    }

    try {
      await enrollMutation.mutateAsync({ courseId, studentId: user.id });
      setEnrolled(true);
    } catch (err) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Курс не найден</h3>
                <p className="text-foreground/70 mb-4">Курс не удалось загрузить или он больше недоступен.</p>
                <Button onClick={() => navigate('/courses')} className="w-full">
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-500 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate('/courses')}
            className="mb-4 text-white/80 hover:text-white text-sm font-medium"
          >
            ← Вернуться в каталог
          </button>
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          <p className="text-lg opacity-90">{course.description}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Details */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Информация о курсе</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Level */}
                <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Уровень сложности</p>
                    <p className="font-semibold">
                      {course.level === 'Beginner' && 'Начинающий'}
                      {course.level === 'Intermediate' && 'Средний'}
                      {course.level === 'Advanced' && 'Продвинутый'}
                    </p>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-4 p-4 bg-secondary-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-secondary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Длительность</p>
                    <p className="font-semibold">{course.durationHours} часов</p>
                  </div>
                </div>

                {/* Teacher */}
                <div className="flex items-center gap-4 p-4 bg-accent-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-accent-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-accent-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Преподаватель</p>
                    <p className="font-semibold">{course.teacherName}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Стоимость</p>
                    <p className="font-semibold text-lg">${course.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Описание курса</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 leading-relaxed whitespace-pre-wrap">
                  {course.description}
                </p>
              </CardContent>
            </Card>

            {/* Tests Section - visible only if enrolled */}
            {(enrolled || isAlreadyEnrolled) && (
              <CourseTestsSection courseId={courseId} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {enrolled || isAlreadyEnrolled ? (
              <>
                <Card className="sticky top-4 bg-green-50 border-green-200 mb-4">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center mb-4">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-center font-semibold text-lg mb-2">Вы записаны на курс!</h3>
                    <p className="text-center text-sm text-foreground/70 mb-4">
                      Перейдите в раздел "Мои курсы" чтобы начать обучение.
                    </p>
                    <Button
                      onClick={() => navigate('/dashboard/my-courses')}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Посмотреть мои курсы
                    </Button>
                  </CardContent>
                </Card>

                <Link to={`/courses/${id}/lessons`}>
                  <Card className="sticky top-4 cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Лекции
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">Смотреть лекции →</Button>
                    </CardContent>
                  </Card>
                </Link>
              </>
            ) : (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-2xl">${course.price}</CardTitle>
                  <CardDescription>Стоимость курса</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAdvancedCourse && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">
                        Выберите дату начала курса *
                      </label>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary-600" />
                        <input
                          type="date"
                          value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              setSelectedDate(new Date(e.target.value));
                            } else {
                              setSelectedDate(undefined);
                            }
                          }}
                          min={format(new Date(), 'yyyy-MM-dd')}
                          className="flex-1 px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
                          style={{ borderColor: 'var(--color-border)' }}
                        />
                      </div>
                      {!selectedDate && (
                        <p className="text-xs text-red-600">Дата начала обязательна для продвинутых курсов</p>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={handleEnroll}
                    disabled={enrollMutation.isPending || (isAdvancedCourse && !selectedDate)}
                    className="w-full bg-primary-600 hover:bg-primary-700"
                  >
                    {enrollMutation.isPending ? 'Запись...' : 'Записаться на курс'}
                  </Button>

                  {enrollMutation.error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">Ошибка при записи на курс</p>
                    </div>
                  )}

                  <div className="text-xs text-foreground/60 space-y-1">
                    <p>✓ Доступ на неограниченный срок</p>
                    <p>✓ Материалы курса</p>
                    <p>✓ Сертификат по окончании</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
