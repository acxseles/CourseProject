import client from './client';
import type { Course } from '@/shared/types';

export const importExportApi = {
  exportCoursePdf: async (courseId: number): Promise<Blob> => {
    const response = await client.get(`/import-export/export/course/${courseId}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  exportAllCoursesPdf: async (): Promise<Blob> => {
    const response = await client.get('/import-export/export/courses/pdf', {
      responseType: 'blob',
    });
    return response.data;
  },

  importCoursesFromExcel: async (file: File): Promise<Course[]> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await client.post('/import-export/import/courses/excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.courses || [];
  },
};
