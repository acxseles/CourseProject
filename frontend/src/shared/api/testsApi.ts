import client from './client';
import type { 
  TestDto, 
  CreateTestDto, 
  SubmitTestDto,
  TestResultDto 
} from '@/shared/types';

export const testsApi = {
  // Получить тест для урока
  getTestForLesson: (lessonId: number) =>
    client.get<TestDto>(`/tests/lesson/${lessonId}`),

  // Создать тест (Teacher/Admin)
  createTest: (lessonId: number, data: CreateTestDto) =>
    client.post(`/tests/lesson/${lessonId}`, data),

  // Сдать тест (Student)
  submitTest: (assignmentId: number, data: SubmitTestDto) =>
    client.post<TestResultDto>(`/tests/${assignmentId}/submit`, data),

  // Получить результаты теста
  getTestResults: (assignmentId: number) =>
    client.get(`/tests/${assignmentId}/results`),
};