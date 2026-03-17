# api/

Contains **all HTTP communication** for the application.

## Structure

```
api/
├── http/          # Transport layer (client + interceptors)
└── mock/          # MSW handlers and fixture data (dev only)
```

## Rules

- Each file maps to one backend resource.
- Functions return raw API responses — mapping to domain types happens in `domain/`.
- **No React logic** — no hooks, no components, no JSX.
- **No business logic** — no conditions, no derived state.

## What goes here

- `[resource].ts` — fetch functions for a specific resource
- Mock handlers and fixture data (see `mock/`)

## What does NOT go here

- Components
- Business logic
- React Query hooks (those live in `domain/`)
