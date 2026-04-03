---

# 📄 `api/http/interceptors.md`

```md
# interceptors.ts

Ce fichier contient les **interceptors HTTP** du client.

Les interceptors sont des middlewares appliqués :
- avant l’envoi d’une requête (request interceptor)
- après la réception d’une réponse (response interceptor)

Ils permettent d’ajouter des comportements transversaux **sans polluer les services API**.

---

## Objectifs

- Ajouter automatiquement un token JWT
- Ajouter des headers dynamiques
- Logger les requêtes/réponses
- Gérer les erreurs globales (401, 403, 500…)
- Rafraîchir un token expiré
- Retenter une requête échouée
- Uniformiser les erreurs réseau

---

## Exemple typique

```ts
import { client } from "./client";

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // refresh token ou redirection login
    }
    return Promise.reject(error);
  },
);
```

## Pourquoi séparer client et interceptors ?

- meilleure lisibilité
- meilleure testabilité
- meilleure modularité
- possibilité d’ajouter/supprimer des interceptors sans toucher au client
- éviter un fichier de 300 lignes

## Ce que interceptors.ts ne doit jamais contenir

- logique métier
- mapping DTO → Domain
- React Query
- mocks
