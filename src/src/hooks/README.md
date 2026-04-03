# Hooks

Ce dossier contient les **hooks transverses** ou génériques de l’application.
Un _hook_ est une fonction React qui commence par `use` et qui permet d’encapsuler de la **logique réutilisable** sans afficher d’UI.

## Rôle

- Encapsuler la logique React réutilisable (état, effets, comportements).
- Fournir des hooks pour récupérer des données (ex : `useTerritories`).
- Gérer des comportements globaux (ex : `useWebsocket`, `useAuth`).
- Simplifier les composants en déplaçant la logique hors de l’UI.
- Centraliser des patterns communs (pagination, filtres, stockage local…).

## Qu’est‑ce qu’un hook ?

Un hook est une fonction qui :

- commence par `use` (ex : `useMonitoring`, `useShuttles`),
- utilise les hooks React internes (`useState`, `useEffect`, etc.),
- ne retourne **pas** de JSX,
- ne sert qu’à gérer de la logique (pas d’affichage).

Exemple simple :

```ts
function useCounter() {
  const [count, setCount] = useState(0);
  return { count, setCount };
}
```

## Ce qu'on met ici

- Hooks de récupération de données (API + état local).
- Hooks de connexion temps réel (WebSocket).
- Hooks d’état global (si Zustand ou autre).
- Hooks utilitaires (debounce, pagination, stockage local).
- Hooks transverses utilisés dans plusieurs pages ou features.

## Ce qu’on ne met pas ici

- Pas de types métier (dans `domain/`).
- Pas de composants.
- Pas de logique pure (dans `domain/`).
