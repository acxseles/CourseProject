import { useParams, Link } from 'react-router-dom';
import { useGetCourseById } from '@/features/courses/hooks';
import { useGetLessonsByCourse } from '@/features/lessons/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Loader, AlertCircle, BookOpen } from 'lucide-react';

export default function LessonsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = courseId ? parseInt(courseId) : 0;

  const { data: course, isLoading: courseLoading, error: courseError } = useGetCourseById(id);
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useGetLessonsByCourse(id);

  const isLoading = courseLoading || lessonsLoading;

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-600 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl sm:text-4xl font-bold">
              {course?.title || 'Лекции курса'}
            </h1>
          </div>
          <p className="text-white/90 max-w-2xl">
            {lessons?.length || 0} лекции в этом курсе
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-8 h-8 text-primary-600 animate-spin mb-4" />
            <p className="text-neutral-600 dark:text-neutral-400">Загрузка лекций...</p>
          </div>
        )}

        {(courseError || lessonsError) && (
          <Alert type="error" className="mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Ошибка при загрузке</span>
            </div>
          </Alert>
        )}

        {!isLoading && lessons && lessons.length === 0 && (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                  В этом курсе пока нет лекций
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && lessons && lessons.length > 0 && (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/courses/${courseId}/lessons/${lesson.id}`}
                className="group"
              >
                <Card className="transition-all hover:shadow-xl hover:border-primary-400 cursor-pointer">
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex-shrink-0 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {lesson.orderIndex}
                          </span>
                          <h3 className="text-lg font-semibold text-primary-900 dark:text-white group-hover:text-primary-600 transition-colors">
                            {lesson.title}
                          </h3>
                        </div>
                        {lesson.content && (
                          <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2 ml-11">
                            {lesson.content.substring(0, 150)}
                            {lesson.content.length > 150 ? '...' : ''}
                          </p>
                        )}
                        {lesson.createdAt && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-2 ml-11">
                            {new Date(lesson.createdAt).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-shrink-0"
                        onClick={(e) => e.preventDefault()}
                      >
                        Открыть {String.fromCharCode(8594)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link to={`/courses/${courseId}`}>
            <Button variant="outline">{String.fromCharCode(8592)} Вернуться к курсу</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
