# Pages

Ce dossier contient **toutes les pages du back-office**.  
Chaque fichier représente une route de l’application (ex : `/territories`, `/monitoring`).

## Rôle
- Définir la structure des écrans.
- Assembler les composants métier (features) et les composants UI agnostiques.
- Utiliser les hooks pour récupérer les données.

## Ce qu’on met ici
- `MonitoringPage.tsx`
- `TerritoriesPage.tsx`
- `ShuttlesPage.tsx`
- `ProvidersPage.tsx`
- `WeatherPage.tsx`

## Ce qu’on ne met pas ici
- Pas de logique métier.
- Pas d’appels API directs.
- Pas de composants réutilisables.
