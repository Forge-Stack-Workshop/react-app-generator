# Features (UI métier)

Ce dossier contient les **composants et la logique UI métier**. 
Chaque feature correspond à un domaine fonctionnel du SaaS : territoires, navettes, providers, météo, monitoring temps réel…

Les features utilisent :
- les types et règles du dossier `domain`,
- les données fournies par les hooks,
- les composants UI agnostiques du dossier `components`.


## Rôle
- Regrouper l’UI métier (listes, formulaires, panneaux, cartes…).
- Organiser le code par domaine fonctionnel.
- Connecter le métier (`domain`) à l’interface utilisateur.
- Fournir des composants réutilisables dans les pages.

## Structure recommandée
Chaque feature peut avoir :
- `FeatureComponent.tsx` (UI métier)
- `FeatureForm.tsx`
- `FeatureList.tsx`
- `hooks/` (logique React métier)
- `index.ts`

## Exemples
- `features/territories/TerritoryList.tsx`
- `features/shuttles/ShuttleStatusBadge.tsx`
- `features/monitoring/MapView.tsx`

```tsx
import { Territory } from "../../domain/territories";

export function TerritoryList({ territories }: { territories: Territory[] }) {
  return (
    <ul>
      {territories.map(t => (
        <li key={t.id}>{t.name}</li>
      ))}
    </ul>
  );
}
```

## Ce qu’on met ici
- Composants React métier (ex : `TerritoryList`, `ShuttleStatusBadge`).
- Formulaires métier (ex : `TerritoryForm`).
- Vues spécifiques (ex : `MapView`, `AlertsPanel`).
- Hooks métier internes à la feature (ex : `useTerritoryForm`).
- Sous‑dossiers par domaine (territories, shuttles, monitoring…).

## Ce qu’on ne met pas ici
- Pas de types métier (dans `domain/`).
- Pas de logique métier pure (dans `domain/`).
- Pas d’appels API directs (dans `api/`).
- Pas de composants UI génériques (dans `components/`).


