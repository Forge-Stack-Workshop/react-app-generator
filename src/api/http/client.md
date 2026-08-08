# client.ts

This file exposes the **single HTTP client** used across the whole application.

It encapsulates:

- the baseURL
- default headers
- the timeout
- cookies
- the serialization strategy
- interceptor integration

---

## Goal

Provide an HTTP client that is:

- centralized
- configurable
- stable
- independent of the rest of the code

---

## Typical content

```ts
import axios from "axios";

export const client = axios.create({
  baseURL: "/api",
  timeout: 8000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Why a single client?

- avoid duplicating configuration
- avoid scattered `axios.get()` calls throughout the code
- allow adding a token or global header in one place
- allow adding a global retry
- allow logging every request
- allow swapping the API without breaking the domain

## What client.ts must never contain

- business logic
- DTO → Domain mapping
- cache management
- React Query
- mocks
