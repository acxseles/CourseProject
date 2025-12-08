import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/ui/Modal';
import { Button, Input } from '@/shared/ui';
import { useCreateCourse } from '@/features/courses';
import { useCreateLesson } from '@/features/lessons';
import type { CreateLessonDto } from '@/shared/types';
import { Loader, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const courseSchema = z.object({
  title: z.string().min(3, 'Название должно быть минимум 3 символа'),
  description: z.string().min(10, 'Описание должно быть минимум 10 символов'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  durationHours: z.number().min(1, 'Длительность должна быть минимум 1 час'),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CourseFormModal = ({ isOpen, onClose }: CourseFormModalProps) => {
  const createCourseMutation = useCreateCourse();
  const createLessonMutation = useCreateLesson();

  const [lessons, setLessons] = useState<(CreateLessonDto & { tempId: string })[]>([]);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [showLessonsForm, setShowLessonsForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: { level: 'Beginner' },
  });

  const addLesson = () => {
    const tempId = `lesson-${Date.now()}`;
    setLessons([
      ...lessons,
      { tempId, title: '', content: '', orderIndex: lessons.length + 1 },
    ]);
    setExpandedLessonId(tempId);
  };

  const removeLesson = (tempId: string) => {
    setLessons(lessons.filter((l) => l.tempId !== tempId));
    if (expandedLessonId === tempId) setExpandedLessonId(null);
  };

  const updateLesson = (tempId: string, updates: Partial<CreateLessonDto>) => {
    setLessons(lessons.map((l) => (l.tempId === tempId ? { ...l, ...updates } : l)));
  };

  const moveLessonUp = (index: number) => {
    if (index === 0) return;
    const list = [...lessons];
    [list[index], list[index - 1]] = [list[index - 1], list[index]];
    list.forEach((l, i) => (l.orderIndex = i + 1));
    setLessons(list);
  };

  const moveLessonDown = (index: number) => {
    if (index === lessons.length - 1) return;
    const list = [...lessons];
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    list.forEach((l, i) => (l.orderIndex = i + 1));
    setLessons(list);
  };

  const onSubmit = async (data: CourseFormData) => {
    try {
      // 1) создаём курс
      const newCourse = await createCourseMutation.mutateAsync(data);

      // 2) создаём уроки
      for (const lesson of lessons) {
        const { tempId, ...lessonData } = lesson;
        await createLessonMutation.mutateAsync({
          courseId: newCourse.id,
          data: lessonData,
        });
      }

      // Очистка формы
      reset();
      setLessons([]);
      setExpandedLessonId(null);
      setShowLessonsForm(false);

      onClose();
    } catch (error) {
      console.error('Ошибка при создании курса:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Создать новый курс"
      size="lg"
    >
      <div className="bg-blue-50 p-6 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Название */}
          <div>
            <label className="block text-sm font-semibold mb-2">Название курса</label>
            <Input
              placeholder="Например: Базовый шведский"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-semibold mb-2">Описание</label>
            <textarea
              placeholder="Подробное описание курса..."
              rows={4}
              className="w-full px-4 py-2 border rounded-lg bg-white"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Уровень + длительность */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Уровень</label>
              <select
                className="w-full px-4 py-2 border rounded-lg bg-white"
                {...register('level')}
              >
                <option value="Beginner">Начинающий</option>
                <option value="Intermediate">Средний</option>
                <option value="Advanced">Продвинутый</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Длительность (часы)</label>
              <Input
                type="number"
                placeholder="20"
                {...register('durationHours', { valueAsNumber: true })}
                error={errors.durationHours?.message}
              />
            </div>
          </div>

          {/* Цена */}
          <div>
            <label className="block text-sm font-semibold mb-2">Цена ($)</label>
            <Input
              type="number"
              step="0.01"
              placeholder="49.99"
              {...register('price', { valueAsNumber: true })}
              error={errors.price?.message}
            />
          </div>

          {/* Уроки */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setShowLessonsForm(!showLessonsForm)}
                className="flex items-center gap-2 font-semibold text-blue-600"
              >
                {showLessonsForm ? <ChevronDown /> : <ChevronUp />}
                Уроки ({lessons.length})
              </button>

              {showLessonsForm && (
                <Button
                  type="button"
                  onClick={addLesson}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить урок
                </Button>
              )}
            </div>

            {showLessonsForm && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <div key={lesson.tempId} className="border rounded-lg">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedLessonId(
                          expandedLessonId === lesson.tempId ? null : lesson.tempId
                        )
                      }
                      className="w-full px-4 py-3 flex justify-between hover:bg-gray-100"
                    >
                      <span className="font-semibold">Урок {lesson.orderIndex}</span>
                      {expandedLessonId === lesson.tempId ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    {expandedLessonId === lesson.tempId && (
                      <div className="p-4 space-y-3 border-t">
                        <Input
                          placeholder="Название урока"
                          value={lesson.title}
                          onChange={(e) =>
                            updateLesson(lesson.tempId, { title: e.target.value })
                          }
                        />

                        <textarea
                          placeholder="Содержание урока"
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg"
                          value={lesson.content}
                          onChange={(e) =>
                            updateLesson(lesson.tempId, { content: e.target.value })
                          }
                        />

                        <div className="flex justify-end gap-2">
                          {index > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveLessonUp(index)}
                            >
                              <ChevronUp />
                            </Button>
                          )}
                          {index < lessons.length - 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => moveLessonDown(index)}
                            >
                              <ChevronDown />
                            </Button>
                          )}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                            onClick={() => removeLesson(lesson.tempId)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>

            <Button
  type="submit"
  disabled={createCourseMutation.isPending}
  className="text-blue-600 bg-blue-50 hover:bg-blue-100"
>
  {createCourseMutation.isPending ? (
    <>
      <Loader className="w-4 h-4 mr-2 animate-spin text-blue-600" />
      Создание...
    </>
  ) : (
    'Создать курс'
  )}
</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
