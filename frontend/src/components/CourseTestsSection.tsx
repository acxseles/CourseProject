import { useGetTestsForCourse } from '@/features/tests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/shared/ui';
import { Loader, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseTestsSectionProps {
  courseId: number;
}

export const CourseTestsSection = ({ courseId }: CourseTestsSectionProps) => {
  const { data: tests, isLoading, error } = useGetTestsForCourse(courseId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-8">
            <Loader className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Ошибка загрузки тестов</h3>
              <p className="text-sm text-red-800">Не удалось загрузить список тестов</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tests || tests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary-600" />
            Тесты курса
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/60">Для этого курса пока нет тестов</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary-600" />
          Тесты курса ({tests.length})
        </CardTitle>
        <CardDescription>Пройдите тесты после изучения соответствующих лекций</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tests.map((test) => (
            <Link key={test.id} to={`/courses/${courseId}/lessons/${test.lessonId}`}>
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer hover:border-primary-400">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{test.title}</h4>
                    {test.description && (
                      <p className="text-sm text-foreground/60 mb-2">{test.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-foreground/50">
                      <span>Вопросов: {test.questions.length}</span>
                      <span>Макс. баллы: {test.maxScore}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Button variant="ghost" size="sm" className="text-primary-600">
                      Пройти →
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
