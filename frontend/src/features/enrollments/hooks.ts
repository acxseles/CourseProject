import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '@/shared/api/enrollmentsApi';
import type { GetEnrollmentsParams } from '@/shared/api/enrollmentsApi';

export const useGetAllEnrollments = (params?: GetEnrollmentsParams) => {
  return useQuery({
    queryKey: ['enrollments', params],
    queryFn: () => enrollmentsApi.getAllEnrollments(params),
  });
};

export const useGetStudentEnrollments = (studentId: number, params?: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ['enrollments', 'student', studentId, params],
    queryFn: () => enrollmentsApi.getStudentEnrollments(studentId, params),
    enabled: studentId > 0,
  });
};

export const useGetCourseEnrollments = (courseId: number, params?: { page: number; pageSize: number }) => {
  return useQuery({
    queryKey: ['enrollments', 'course', courseId, params],
    queryFn: () => enrollmentsApi.getCourseEnrollments(courseId, params),
    enabled: courseId > 0,
  });
};

export const useEnrollStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, studentId }: { courseId: number; studentId: number }) =>
      enrollmentsApi.enrollStudent(courseId, studentId),
    onSuccess: (newEnrollment, { studentId }) => {
      // Get all cached student enrollment queries and add the new enrollment
      const cachedQueries = queryClient.getQueriesData({
        queryKey: ['enrollments', 'student', studentId],
        exact: false,
      });

      cachedQueries.forEach(([key, data]: any) => {
        if (data?.items) {
          queryClient.setQueryData(key, {
            ...data,
            items: [...data.items, newEnrollment],
            totalCount: (data.totalCount || 0) + 1,
          });
        }
      });
    },
  });
};

export const useCancelEnrollment = (studentId: number, options?: { onError?: () => void; onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: number) => enrollmentsApi.cancelEnrollment(enrollmentId),
    onSuccess: (_, enrollmentId) => {
      // Get all cached student enrollment queries and remove the deleted enrollment
      const cachedQueries = queryClient.getQueriesData({
        queryKey: ['enrollments', 'student', studentId],
        exact: false,
      });

      cachedQueries.forEach(([key, data]: any) => {
        if (data?.items) {
          queryClient.setQueryData(key, {
            ...data,
            items: data.items.filter((item: any) => item.id !== enrollmentId),
            totalCount: Math.max(0, (data.totalCount || 0) - 1),
          });
        }
      });

      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
};
