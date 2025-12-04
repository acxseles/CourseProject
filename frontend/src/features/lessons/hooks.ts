import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsApi } from '@/shared/api/lessonsApi';
import type { CreateLessonDto, UpdateLessonDto } from '@/shared/types';

export const useGetLessonsByCourse = (courseId: number) => {
  return useQuery({
    queryKey: ['lessons', courseId],
    queryFn: () => lessonsApi.getLessonsByCourse(courseId),
    enabled: !!courseId,
  });
};

export const useGetLessonById = (courseId: number, lessonId: number) => {
  return useQuery({
    queryKey: ['lesson', courseId, lessonId],
    queryFn: () => lessonsApi.getLessonById(courseId, lessonId),
    enabled: !!courseId && !!lessonId,
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: CreateLessonDto }) =>
      lessonsApi.createLesson(courseId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', data.courseId] });
    },
  });
};

export const useUpdateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, lessonId, data }: { courseId: number; lessonId: number; data: UpdateLessonDto }) =>
      lessonsApi.updateLesson(courseId, lessonId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', data.courseId] });
      queryClient.invalidateQueries({ queryKey: ['lesson', data.courseId, data.id] });
    },
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, lessonId }: { courseId: number; lessonId: number }) =>
      lessonsApi.deleteLesson(courseId, lessonId),
    onSuccess: (_, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ['lessons', courseId] });
    },
  });
};
