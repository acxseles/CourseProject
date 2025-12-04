import { useState } from 'react';
import { useGetTestForLesson, useSubmitTest } from '@/features/tests';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui';
import { Loader, AlertCircle, CheckCircle } from 'lucide-react';
import type { SubmitTestDto, TestAnswerDto } from '@/shared/types';

interface TestComponentProps {
  lessonId: number;
}

export const TestComponent = ({ lessonId }: TestComponentProps) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [testResults, setTestResults] = useState<any>(null);

  const { data: test, isLoading, error } = useGetTestForLesson(lessonId);
  const submitMutation = useSubmitTest({
    onSuccess: (data) => {
      setHasSubmitted(true);
      // Результаты приходят в ответе от submitTest
      if (data) {
        setTestResults(data);
      }
    },
  });

  if (isLoading && !test && !hasSubmitted) {
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

  // Показываем ошибку только если это не ошибка "уже сдан" и у нас нет результатов
  if (error && !hasSubmitted && !testResults && error.message && !error.message.includes('уже сдавали')) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Ошибка загрузки теста</h3>
              <p className="text-sm text-red-800">Тест не найден или произошла ошибка</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!test && !hasSubmitted && !testResults) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-foreground/60">Для этого урока тест не создан</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (hasSubmitted && testResults) {
    const percentage = Math.round(testResults.percentage);
    const isPass = percentage >= 70;

    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="bg-green-50 border-b border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <CardTitle className="text-green-900 text-2xl">Тест успешно сдан!</CardTitle>
              <CardDescription className="text-green-700 mt-1">
                Ваши результаты готовы
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Main Score */}
          <div className={`p-6 rounded-lg border-2 text-center ${isPass ? 'bg-green-100 border-green-400' : 'bg-yellow-100 border-yellow-400'}`}>
            <p className={`text-sm font-semibold mb-2 ${isPass ? 'text-green-700' : 'text-yellow-700'}`}>
              {isPass ? 'Отлично!' : 'Хороший результат'}
            </p>
            <p className={`text-5xl font-bold ${isPass ? 'text-green-600' : 'text-yellow-600'}`}>
              {percentage}%
            </p>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-green-200 text-center">
              <p className="text-xs font-semibold text-foreground/60 uppercase mb-2">
                Правильных ответов
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <p className="text-3xl font-bold text-green-600">{testResults.correctAnswers}</p>
                <p className="text-sm text-foreground/60">из {testResults.totalQuestions}</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg border border-green-200 text-center">
              <p className="text-xs font-semibold text-foreground/60 uppercase mb-2">
                Всего вопросов
              </p>
              <p className="text-3xl font-bold text-primary-600">{testResults.totalQuestions}</p>
            </div>

            <div className="p-4 bg-white rounded-lg border border-green-200 text-center">
              <p className="text-xs font-semibold text-foreground/60 uppercase mb-2">
                Макс. баллы
              </p>
              <p className="text-3xl font-bold text-accent-600">{testResults.maxScore}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-foreground">Прогресс</span>
              <span className="text-foreground/60">{testResults.correctAnswers}/{testResults.totalQuestions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isPass ? 'bg-green-600' : 'bg-yellow-500'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Summary Text */}
          <div className={`p-4 rounded-lg ${isPass ? 'bg-green-100 border border-green-300' : 'bg-yellow-100 border border-yellow-300'}`}>
            <p className={`text-sm ${isPass ? 'text-green-800' : 'text-yellow-800'}`}>
              {isPass
                ? `✓ Вы набрали ${percentage}% баллов. Отличная работа!`
                : `• Вы набрали ${percentage}% баллов. Рекомендуем повторить материал и пройти тест еще раз.`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleSelectAnswer = (questionId: number, answerText: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerText,
    }));
  };

  const handleSubmitTest = async () => {
    if (!test) return;

    const answers: TestAnswerDto[] = Object.entries(selectedAnswers).map(([questionId, answerText]) => ({
      questionId: parseInt(questionId),
      selectedAnswer: answerText,
    }));

    const submitData: SubmitTestDto = { answers };
    await submitMutation.mutateAsync({ assignmentId: test.id, data: submitData });
  };

  const allQuestionsAnswered = test ? test.questions.every(q => selectedAnswers[q.id]) : false;

  if (!test) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{test.title}</CardTitle>
        {test.description && <CardDescription>{test.description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        {test.questions.map((question, index) => (
          <div key={question.id} className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </span>
              <p className="font-semibold text-foreground pt-0.5">{question.text}</p>
            </div>

            <div className="ml-9 space-y-2">
              {question.answers.map((answer) => (
                <label
                  key={answer.id}
                  className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-primary-50 transition-colors"
                  style={{
                    borderColor: selectedAnswers[question.id] === answer.text ? 'var(--color-primary-600)' : 'var(--color-border)',
                    backgroundColor: selectedAnswers[question.id] === answer.text ? 'var(--bg-primary-light)' : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={answer.text}
                    checked={selectedAnswers[question.id] === answer.text}
                    onChange={() => handleSelectAnswer(question.id, answer.text)}
                    className="w-4 h-4"
                  />
                  <span className="text-foreground">{answer.text}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {submitMutation.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">Ошибка при сдаче теста. Попробуйте еще раз</p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmitTest}
            disabled={!allQuestionsAnswered || submitMutation.isPending}
            className="flex-1 bg-primary-600 hover:bg-primary-700"
          >
            {submitMutation.isPending ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              `Сдать тест (${Object.keys(selectedAnswers).length}/${test.questions.length})`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
