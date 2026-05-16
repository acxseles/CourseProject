import { apiClient } from './client';

export interface Course {
  id: number;
  title: string;
  level: string;
  description: string;
  duration: string;
  price: number;
  teacherId: number;
  teacherName?: string;
  image?: string;
  isEnrolled?: boolean;
}

// Добавь этот интерфейс
export interface CoursesResponse {
  items: Course[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const coursesApi = {
 getAll: async (): Promise<CoursesResponse> => {
  console.log('API запрос: GET /courses');
  const response = await apiClient.get('/courses');
  console.log('Ответ сервера:', response.data);
  return response.data;
},
  
  getMyCourses: async (): Promise<CoursesResponse> => {
    const response = await apiClient.get('/courses/my');
    return response.data;
  },
  
  enroll: async (courseId: number): Promise<void> => {
    await apiClient.post(`/courses/${courseId}/enroll`);
  },
};