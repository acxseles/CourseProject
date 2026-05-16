import { apiClient } from './client';

export const enrollmentsApi = {
  // Запись на курс с оплатой
  enrollWithPayment: async (courseId: number, studentId: number): Promise<{ paymentUrl: string; enrollmentId: number }> => {
    const response = await apiClient.post('/enrollments/enroll-with-payment', { courseId, studentId });
    return response.data;
  },
  
  // Подтверждение оплаты и активация записи
  confirmPayment: async (enrollmentId: number, paymentId: string): Promise<void> => {
    await apiClient.post(`/enrollments/confirm-payment/${enrollmentId}`, { paymentId });
  },
  
  // Проверка статуса записи
  checkEnrollmentStatus: async (enrollmentId: number) => {
    const response = await apiClient.get(`/enrollments/status/${enrollmentId}`);
    return response.data;
  }
};