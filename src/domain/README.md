# Domain (business logic)

This folder holds the **business logic** of the application.
It gathers everything that describes _what_ a business entity is (territory, shuttle, provider…), independent of the UI or React.

The domain represents the **business truth**: types, rules, validations, and transformations.

## Role

- Define business types (e.g. `Territory`, `Shuttle`, `Provider`).
- Define business rules (e.g. `canDeactivate`, `isCriticalAlert`).
- Map API data to internal types (DTO → model).
- Centralize pure logic, independent of React.
- Provide a stable base used by features, hooks, and pages.

## What belongs here

- Business types and interfaces.
- Business rules (conditions, statuses, validations).
- Mappers (transformations between API and domain).
- Business utility functions (e.g. computations, derived statuses).

## Examples

- `territories.ts`
- `shuttles.ts`
- `providers.ts`
- `weather.ts`
- `monitoring.ts`

```ts
export type Territory = {
  id: string;
  name: string;
  providerId: string;
  status: "ACTIVE" | "INACTIVE";
};

export function canDeactivate(territory: Territory) {
  return territory.status === "ACTIVE";
}
```

## What does NOT belong here

- No React components.
- No hooks.
- No API calls (they go in `api/`).
- No display logic.
- No CSS or styles.
