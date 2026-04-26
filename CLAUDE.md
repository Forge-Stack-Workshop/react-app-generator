# CLAUDE.md — react-app-generator

## Role

Template React de référence pour l'écosystème chrysa / Forge-Stack-Workshop.
Ce repo est la **source de vérité** pour la structure et le stack de toutes les apps React de l'écosystème.

## Structure `src/`

```
src/
  api/          ← connecteur seul. 1 fichier/ressource. Types + fetch uniquement, pas de logique métier.
  components/   ← UI générique réutilisable. Pas de logique métier, pas d'appels API directs.
  domain/       ← types/interfaces domaine partagés à travers l'app.
  features/     ← tranches verticales auto-contenues (composants + logique propre à la feature).
  hooks/        ← hooks React personnalisés.
  i18n/         ← fichiers de traduction et configuration i18next.
  pages/        ← 1 fichier par route. Orchestre les features. Pas d'appels API directs.
  styles/       ← CSS/SCSS globaux, variables, reset.
  utils/        ← fonctions pures utilitaires (pas de React, pas d'effets).
```

## Stack

| Couche       | Outil                                         |
| ------------ | --------------------------------------------- |
| Bundler      | Vite 7                                        |
| Langage      | TypeScript 5 strict                           |
| UI           | React 19                                      |
| Routing      | React Router v7                               |
| Server state | TanStack React Query v5                       |
| HTTP         | native `fetch` (typed wrapper in `api/http/`) |
| Styles       | SCSS Modules + CSS variables                  |
| Linting      | ESLint 9 + typescript-eslint + Prettier       |
| Pre-commit   | pre-commit hooks                              |

## Règles de code

- Utiliser `useQuery`/`useMutation` (React Query) pour tous les appels serveur. **Jamais** `useEffect` pour du data fetching.
- `api/` = couche connecteur pur. Agnostique du provider (peut être remplacé par MSW ou un autre backend).
- `pages/` orchestre, ne fetch pas directement.
- `features/` = isolation verticale. Une feature n'importe pas depuis une autre feature.

## Scaffolder

```bash
node scaffold.mjs   # génère un nouveau projet depuis ce template
```

Le CLI demande : nom du projet, répertoire de sortie, package manager, features à activer.

## CI / Standards

- CI workflow : `.github/workflows/ci.yml`
- SonarCloud activé (voir badges README)
- pre-commit : `.pre-commit-config.yaml`
- Versioning automatique : GitVersion (`GitVersion.yml`)

## Issues ouvertes

- #22 : feat — intégrer les chrysa CI standards (github-actions composite actions)
