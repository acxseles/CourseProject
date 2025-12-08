import { useParams, Link } from 'react-router-dom';
import { useGetCourseById } from '@/features/courses/hooks';
import { useGetLessonsByCourse } from '@/features/lessons/hooks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Loader, AlertCircle } from 'lucide-react';

export default function LessonsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = courseId ? parseInt(courseId) : 0;

  const { data: course, isLoading: courseLoading, error: courseError } = useGetCourseById(id);
  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useGetLessonsByCourse(id);

  const isLoading = courseLoading || lessonsLoading;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary-600 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {course?.title || 'Лекции курса'}
          </h1>
          <p className="text-white/90 text-lg">
            {lessons?.length || 0} лекций в этом курсе
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="w-10 h-10 text-primary-600 animate-spin mb-4" />
            <p className="text-gray-600">Загрузка лекций...</p>
          </div>
        )}

        {(courseError || lessonsError) && (
          <Alert type="error">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Ошибка при загрузке курса или лекций
            </div>
          </Alert>
        )}

        {!isLoading && lessons && lessons.length === 0 && (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-gray-600 text-lg">В этом курсе пока нет лекций</p>
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
                <Card className="transition-shadow hover:shadow-lg cursor-pointer">
                  <CardContent className="flex items-center justify-between gap-4 py-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-base transition-transform duration-200 group-hover:scale-110">
                          {lesson.orderIndex != null ? lesson.orderIndex : lesson.id}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                          {lesson.title}
                        </h3>
                      </div>
                      {lesson.content && (
                        <p className="text-gray-600 line-clamp-2 ml-11">
                          {lesson.content.length > 150
                            ? lesson.content.substring(0, 150) + '...'
                            : lesson.content}
                        </p>
                      )}
                    </div>
                    
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Back to course button */}
        <div className="mt-8">
          <Link to={`/courses/${courseId}`}>
            <Button variant="outline">← Вернуться к курсу</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
