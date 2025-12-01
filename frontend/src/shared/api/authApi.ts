import client from './client';
import type { AuthResponseDto, LoginDto, RegisterDto } from '../types';

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    // Backend expects PascalCase
    const payload = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    };
    const response = await client.post('/auth/register', payload);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const response = await client.post('/auth/login', data);
    return response.data;
  },
};
