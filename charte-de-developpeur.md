# Charte de Développeur
## Système de Gestion de Tickets d'Incident

> **Projet :** Module de gestion de tickets pour service informatique  
> **Stack :** Angular · Express.js · SQLite · Swagger  
> **Version :** 1.0.0

---

## 1. Introduction

Ce document définit les règles, conventions et bonnes pratiques à respecter par tous les membres de l'équipe de développement. Son objectif est d'assurer la cohérence, la maintenabilité et la qualité du code tout au long du projet.

Tout contributeur au projet s'engage à respecter les règles décrites dans cette charte.

---

## 2. Structure du Projet

```
/
├── frontend/                   # Application Angular
│
├── backend/                    # API Express.js
│   
├── README.md
└── CHARTE_DEVELOPPEUR.md
```

---

## 3. Conventions de Nommage

### 3.1 Global

| Élément | Convention | Exemple |
|---|---|---|
| Variables | camelCase | `ticketStatus` |
| Fonctions / Méthodes | camelCase | `getTicketById()` |
| Classes | PascalCase | `TicketService` |
| Fichiers | kebab-case | `ticket-list.component.ts` |
| Interfaces TypeScript | PascalCase préfixé `I` | `ITicket`, `IUser` |
| Enums | PascalCase | `TicketStatus` |
| Tables SQLite | snake_case (pluriel) | `tickets`, `users` |
| Colonnes SQLite | snake_case | `created_at`, `assigned_to` |

### 3.2 Angular

- Les **composants** suivent la convention `feature-name.component.ts`
- Les **services** : `feature-name.service.ts`
- Les **guards** : `feature-name.guard.ts`
- Les **modules** : `feature-name.module.ts`
- Les **sélecteurs** de composant : `app-feature-name`

### 3.3 Express / Node

- Les **routes** sont organisées par ressource : `tickets.routes.ts`, `users.routes.ts`
- Les **controllers** correspondent aux ressources : `tickets.controller.ts`
- Les **middlewares** décrivent leur rôle : `auth.middleware.ts`, `validate.middleware.ts`

---

## 4. Git & Workflow

### 4.1 Branches

Le projet suit ce modèle :

| Branche | Rôle |
|---|---|
| `main` | Code en production, stable |
| `feature/nom-developpeur-nombre` | Code en dev, à tester |

### 4.2 Commits

Les messages de commit suivent la convention **Conventional Commits** :

```
<feature/nom-developpeur-nombre>: <description courte>
```

### 4.3 Règles Git

- Aucun push direct sur `main`
- Toute modification passe par une **Pull Request (PR)**
- Une PR doit être relue par au moins **1 autre développeur** avant merge
- Les conflits doivent être résolus par l'auteur de la branche
- Supprimer les branches mergées après intégration

---

## 5. Standards de Code

### 5.1 Général

- Indentation : **2 espaces** ( tabulations)
- Encodage des fichiers : **UTF-8**
- Un fichier = une responsabilité (principe de responsabilité unique)
- Éviter les blocs de code commentés dans les commits finaux

### 5.2 TypeScript (Frontend & Backend)

- Toujours typer explicitement les paramètres et retours de fonctions
- Préférer `const` à `let`, éviter `var`
- Utiliser les `async/await` plutôt que les callbacks ou `.then()` chaînés
- Gérer systématiquement les erreurs dans les blocs `try/catch`

### 5.3 Angular

- Les appels HTTP se font **uniquement** dans les services, jamais dans les composants
- Utiliser les **Observables RxJS** avec `async pipe` dans les templates

### 5.4 Express.js

- Toute route est documentée via **Swagger/OpenAPI**
- Le fichier pour swagger est généré par AutoSwagger

---

## 6. Sécurité

- Les **rôles** (`user`, `admin`) sont vérifiés côté serveur à chaque requête

---

## 7. Tests

### 7.1 Règles générales

- Les tests sont obligatoires pour toute logique métier dans les **services**

### 7.2 Outils

| Outil | Usage |
|---|---|
| **Jest** | Framework de tests (backend) |
| **Supertest** | Tests des endpoints HTTP |
| **Jasmine / Karma** | Tests unitaires Angular |

---

## 8. Revue de Code (Code Review)

Avant d'approuver une PR, vérifier :

- [ ] Le code respecte les conventions de nommage
- [ ] Les nouveaux endpoints sont documentés dans Swagger
- [ ] Des tests unitaires couvrent les nouvelles fonctionnalités
- [ ] Aucune donnée sensible n'est committée (`.env`, tokens...)
- [ ] Le code compile sans erreur TypeScript
- [ ] Les erreurs sont correctement gérées
- [ ] Le message de commit respecte le format Conventional Commits

---

*Document maintenu par l'équipe de développement — toute modification doit faire l'objet d'une PR et être validée collectivement.*