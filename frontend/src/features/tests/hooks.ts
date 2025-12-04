import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { testsApi } from '@/shared/api';
import type { SubmitTestDto } from '@/shared/types';

export const useGetTestsForCourse = (courseId: number) => {
  return useQuery({
    queryKey: ['tests-course', courseId],
    queryFn: async () => {
      const response = await testsApi.getTestsForCourse(courseId);
      return response.data;
    },
    enabled: courseId > 0,
  });
};

export const useGetTestForLesson = (lessonId: number) => {
  return useQuery({
    queryKey: ['tests', lessonId],
    queryFn: async () => {
      const response = await testsApi.getTestForLesson(lessonId);
      return response.data;
    },
    enabled: lessonId > 0,
  });
};

export const useSubmitTest = (options?: { onSuccess?: (data: any) => void; onError?: () => void }) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ assignmentId, data }: { assignmentId: number; data: SubmitTestDto }) => {
      const response = await testsApi.submitTest(assignmentId, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      options?.onSuccess?.(data);
    },
    onError: () => {
      options?.onError?.();
    },
  });
};

export const useGetTestResults = (assignmentId: number) => {
  return useQuery({
    queryKey: ['test-results', assignmentId],
    queryFn: async () => {
      const response = await testsApi.getTestResults(assignmentId);
      return response.data;
    },
    enabled: assignmentId > 0,
  });
};
