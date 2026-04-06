import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { tokenStore } from './token';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // required for HttpOnly refresh_token cookie
});

// ─── Request interceptor ─────────────────────────────────────────────────────
// Attach the current access token to every outbound request.
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — automatic token refresh ──────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

function processQueue(newToken: string) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    const is401 = error.response?.status === 401;
    const hasToken = !!tokenStore.get();
    const alreadyRetried = originalRequest._retry as boolean | undefined;

    if (!is401 || !hasToken || alreadyRetried) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Queue this request until refresh completes.
      return new Promise((resolve, reject) => {
        refreshQueue.push((newToken: string) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
        // If refresh ultimately fails, reject queued requests.
        refreshQueue.push(() => reject(error));
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post<{ data: { accessToken: string } }>(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const newToken = data.data.accessToken;
      tokenStore.set(newToken);
      processQueue(newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      tokenStore.clear();
      refreshQueue = [];
      // Redirect to login — only safe in browser context.
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
