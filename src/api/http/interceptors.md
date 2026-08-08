# interceptors.ts

This file contains the client's **HTTP interceptors**.

Interceptors are middlewares applied:

- before a request is sent (request interceptor)
- after a response is received (response interceptor)

They add cross-cutting behaviors **without polluting the API services**.

---

## Goals

- Automatically attach a JWT token
- Add dynamic headers
- Log requests/responses
- Handle global errors (401, 403, 500…)
- Refresh an expired token
- Retry a failed request
- Normalize network errors

---

## Typical example

```ts
import { client } from "./client";

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // refresh token or redirect to login
    }
    return Promise.reject(error);
  },
);
```

## Why separate client and interceptors?

- better readability
- better testability
- better modularity
- ability to add/remove interceptors without touching the client
- avoid a 300-line file

## What interceptors.ts must never contain

- business logic
- DTO → Domain mapping
- React Query
- mocks
