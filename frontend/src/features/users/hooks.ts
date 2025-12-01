import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/shared/api/usersApi';
import type { PaginationParams } from '@/shared/types';

export const useGetAllUsers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAllUsers(params),
  });
};

export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
  });
};

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: () => usersApi.getUserProfile(),
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: number) => usersApi.deleteStudent(studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
