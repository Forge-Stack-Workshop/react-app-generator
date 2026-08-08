// Cross-cutting HTTP concerns: auth token injection, error logging, etc.
// Imported by client.ts to centralise side-effects outside the fetch wrapper.

export function onRequest(_path: string, init: RequestInit): RequestInit {
  // Example: attach auth header
  // const token = localStorage.getItem("token");
  // if (token) init.headers = { ...init.headers, Authorization: `Bearer ${token}` };
  return init;
}

export function onError(error: unknown): never {
  console.error("API error:", error);
  throw error;
}
