import axios, { AxiosInstance, AxiosError } from 'axios';
import { apiConfig } from '@/config/api.config';

let authToken: string | null = null;

/**
 * Set the authentication token for API requests
 */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

/**
 * Get the current authentication token
 */
export function getAuthToken(): string | null {
  return authToken;
}

/**
 * Create axios instance with default config
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor to add auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Store refresh token callback
 */
let refreshTokenCallback: (() => Promise<string | null>) | null = null;

/**
 * Set the refresh token callback
 */
export function setRefreshTokenCallback(callback: () => Promise<string | null>): void {
  refreshTokenCallback = callback;
}

/**
 * Response interceptor for error handling and token refresh
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest.headers['X-Retry']) {
      // Token expired - try to refresh
      if (refreshTokenCallback) {
        try {
          const newToken = await refreshTokenCallback();
          if (newToken) {
            setAuthToken(newToken);
            originalRequest.headers['X-Retry'] = 'true';
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      setAuthToken(null);
    }
    return Promise.reject(error);
  }
);

/**
 * Handle API errors and extract meaningful messages
 */
export function handleApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
