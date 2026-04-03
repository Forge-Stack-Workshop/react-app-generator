# client.ts

Ce fichier expose le **client HTTP unique** utilisé par toute l’application.

Il encapsule :

- la baseURL
- les headers par défaut
- le timeout
- les cookies
- la stratégie de sérialisation
- l’intégration des interceptors

---

## Objectif

Fournir un client HTTP :

- centralisé
- configurable
- stable
- indépendant du reste du code

---

## Contenu typique

```ts
import axios from "axios";

export const client = axios.create({
  baseURL: "/api",
  timeout: 8000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Pourquoi un client unique ?

- éviter la duplication de configuration
- éviter les axios.get() dispersés dans le code
- permettre d’ajouter un token ou un header global en un seul endroit
- permettre d’ajouter un retry global
- permettre de logger toutes les requêtes
- permettre de changer d’API sans casser le domain

## Ce que client.ts ne doit jamais contenir

- logique métier
- mapping DTO → Domain
- gestion du cache
- React Query
- mocks
