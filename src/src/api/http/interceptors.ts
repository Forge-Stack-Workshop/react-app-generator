// @ts-nocheck
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

export function setupInterceptors(http: AxiosInstance) {
  http.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Exemple : ajouter un token plus tard
      // config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error: unknown) => Promise.reject(error),
  );

  http.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: unknown) => {
      console.error("API error:", error);
      return Promise.reject(error);
    },
  );
}
