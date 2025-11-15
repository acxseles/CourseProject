import client from './client';
import type { AuthResponseDto, LoginDto, RegisterDto } from '../types';

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const response = await client.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await client.post('/auth/login', data);
    return response.data;
  },
};
