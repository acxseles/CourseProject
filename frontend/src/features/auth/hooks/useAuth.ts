import { useAuthStore } from '../model/authStore';

export const useAuth = () => {
  const { user, isLoading, error, login, register, logout, checkAuth } = useAuthStore();
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    checkAuth,
  };
};