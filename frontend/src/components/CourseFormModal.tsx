import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/ui/Modal';
import { Button, Input } from '@/shared/ui';
import { useCreateCourse, useUpdateCourse } from '@/features/courses';
import { useCreateLesson } from '@/features/lessons';
import type { Course, CreateLessonDto } from '@/shared/types';
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
  course?: Course;
}

export const CourseFormModal = ({ isOpen, onClose, course }: CourseFormModalProps) => {
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const createLessonMutation = useCreateLesson();
  const isEditing = !!course;
  const isLoading = createMutation.isPending || updateMutation.isPending;

  // State for lessons management
  const [lessons, setLessons] = useState<(CreateLessonDto & { tempId?: string })[]>([]);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);
  const [showLessonsForm, setShowLessonsForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: course
      ? {
          title: course.title,
          description: course.description,
          level: course.level,
          price: course.price,
          durationHours: course.durationHours,
        }
      : {
          level: 'Beginner',
        },
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      let courseId: number;

      if (isEditing && course) {
        await updateMutation.mutateAsync({
          id: course.id,
          data: data,
        });
        courseId = course.id;
      } else {
        const newCourse = await createMutation.mutateAsync(data);
        courseId = newCourse.id;
      }

      // Add lessons if course exists
      if (courseId && lessons.length > 0) {
        for (const lesson of lessons) {
          const { tempId, ...lessonData } = lesson;
          try {
            await createLessonMutation.mutateAsync({
              courseId,
              data: lessonData,
            });
          } catch (error) {
            console.error('Error creating lesson:', error);
          }
        }
      }

      reset();
      setLessons([]);
      setShowLessonsForm(false);
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const addLesson = () => {
    const tempId = `lesson-${Date.now()}`;
    setLessons([
      ...lessons,
      {
        title: '',
        content: '',
        orderIndex: lessons.length + 1,
        tempId,
      },
    ]);
    setExpandedLessonId(tempId);
  };

  const removeLesson = (tempId?: string) => {
    setLessons(lessons.filter(l => l.tempId !== tempId));
    if (expandedLessonId === tempId) {
      setExpandedLessonId(null);
    }
  };

  const updateLesson = (tempId: string | undefined, updates: Partial<CreateLessonDto>) => {
    setLessons(
      lessons.map(l =>
        l.tempId === tempId ? { ...l, ...updates } : l
      )
    );
  };

  const moveLessonUp = (index: number) => {
    if (index > 0) {
      const newLessons = [...lessons];
      [newLessons[index], newLessons[index - 1]] = [newLessons[index - 1], newLessons[index]];
      // Update orderIndex
      newLessons.forEach((lesson, idx) => {
        lesson.orderIndex = idx + 1;
      });
      setLessons(newLessons);
    }
  };

  const moveLessonDown = (index: number) => {
    if (index < lessons.length - 1) {
      const newLessons = [...lessons];
      [newLessons[index], newLessons[index + 1]] = [newLessons[index + 1], newLessons[index]];
      // Update orderIndex
      newLessons.forEach((lesson, idx) => {
        lesson.orderIndex = idx + 1;
      });
      setLessons(newLessons);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Редактировать курс' : 'Создать новый курс'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Название курса</label>
          <Input
            placeholder="Например: Базовый шведский"
            error={errors.title?.message}
            {...register('title')}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Описание</label>
          <textarea
            placeholder="Подробное описание курса..."
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{borderColor: 'var(--color-border)'}}
            rows={4}
            {...register('description')}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Уровень сложности</label>
            <select
              className="w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{borderColor: 'var(--color-border)'}}
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
              error={errors.durationHours?.message}
              {...register('durationHours', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Цена ($)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="49.99"
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />
        </div>

        {/* Lessons Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => setShowLessonsForm(!showLessonsForm)}
              className="flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700"
            >
              {showLessonsForm ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
              Уроки ({lessons.length})
            </button>
            {showLessonsForm && (
              <Button
                type="button"
                onClick={addLesson}
                variant="ghost"
                size="sm"
                className="text-primary-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Добавить урок
              </Button>
            )}
          </div>

          {showLessonsForm && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {lessons.length === 0 ? (
                <p className="text-sm text-neutral-600 text-center py-4">
                  Нет добавленных уроков. Нажмите кнопку выше чтобы добавить урок.
                </p>
              ) : (
                lessons.map((lesson, index) => (
                  <div
                    key={lesson.tempId}
                    className="border rounded-lg overflow-hidden"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedLessonId(
                          expandedLessonId === lesson.tempId ? null : (lesson.tempId || null)
                        )
                      }
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-sm font-semibold text-primary-600">
                          Урок {lesson.orderIndex}
                        </span>
                        <span className="text-sm text-neutral-600 truncate">
                          {lesson.title || 'Без названия'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {expandedLessonId === lesson.tempId ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {expandedLessonId === lesson.tempId && (
                      <div className="border-t px-4 py-3 space-y-3" style={{ borderTopColor: 'var(--color-border)' }}>
                        <div>
                          <label className="block text-xs font-semibold mb-1">Название урока</label>
                          <Input
                            type="text"
                            placeholder="Название урока"
                            value={lesson.title}
                            onChange={(e) =>
                              updateLesson(lesson.tempId, { title: e.target.value })
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1">Содержание</label>
                          <textarea
                            placeholder="Содержание урока..."
                            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            style={{ borderColor: 'var(--color-border)' }}
                            rows={3}
                            value={lesson.content || ''}
                            onChange={(e) =>
                              updateLesson(lesson.tempId, { content: e.target.value })
                            }
                          />
                        </div>

                        <div className="flex items-center gap-2 justify-end pt-2">
                          {index > 0 && (
                            <Button
                              type="button"
                              onClick={() => moveLessonUp(index)}
                              variant="ghost"
                              size="sm"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </Button>
                          )}
                          {index < lessons.length - 1 && (
                            <Button
                              type="button"
                              onClick={() => moveLessonDown(index)}
                              variant="ghost"
                              size="sm"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            type="button"
                            onClick={() => removeLesson(lesson.tempId)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {createMutation.error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">Ошибка при сохранении курса</p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-4">
          <Button onClick={onClose} variant="outline" disabled={isLoading}>
            Отмена
          </Button>
          <Button type="submit" className="bg-primary-600 hover:bg-primary-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : isEditing ? (
              'Обновить курс'
            ) : (
              'Создать курс'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
