import client from './client';
import type { PagedResponse, PaginationParams } from '@/shared/types';

export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  enrollmentDate?: string;
  enrolledAt?: string;
  courseTitle?: string;
  courseName?: string;
  studentName?: string;
  status?: string;
}

export interface GetEnrollmentsParams extends PaginationParams {
  studentId?: number;
  courseId?: number;
}

export const enrollmentsApi = {
  getAllEnrollments: async (params?: GetEnrollmentsParams): Promise<PagedResponse<Enrollment>> => {
    const response = await client.get('/enrollments', { params });
    return response.data;
  },

  getStudentEnrollments: async (studentId: number, params?: PaginationParams): Promise<PagedResponse<Enrollment>> => {
    const response = await client.get(`/enrollments/student/${studentId}`, { params });
    // Backend returns array, convert to PagedResponse format
    let items = Array.isArray(response.data) ? response.data : response.data.items || [];
    // Filter out dropped enrollments
    items = items.filter((item: Enrollment) => item.status !== 'Dropped');
    return {
      items,
      totalCount: items.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || items.length,
    };
  },

  getCourseEnrollments: async (courseId: number, params?: PaginationParams): Promise<PagedResponse<Enrollment>> => {
    const response = await client.get(`/enrollments/course/${courseId}`, { params });
    // Backend returns array, convert to PagedResponse format
    const items = Array.isArray(response.data) ? response.data : response.data.items || [];
    return {
      items,
      totalCount: items.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || items.length,
    };
  },

  enrollStudent: async (courseId: number, studentId: number): Promise<Enrollment> => {
    const response = await client.post('/enrollments', { courseId, studentId });
    return response.data;
  },

  cancelEnrollment: async (enrollmentId: number): Promise<void> => {
    await client.delete(`/enrollments/${enrollmentId}`);
  },
};
