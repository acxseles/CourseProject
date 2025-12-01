import client from './client';
import type { Course, PagedResponse, PaginationParams } from '@/shared/types';

export interface GetCoursesParams extends PaginationParams {
  search?: string;
  level?: string;
}

export const coursesApi = {
  getAllCourses: async (params: GetCoursesParams): Promise<PagedResponse<Course>> => {
    const response = await client.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (id: number): Promise<Course> => {
    const response = await client.get(`/courses/${id}`);
    return response.data;
  },

  createCourse: async (data: Omit<Course, 'id' | 'teacherName' | 'createdAt'>): Promise<Course> => {
    const response = await client.post('/courses', data);
    return response.data;
  },

  updateCourse: async (id: number, data: Partial<Course>): Promise<Course> => {
    const response = await client.put(`/courses/${id}`, data);
    return response.data;
  },

  deleteCourse: async (id: number): Promise<void> => {
    await client.delete(`/courses/${id}`);
  },
};
