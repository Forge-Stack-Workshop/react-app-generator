# Pages

This folder holds **all back-office pages**.
Each file represents an application route (e.g. `/territories`, `/monitoring`).

## Role

- Define the screen structure.
- Assemble business components (features) and provider-agnostic UI components.
- Use hooks to fetch data.

## What belongs here

- `MonitoringPage.tsx`
- `TerritoriesPage.tsx`
- `ShuttlesPage.tsx`
- `ProvidersPage.tsx`
- `WeatherPage.tsx`

## What does NOT belong here

- No business logic.
- No direct API calls.
- No reusable components.
