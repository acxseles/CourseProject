import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesApi } from '@/shared/api/coursesApi';
import type { GetCoursesParams } from '@/shared/api/coursesApi';
import type { Course } from '@/shared/types';

export const useGetCourses = (params: GetCoursesParams, options?: { scope?: 'all' | 'teacher' }) => {
  const scope = options?.scope || 'all';
  return useQuery({
    queryKey: ['courses', scope, params],
    queryFn: () => coursesApi.getAllCourses(params),
  });
};

export const useGetCourseById = (id: number) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.getCourseById(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Course, 'id' | 'teacherName' | 'createdAt'>) =>
      coursesApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Course> }) =>
      coursesApi.updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => coursesApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
};
