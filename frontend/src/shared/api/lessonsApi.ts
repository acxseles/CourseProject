import client from './client';
import type { Lesson, CreateLessonDto, UpdateLessonDto } from '@/shared/types';

export const lessonsApi = {
  getLessonsByCourse: async (courseId: number): Promise<Lesson[]> => {
    const response = await client.get(`/courses/${courseId}/lessons`);
    return response.data;
  },

  getLessonById: async (courseId: number, lessonId: number): Promise<Lesson> => {
    const response = await client.get(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  },

  createLesson: async (courseId: number, data: CreateLessonDto): Promise<Lesson> => {
    const response = await client.post(`/courses/${courseId}/lessons`, data);
    return response.data;
  },

  updateLesson: async (courseId: number, lessonId: number, data: UpdateLessonDto): Promise<Lesson> => {
    const response = await client.put(`/courses/${courseId}/lessons/${lessonId}`, data);
    return response.data;
  },

  deleteLesson: async (courseId: number, lessonId: number): Promise<void> => {
    await client.delete(`/courses/${courseId}/lessons/${lessonId}`);
  },
};
