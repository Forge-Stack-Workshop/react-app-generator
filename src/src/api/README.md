# API

Ce dossier contient **tous les appels API** du back-office.
Chaque fichier correspond à une ressource backend (territories, shuttles…).

## Rôle

- Centraliser les appels HTTP.
- Mapper les réponses API vers les types du domaine.
- Ne jamais contenir de logique React.

## Exemples

- `territories.ts`
- `shuttles.ts`
- `providers.ts`
- `weather.ts`
- `monitoring.ts`

## Ce qu’on ne met pas ici

- Pas de composants.
- Pas de logique métier.
- Pas de hooks.
