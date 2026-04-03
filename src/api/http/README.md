# api/http/

The **transport layer** of the application. Defines _how_ the app communicates with an API (real or mocked), with no business logic.

## Files

| File              | Role                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| `client.ts`       | Typed `fetch` wrapper with timeout, JSON parsing and HTTP error handling |
| `interceptors.ts` | Hooks for auth token injection and error logging                         |

## Responsibilities

- Configure network settings (base URL, timeout, headers)
- Attach auth tokens / cookies
- Handle global errors (network failures, 401, 503…)
- Provide a single entry point for all outgoing requests

## What this layer does NOT know about

- React components or hooks
- Business types or mappers
- React Query cache
- Mock data

## Why this separation?

- Swap Axios for native `fetch` without touching the rest of the codebase
- Add auth tokens in **one place**
- Add global retry logic without modifying individual queries
- Mock the API without touching the domain layer

## Request flow

```
UI → domain (React Query) → api/http (client) → Backend
```

This is the **lowest layer** in the stack. It should only surface network errors, never business errors.
