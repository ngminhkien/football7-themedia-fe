import axios, { InternalAxiosRequestConfig } from 'axios';
import { clearAdminToken, getAdminToken } from '@/lib/auth';
import { parseApiError } from './errors';

const rawApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = rawApiUrl || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Bearer Token for Admin endpoints
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If request is directed to admin endpoints
    if (config.url?.startsWith('/api/admin') && !config.url.endsWith('/login')) {
      const token = getAdminToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(parseApiError(error))
);

// Response Interceptor: ProblemDetails Parsing & 401 Redirect
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = parseApiError(error);

    // Auto-logout & redirect on 401 for admin calls
    if (apiError.status === 401 && error.config?.url?.startsWith('/api/admin')) {
      clearAdminToken();
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }

    return Promise.reject(apiError);
  }
);
