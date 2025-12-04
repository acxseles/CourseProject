import { useParams, Link } from 'react-router-dom';
import { useGetCourseById } from '@/features/courses/hooks';
import { useGetLessonById, useGetLessonsByCourse } from '@/features/lessons/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Loader, AlertCircle, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { TestComponent } from '@/components/TestComponent';

export default function LessonDetailPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const courseIdNum = courseId ? parseInt(courseId) : 0;
  const lessonIdNum = lessonId ? parseInt(lessonId) : 0;

  const { data: course, isLoading: courseLoading, error: courseError } = useGetCourseById(courseIdNum);
  const { data: lesson, isLoading: lessonLoading, error: lessonError } = useGetLessonById(courseIdNum, lessonIdNum);
  const { data: lessons = [] } = useGetLessonsByCourse(courseIdNum);

  const isLoading = courseLoading || lessonLoading;

  const currentIndex = lessons.findIndex(l => l.id === lessonIdNum);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {course && (
            <p className="text-white/80 text-sm mb-2">
              <Link to={`/courses/${courseId}`} className="hover:text-white transition-colors">
                {course.title}
              </Link>
            </p>
          )}
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl sm:text-4xl font-bold">
              {lesson?.title || 'Лекция'}
            </h1>
          </div>
          {lesson && (
            <p className="text-white/90 mt-2">
              Лекция {lesson.orderIndex}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-8 h-8 text-primary-600 animate-spin mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">Загрузка лекции...</p>
          </div>
        )}

        {(courseError || lessonError) && (
          <Alert type="error" className="mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Ошибка при загрузке</span>
            </div>
          </Alert>
        )}

        {!isLoading && lesson && (
          <>
            {lesson.videoUrl && (
              <Card className="mb-8">
                <CardContent className="p-0">
                  <div className="relative w-full bg-neutral-900 rounded-lg overflow-hidden">
                    <iframe
                      width="100%"
                      height="500"
                      src={lesson.videoUrl}
                      title={lesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Содержание лекции</CardTitle>
              </CardHeader>
              <CardContent>
                {lesson.content ? (
                  <div className="prose dark:prose-invert max-w-none">
                    {lesson.content.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Содержание лекции недоступно
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardContent className="py-6">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">
                      Номер лекции
                    </p>
                    <p className="text-lg font-bold text-primary-600 mt-1">
                      {lesson.orderIndex}
                    </p>
                  </div>
                  {lesson.createdAt && (
                    <div>
                      <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">
                        Дата создания
                      </p>
                      <p className="text-sm font-medium text-neutral-900 dark:text-white mt-1">
                        {new Date(lesson.createdAt).toLocaleDateString('ru-RU', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase">
                      Всего лекций
                    </p>
                    <p className="text-lg font-bold text-primary-600 mt-1">
                      {lessons.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mb-8">
              <TestComponent lessonId={lessonIdNum} />
            </div>

            <div className="flex gap-4 justify-between items-center">
              {previousLesson ? (
                <Link to={`/courses/${courseId}/lessons/${previousLesson.id}`} className="flex-1">
                  <Button variant="outline" className="w-full justify-start">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Предыдущая
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="flex-1 justify-start">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Предыдущая
                </Button>
              )}

              <Link to={`/courses/${courseId}/lessons`} className="flex-shrink-0">
                <Button variant="secondary">
                  Все лекции
                </Button>
              </Link>

              {nextLesson ? (
                <Link to={`/courses/${courseId}/lessons/${nextLesson.id}`} className="flex-1">
                  <Button className="w-full justify-end">
                    Следующая
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button disabled className="flex-1 justify-end">
                  Следующая
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
