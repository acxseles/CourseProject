import axios, { AxiosError } from 'axios';
import type { AxiosInstance } from 'axios';
import { tokenService } from './tokenService';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7106';

const client: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - добавляем токен
client.interceptors.request.use(
  (config) => {
    const token = tokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - обработка ошибок
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenService.removeToken();
      // Перенаправляем на логин
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default client;
