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
  allowed_apps: AllowedApp[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  ssoToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setTokens: (accessToken: string, refreshToken: string, ssoToken?: string) => void;
  setSSOToken: (ssoToken: string) => void;
  setUser: (user: AuthUser) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  ssoToken: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,

      setTokens: (accessToken, refreshToken, ssoToken) =>
        set({
          accessToken,
          refreshToken,
          ssoToken: ssoToken ?? null,
          isAuthenticated: true,
        }),

      setSSOToken: (ssoToken) =>
        set({ ssoToken }),

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
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
