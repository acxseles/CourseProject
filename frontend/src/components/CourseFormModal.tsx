import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/shared/ui/Modal';
import { Button, Input } from '@/shared/ui';
import { useCreateCourse, useUpdateCourse } from '@/features/courses';
import type { Course } from '@/shared/types';
import { Loader } from 'lucide-react';

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
  const isEditing = !!course;
  const isLoading = createMutation.isPending || updateMutation.isPending;

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
      if (isEditing && course) {
        await updateMutation.mutateAsync({
          id: course.id,
          data: data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      reset();
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
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
