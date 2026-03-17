# HTTP Layer

Ce dossier contient la **couche transport** de l’application.  
Elle définit *comment* l’application communique avec une API (réelle ou mockée), sans aucune logique métier.

La couche HTTP est volontairement **faible**, **stateless**, et **remplaçable**.  
Elle ne connaît pas :
- les composants React
- les types métier
- les mappers
- les mocks
- les React Query hooks

Elle fournit uniquement :
- un **client HTTP** configuré (`client.ts`)
- des **interceptors** transversaux (`interceptors.ts`)

---

## Structure

```
 api/http/ client.ts # client HTTP unique (axios ou fetch wrapper) 
 api/http/ interceptors.ts # middlewares request/response
```
---

## Rôle de la couche HTTP

- Centraliser la configuration réseau
- Gérer les headers, tokens, cookies
- Gérer les erreurs globales
- Gérer les retries, timeouts, logs
- Offrir un point d’entrée unique pour toutes les requêtes API

Elle ne doit **jamais** contenir :
- de logique métier
- de mapping DTO → Domain
- de logique de cache
- de logique React Query

---

## Pourquoi cette séparation ?

- Permet de remplacer Axios par Fetch sans toucher au reste du projet
- Permet d’ajouter un token d’auth en un seul endroit
- Permet d’ajouter un retry global sans toucher aux services
- Permet de mocker l’API sans toucher au domain
- Permet de brancher une vraie API plus tard sans casser l’UI

---

## Flux complet

``` UI → Domain (React Query) → API Service → HTTP Client → Backend ```


La couche HTTP est **la plus basse** du système.  
Elle ne doit jamais remonter d’erreurs métier, seulement des erreurs réseau.
