import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from './types';

export interface ParsedApiError {
  message: string;
  detail?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export function handleApiError(error: unknown): ParsedApiError {
  if (!error) {
    return { message: 'Terjadi kesalahan tidak diketahui' };
  }

  const axiosError = error as AxiosError<ApiErrorResponse>;

  if (axiosError.response?.data) {
    const data = axiosError.response.data;
    return {
      message: data.message || 'Terjadi kesalahan pada server',
      detail: data.detail,
      errors: data.errors,
      status: axiosError.response.status,
    };
  }

  if (axiosError.message) {
    if (axiosError.message === 'Network Error') {
      return { message: 'Tidak dapat terhubung ke server' };
    }
    return { message: axiosError.message };
  }

  return { message: 'Terjadi kesalahan tidak diketahui' };
}
