import { create } from 'zustand';
import type { User, AuthResponseDto } from '@/shared/types';
import { tokenService } from '@/shared/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponseDto) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initializeAuth: () => void;
}

// Initialize auth state from localStorage immediately
const getInitialState = () => {
  const token = tokenService.getToken();
  const user = tokenService.getUser();
  return {
    user: user || null,
    token: token || null,
    isLoading: false,
    isAuthenticated: !!(token && user),
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),

  setAuth: (data: AuthResponseDto) => {
    tokenService.saveToken(data.token);
    tokenService.saveUser(data.user);
    set({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    tokenService.removeToken();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setUser: (user: User) => {
    tokenService.saveUser(user);
    set({ user });
  },

  initializeAuth: () => {
    const token = tokenService.getToken();
    const user = tokenService.getUser();
    if (token && user) {
      set({
        token,
        user,
        isAuthenticated: true,
      });
    }
  },
}));
