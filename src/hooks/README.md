# Hooks

This folder holds the **cross-cutting** or generic hooks of the application.
A _hook_ is a React function starting with `use` that encapsulates **reusable logic** without rendering UI.

## Role

- Encapsulate reusable React logic (state, effects, behaviors).
- Provide hooks to fetch data (e.g. `useTerritories`).
- Handle global behaviors (e.g. `useWebsocket`, `useAuth`).
- Simplify components by moving logic out of the UI.
- Centralize common patterns (pagination, filters, local storage…).

## What is a hook?

A hook is a function that:

- starts with `use` (e.g. `useMonitoring`, `useShuttles`),
- uses React's built-in hooks (`useState`, `useEffect`, etc.),
- does **not** return JSX,
- only manages logic (no rendering).

Simple example:

```ts
function useCounter() {
  const [count, setCount] = useState(0);
  return { count, setCount };
}
```

## What belongs here

- Data-fetching hooks (API + local state).
- Real-time connection hooks (WebSocket).
- Global state hooks (if Zustand or another store).
- Utility hooks (debounce, pagination, local storage).
- Cross-cutting hooks used across several pages or features.

## What does NOT belong here

- No business types (they go in `domain/`).
- No components.
- No pure logic (goes in `domain/`).
