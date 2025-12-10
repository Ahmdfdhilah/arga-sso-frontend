import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService } from '@/services/users';
import { handleApiError } from '@/services/base/utils';
import type { ApiResponse, PaginatedApiResponse, PaginationParams } from '@/services/base/types';
import type {
  UserCreateRequest,
  UserUpdateRequest,
  UserResponse,
  UserListItemResponse,
  UserFilterParams,
} from '@/services/users/types';

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (filters: PaginationParams & UserFilterParams) => [...usersKeys.lists(), filters] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
  me: () => [...usersKeys.all, 'me'] as const,
};

export const useMyProfile = (
  options?: Omit<UseQueryOptions<ApiResponse<UserResponse>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: usersKeys.me(),
    queryFn: () => usersService.getMyProfile(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useUser = (
  userId: string | null,
  options?: Omit<UseQueryOptions<ApiResponse<UserResponse>, Error>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery({
    queryKey: usersKeys.detail(userId!),
    queryFn: () => usersService.getUser(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useUsers = (
  filters: PaginationParams & UserFilterParams,
  options?: Omit<UseQueryOptions<PaginatedApiResponse<UserListItemResponse>, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: usersKeys.list(filters),
    queryFn: () => usersService.getUsers(filters),
    staleTime: 30 * 1000,
    ...options,
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdateRequest) => usersService.updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.me() });
      toast.success('Profil berhasil diperbarui');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserCreateRequest) => usersService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      toast.success('User berhasil dibuat');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UserUpdateRequest }) =>
      usersService.updateUser(userId, data),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(variables.userId) });
      toast.success('User berhasil diperbarui');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersService.deleteUser(userId),
    onSuccess: (_response, userId) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
      queryClient.invalidateQueries({ queryKey: usersKeys.detail(userId) });
      toast.success('User berhasil dihapus');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};
