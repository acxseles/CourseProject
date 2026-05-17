import { apiClient } from './client';

export const enrollmentsApi = {
  // Запись на курс с оплатой
  enrollWithPayment: async (courseId: number): Promise<{ paymentUrl: string; enrollmentId: number }> => {
    const response = await apiClient.post('/payment/create', { courseId });
    return response.data;
  },
  
  // Проверка статуса оплаты
  checkPaymentStatus: async (enrollmentId: number) => {
    const response = await apiClient.get(`/payment/status/${enrollmentId}`);
    return response.data;
  }
};