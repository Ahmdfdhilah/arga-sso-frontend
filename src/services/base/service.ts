import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { API_BASE_URL } from '@/lib/constants';


export class BaseService {
  protected api: AxiosInstance;
  protected basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use(
      (config) => {
        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const { refreshToken, setTokens, clearAuth } = useAuthStore.getState();

          if (refreshToken && !error.config._retry) {
            error.config._retry = true;
            try {
              // Gunakan API_BASE_URL yang sudah include /api/v1
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refresh_token: refreshToken,
                device_id: localStorage.getItem('arga-sso-device-id') || 'web',
              });

              const { access_token, refresh_token } = response.data.data;
              setTokens(access_token, refresh_token);
              error.config.headers.Authorization = `Bearer ${access_token}`;
              return this.api.request(error.config);
            } catch {
              clearAuth();
            }
          } else {
            clearAuth();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  protected async get<T>(path: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get(`${this.basePath}${path}`, { params, ...config });
    return response.data;
  }

  protected async post<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post(`${this.basePath}${path}`, data, config);
    return response.data;
  }

  protected async put<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put(`${this.basePath}${path}`, data, config);
    return response.data;
  }

  protected async patch<T>(path: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.patch(`${this.basePath}${path}`, data, config);
    return response.data;
  }

  protected async delete<T>(path: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete(`${this.basePath}${path}`, config);
    return response.data;
  }
}
