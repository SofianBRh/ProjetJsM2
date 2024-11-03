# Projet IA Dashboard

## Description
Dashboard pour gérer des workflows de traitement de données et des modèles d'IA.

## Installation
```bash
# Installation des dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## Connexion
- Utilisateur: `admin`
- Mot de passe: `admin123`

## Fonctionnalités requises implémentées

### 1. Gestion de l'état
- **Reactive**: Utilisé pour les formulaires et objets complexes (ex: `workflowForm` dans DashboardView)
- **Ref**: Utilisé pour les valeurs simples (ex: `loading`, `error`, `workflows`)

### 2. Interactions utilisateur
- **Liaisons bidirectionnelles**: Utilisation de `v-model` dans les formulaires de connexion et création de workflow
- **Émission d'événements**: Communication parent-enfant avec `@execute-workflow` et `@delete-workflow`
- **Composables**: `useApi` pour la gestion des appels API

### 3. Structure et navigation
- **Slot**: Implémenté dans le DashboardView pour le contenu flexible
- **Routes avec paramètres**: Configuration dans le router pour les workflows et modèles
- **CDN pour les librairies**: Utilisation de Tailwind CSS via CDN

### 4. Gestion des API et données
- **Fetch avec catch**: Tous les appels API sont encapsulés dans des try/catch
- **Window**: Utilisation de `window.confirm` pour la déconnexion
- **Document**: 
  - `document.title` pour le titre de la page
  - `document.cookie` pour la gestion des cookies

### 5. Stockage et performance
- **Cookie**: Stockage et lecture des informations d'authentification
- **setTimeout**: Utilisé pour le polling des statuts de workflow
- **Fonctions fléchées**: Utilisées dans tout le code pour les callbacks et méthodes

### 6. Programmation orientée objet
- **Classe JavaScript**: Implémentation de la classe `ErrorHandler`
- **Upload de fichier**: Support drag & drop et sélection classique

## Structure du projet
```
src/
├── components/
│   ├── WorkflowList.vue
│   └── ...
├── views/
│   ├── LoginView.vue
│   ├── DashboardView.vue
│   └── ...
├── stores/
│   └── authStore.js
├── composables/
│   └── useApi.js
└── data/
    └── users.json
```

## Notes techniques
- Backend basé sur NestJS
- Frontend Vue 3 avec Composition API
- Gestion d'état avec Pinia
- Styling avec Tailwind CSS
