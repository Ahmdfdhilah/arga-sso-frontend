import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '@/services/auth';
import { useAuthStore } from '@/stores/authStore';
import { handleApiError } from '@/services/base/utils';
import type { ApiResponse } from '@/services/base/types';
import type {
  EmailPasswordLoginRequest,
  FirebaseLoginRequest,
  RefreshTokenRequest,
  SSOTokenExchangeRequest,
  UserData,
  SessionsResponse,
} from '@/services/auth/types';

export const authKeys = {
  all: ['auth'] as const,
  validate: () => [...authKeys.all, 'validate'] as const,
  sessions: () => [...authKeys.all, 'sessions'] as const,
};

export const useValidateToken = (
  options?: Omit<UseQueryOptions<ApiResponse<UserData>, Error>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.validate(),
    queryFn: () => authService.validateToken(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useSessions = (
  options?: Omit<UseQueryOptions<ApiResponse<SessionsResponse>, Error>, 'queryKey' | 'queryFn'>
) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.sessions(),
    queryFn: () => authService.getSessions(),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    ...options,
  });
};

export const useLoginEmail = () => {
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: EmailPasswordLoginRequest) => authService.loginWithEmail(data),
    onSuccess: (response) => {
      const { sso_token, access_token, refresh_token, user } = response.data;
      if (access_token && refresh_token) {
        setTokens(access_token, refresh_token, sso_token);
      }
      setUser(user);
      toast.success('Login berhasil');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useLoginFirebase = () => {
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: FirebaseLoginRequest) => authService.loginWithFirebase(data),
    onSuccess: (response) => {
      const { sso_token, access_token, refresh_token, user } = response.data;
      if (access_token && refresh_token) {
        setTokens(access_token, refresh_token, sso_token);
      }
      setUser(user);
      toast.success('Login berhasil');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useRefreshToken = () => {
  const { setTokens } = useAuthStore();

  return useMutation({
    mutationFn: (data: RefreshTokenRequest) => authService.refreshToken(data),
    onSuccess: (response) => {
      const { access_token, refresh_token } = response.data;
      setTokens(access_token, refresh_token);
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useExchangeSSO = () => {
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: SSOTokenExchangeRequest) => authService.exchangeSSOToken(data),
    onSuccess: (response) => {
      const { sso_token, access_token, refresh_token, user } = response.data;
      if (access_token && refresh_token) {
        setTokens(access_token, refresh_token, sso_token);
      }
      setUser(user);
      toast.success('Token exchange berhasil');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: () => authService.logoutGlobal(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      toast.success('Logout berhasil');
    },
    onError: (error) => {
      clearAuth();
      queryClient.clear();
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};

export const useLogoutFromClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, deviceId }: { clientId: string; deviceId?: string }) =>
      authService.logoutFromClient(clientId, deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
      toast.success('Logout dari aplikasi berhasil');
    },
    onError: (error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.message);
    },
  });
};
