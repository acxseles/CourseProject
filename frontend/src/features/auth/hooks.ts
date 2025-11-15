import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/shared/api';
import type { LoginDto, RegisterDto } from '@/shared/types';
import { useAuthStore } from './store';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginDto) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data);
      navigate('/dashboard');
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data);
      navigate('/dashboard');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    navigate('/');
  };
};

export const useAuth = () => {
  return useAuthStore();
};
