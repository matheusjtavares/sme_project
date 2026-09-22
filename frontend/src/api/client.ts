import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "@/auth/tokens";
import type { RefreshResponse } from "@/types/auth";

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

// The API base URL is baked in at build time via VITE_API_URL (e.g. the
// backend's Render URL, https://your-backend.onrender.com/api). In local
// development it falls back to the relative "/api", which the Vite dev
// server proxies to the Django backend.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "/api";

// Dev/validation scaffold: JWT tokens live in localStorage (XSS-exposed).
// A production design would use HTTP-only cookies + a rotation strategy.
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const access = getAccessToken();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refresh = getRefreshToken();
      if (!refresh) return null;

      try {
        const { data } = await axios.post<RefreshResponse>(
          `${API_BASE_URL}/auth/token/refresh/`,
          { refresh },
        );
        setTokens(data.access, data.refresh ?? null);
        return data.access;
      } catch {
        clearTokens();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const authFlowUrl = original?.url?.startsWith("/auth/");
    const shouldRefresh = error.response?.status === 401 && !authFlowUrl;

    if (original && !original._retry && shouldRefresh) {
      original._retry = true;

      const access = await refreshAccessToken();
      if (access) {
        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      }

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;