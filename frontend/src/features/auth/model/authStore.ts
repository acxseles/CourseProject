import { create } from 'zustand';
import { apiClient } from '../../../shared/api/client';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isCheckingAuth: boolean; // ← добавить
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true, // ← начинаем с true
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/login', data);
      console.log('✅ Логин успешен:', response.data);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      set({ user: response.data.user, isLoading: false, isCheckingAuth: false });
    } catch (error: any) {
      console.error('❌ Ошибка логина:', error);
      set({ error: error.response?.data?.message || 'Ошибка входа', isLoading: false });
      throw error;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post('/auth/register', data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      set({ user: response.data.user, isLoading: false, isCheckingAuth: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Ошибка регистрации', isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, error: null, isCheckingAuth: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('🔍 checkAuth вызван, token:', !!token, 'userStr:', !!userStr);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('✅ Пользователь восстановлен:', user);
        set({ user, isLoading: false, isCheckingAuth: false });
      } catch (error) {
        console.error('❌ Ошибка парсинга user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, isLoading: false, isCheckingAuth: false });
      }
    } else {
      console.log('🔓 Пользователь не авторизован');
      set({ user: null, isLoading: false, isCheckingAuth: false });
    }
  },
}));