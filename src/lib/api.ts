import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import type { RefreshResponse } from "../types/api";

/* ---------- Storage Keys ---------- */
export const STORAGE_KEYS = {
  ACCESS_TOKEN:  "dd_access_token",
  REFRESH_TOKEN: "dd_refresh_token",
  USER:          "dd_user",
  THEME:         "dd_theme",
} as const;

/* ---------- Token Helpers ---------- */
export const getAccessToken  = () => localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
export const getRefreshToken = () => localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

export const setTokens = (accessToken: string, refreshToken: string) => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

/* ---------- Axios Instance ---------- */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

/* ---------- Request Interceptor — attach access token ---------- */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- Response Interceptor — transparent token refresh ---------- */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject:  (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post<RefreshResponse>(
        `${import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"}/auth/refresh`,
        { refreshToken },
      );
      setTokens(data.accessToken, data.refreshToken);
      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
