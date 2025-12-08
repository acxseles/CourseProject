import { useParams, Link } from 'react-router-dom';
import { useGetCourseById } from '@/features/courses/hooks';
import { useGetLessonById, useGetLessonsByCourse } from '@/features/lessons/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Loader, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary-600 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {course && (
            <p className="text-blue-100 text-sm mb-2">
              <Link to={`/courses/${courseId}`} className="hover:text-blue-200 transition-colors">
                {course.title}
              </Link>
            </p>
          )}
          <div className="flex items-center gap-4">
            {lesson && (
              <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center font-bold text-white text-lg">
                {lesson.orderIndex ?? currentIndex + 1}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl text-blue-700 font-bold">{lesson?.title || 'Лекция'}</h1>
          </div>
          <div className="mt-6"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-10 h-10 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600">Загрузка лекции...</p>
          </div>
        )}

        {(courseError || lessonError) && (
          <Alert type="error">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Ошибка при загрузке
            </div>
          </Alert>
        )}

        {!isLoading && lesson && (
          <>
            {/* Видео лекции */}
            {lesson.videoUrl && (
              <Card className="shadow-sm hover:shadow-lg transition-shadow">
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

            {/* Содержание лекции */}
            <Card className="shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-primary-700">Содержание лекции</CardTitle>
              </CardHeader>
              <CardContent>
                {lesson.content ? (
                  <div className="prose dark:prose-invert max-w-none">
                    {lesson.content.split('\n').map((paragraph, index) =>
                      paragraph.trim() ? (
                        <p key={index} className="text-primary-700 dark:text-primary-300 mb-4 leading-relaxed">
                          {paragraph}
                        </p>
                      ) : null
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">Содержание лекции недоступно</p>
                )}
              </CardContent>
            </Card>

            {/* Вторая карточка с полезной информацией */}
            <Card className="shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-blue-700">Информация о лекции</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800">
                  Эта лекция является частью курса <strong>{course?.title}</strong> и поможет вам понять ключевые концепции. 
                  Пройдя все лекции, вы получите полный обзор материала.
                </p>
              </CardContent>
            </Card>

            {/* Тест лекции */}
            <Card className="shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-blue-700 ">Пройти тест по лекции</CardTitle>
              </CardHeader>
              <CardContent>
                <TestComponent lessonId={lessonIdNum} />
              </CardContent>
            </Card>

            {/* Навигация между лекциями */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              {previousLesson ? (
                <Link to={`/courses/${courseId}/lessons/${previousLesson.id}`} className="flex-1 w-full">
                  <Button variant="outline" className="w-full justify-start text-blue-600">
                    <ChevronLeft className="w-4 h-4 mr-2 text-blue-600" />
                    Предыдущая
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="flex-1 w-full justify-start text-blue-600">
                  <ChevronLeft className="w-4 h-4 mr-2 text-blue-600" />
                  Предыдущая
                </Button>
              )}

              <Link to={`/courses/${courseId}/lessons`} className="flex-shrink-0">
                <Button variant="secondary" className="text-blue-600">Все лекции</Button>
              </Link>

              {nextLesson ? (
                <Link to={`/courses/${courseId}/lessons/${nextLesson.id}`} className="flex-1 w-full">
                  <Button className="w-full justify-end text-blue-600">
                    Следующая
                    <ChevronRight className="w-4 h-4 ml-2 text-blue-600" />
                  </Button>
                </Link>
              ) : (
                <Button disabled className="flex-1 w-full justify-end text-blue-600">
                  Следующая
                  <ChevronRight className="w-4 h-4 ml-2 text-blue-600" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
