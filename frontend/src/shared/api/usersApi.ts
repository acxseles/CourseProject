import client from './client';
import type { User, PagedResponse, PaginationParams } from '@/shared/types';

export const usersApi = {
  getAllUsers: async (params?: PaginationParams): Promise<PagedResponse<User>> => {
    const response = await client.get('/users', { params });
    return response.data;
  },

  getUserById: async (id: number): Promise<User> => {
    const response = await client.get(`/users/${id}`);
    return response.data;
  },

  getUserProfile: async (): Promise<User> => {
    const response = await client.get('/users/profile');
    return response.data;
  },

  deleteStudent: async (studentId: number): Promise<void> => {
    await client.delete(`/users/student/${studentId}`);
  },
};
