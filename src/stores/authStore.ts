import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AllowedApp {
  id: string;
  code: string;
  name: string;
}

export interface AuthUser {
  id: string;
  role: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  allowed_apps: AllowedApp[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  ssoToken: string | null;
  deviceId: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string, ssoToken?: string, deviceId?: string) => void;
  setSSOToken: (ssoToken: string) => void;
  setDeviceId: (deviceId: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  ssoToken: null,
  deviceId: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setTokens: (accessToken, refreshToken, ssoToken, deviceId) =>
        set((state) => ({
          accessToken,
          refreshToken,
          ssoToken: ssoToken ?? state.ssoToken,
          deviceId: deviceId ?? state.deviceId,
          isAuthenticated: true,
        })),

      setSSOToken: (ssoToken) =>
        set({ ssoToken }),

      setDeviceId: (deviceId) =>
        set({ deviceId }),

      setUser: (user) =>
        set({ user }),

      clearAuth: () =>
        set(initialState),
    }),
    {
      name: 'arga-sso-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        ssoToken: state.ssoToken,
        deviceId: state.deviceId,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

