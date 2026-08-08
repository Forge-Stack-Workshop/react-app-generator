# Features (business UI)

This folder holds the **business UI components and logic**.
Each feature maps to a functional domain of the SaaS: territories, shuttles, providers, weather, real-time monitoring…

Features use:

- the types and rules from the `domain` folder,
- the data provided by hooks,
- the provider-agnostic UI components from the `components` folder.

## Role

- Group the business UI (lists, forms, panels, maps…).
- Organize code by functional domain.
- Connect business logic (`domain`) to the user interface.
- Provide reusable components for the pages.

## Recommended structure

Each feature may have:

- `FeatureComponent.tsx` (business UI)
- `FeatureForm.tsx`
- `FeatureList.tsx`
- `hooks/` (feature-specific React logic)
- `index.ts`

## Examples

- `features/territories/TerritoryList.tsx`
- `features/shuttles/ShuttleStatusBadge.tsx`
- `features/monitoring/MapView.tsx`

```tsx
import { Territory } from "../../domain/territories";

export function TerritoryList({ territories }: { territories: Territory[] }) {
  return (
    <ul>
      {territories.map((t) => (
        <li key={t.id}>{t.name}</li>
      ))}
    </ul>
  );
}
```

## What belongs here

- Business React components (e.g. `TerritoryList`, `ShuttleStatusBadge`).
- Business forms (e.g. `TerritoryForm`).
- Specific views (e.g. `MapView`, `AlertsPanel`).
- Feature-internal business hooks (e.g. `useTerritoryForm`).
- Per-domain subfolders (territories, shuttles, monitoring…).

## What does NOT belong here

- No business types (they go in `domain/`).
- No pure business logic (goes in `domain/`).
- No direct API calls (they go in `api/`).
- No generic UI components (they go in `components/`).
