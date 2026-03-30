# Domain (métier)

Ce dossier contient la **logique métier** de l’application.
Il regroupe tout ce qui décrit _ce qu’est_ une entité métier (territoire, navette, provider…), indépendamment de l’UI ou de React.

Le domaine représente la **vérité métier** : les types, les règles, les validations et les transformations.

## Rôle

- Définir les types métier (ex : `Territory`, `Shuttle`, `Provider`).
- Définir les règles métier (ex : `canDeactivate`, `isCriticalAlert`).
- Mapper les données API vers les types internes (DTO → modèle).
- Centraliser la logique pure, indépendante de React.
- Fournir une base stable utilisée par les features, les hooks et les pages.

## Ce qu’on met ici

- Types et interfaces métier.
- Règles métier (conditions, statuts, validations).
- Mappers (transformations entre API et domaine).
- Fonctions utilitaires métier (ex : calculs, statuts dérivés).

## Exemples

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

## Ce qu’on ne met pas ici

- Pas de composants React.
- Pas de hooks.
- Pas d’appels API (dans `api/`).
- Pas de logique d’affichage.
- Pas de CSS ou styles.
