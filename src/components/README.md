# components/

Generic, **business-agnostic** UI components. They form the internal design system of the application.

## Structure

```
components/
├── cards/        # Generic card wrappers (KpiCard, MapCard…)
├── charts/       # Chart primitives (donut, bar, gauge…)
├── filters/      # Input controls (SearchBar…)
├── languages/    # Language switcher (i18n feature)
├── layouts/      # Layout shells (Layout, Header, Sidebar)
├── loaders/      # Full-screen loading states
├── skeletons/    # Skeleton placeholders for async content
└── ui/           # Atomic primitives (Skeleton, Button…)
```

## Rules

- Components here must be **reusable across any page or feature**.
- They receive data via props — they do not fetch or hold server state.
- **No business logic** — no domain types, no API calls.
- Style with SCSS Modules (`.module.scss` alongside each component).

## What does NOT go here

- Business-specific components (those go in `features/`)
- Domain types or logic (those go in `domain/`)
- API calls or React Query hooks
