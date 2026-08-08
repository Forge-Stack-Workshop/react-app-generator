// Lightweight fetch wrapper — no external dependency.
// Response error handlers are contributed by features via hooks.generated.ts.
import { responseErrorHandlers } from "./hooks.generated";
import { onError, onRequest } from "./interceptors";

const BASE_URL = "{{apiBaseUrl}}";
const TIMEOUT = {{timeout}};

type RequestOptions = RequestInit & { timeout?: number };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { timeout = TIMEOUT, ...init } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(BASE_URL + path, {
      ...onRequest(path, init),
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });

    if (!res.ok) {
      const error = new Error(`HTTP ${res.status} — ${res.statusText}`) as Error & { status?: number };
      error.status = res.status;
      for (const handler of responseErrorHandlers) handler(error);
      throw error;
    }
    return res.json() as Promise<T>;
  } catch (error) {
    onError(error);
  } finally {
    clearTimeout(id);
  }
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "GET", ...options }),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body), ...options }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body), ...options }),
  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body), ...options }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...options }),
};
