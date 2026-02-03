# Focusa Mobile App

Application mobile React Native pour Focusa - Gestion de projets et tâches.

## 🚀 Technologies

- **React Native** avec **Expo** (~50.0.0)
- **TypeScript** pour la sécurité des types
- **React Navigation v6** pour la navigation
- **Zustand** pour la gestion d'état
- **React Native Paper** pour les composants UI Material Design
- **Expo SecureStore** pour le stockage sécurisé

## 📱 Fonctionnalités

### Authentification
- ✅ Connexion par email/mot de passe
- ✅ Inscription
- ✅ Récupération de mot de passe
- ✅ Session persistante

### Dashboard
- ✅ Vue d'ensemble des tâches prioritaires
- ✅ Statistiques de progression
- ✅ Accès rapide aux projets récents

### Projets
- ✅ Liste des projets avec indicateur de progression
- ✅ Création de projet (nom, description, couleur)
- ✅ Détail du projet avec tâches
- ✅ Tri et filtrage des tâches

### Tâches
- ✅ Création de tâches avec priorité (urgent, important, normal)
- ✅ Date d'échéance
- ✅ Statuts (à faire, en cours, terminée)
- ✅ Modification et suppression
- ✅ Marquer comme terminée

### Calendrier
- ✅ Vue calendrier des tâches par date
- ✅ Indicateurs visuels des jours avec tâches
- ✅ Liste des tâches du jour sélectionné

### Notes
- ✅ Création et modification de notes
- ✅ Association optionnelle à un projet
- ✅ Recherche de notes

### Paramètres
- ✅ Gestion du compte utilisateur
- ✅ Tags personnalisés
- ✅ Abonnement et plan
- ✅ Support et FAQ
- ✅ Déconnexion

## 📁 Structure du projet

```
src/
├── components/         # Composants réutilisables
│   ├── TaskCard.tsx
│   ├── ProjectCard.tsx
│   ├── NoteCard.tsx
│   ├── ProgressCard.tsx
│   ├── ProgressBar.tsx
│   └── CreateProjectModal.tsx
├── constants/
│   ├── config.ts      # Configuration API et constantes
│   └── theme.ts       # Couleurs, spacing, typography
├── navigation/
│   └── AppNavigator.tsx  # Configuration navigation
├── screens/
│   ├── auth/          # Écrans d'authentification
│   ├── main/          # Écrans principaux (tabs)
│   ├── tasks/         # Écrans de gestion des tâches
│   ├── notes/         # Écrans de gestion des notes
│   ├── projects/      # Écrans de gestion des projets
│   └── settings/      # Écrans de paramètres
├── services/
│   ├── api.ts         # Service API avec tous les endpoints
│   └── storage.ts     # Service de stockage sécurisé
├── store/
│   └── index.ts       # Stores Zustand (auth, projects, tasks, notes, tags)
├── types/
│   └── index.ts       # Définitions TypeScript
└── utils/
    ├── dateUtils.ts   # Fonctions de formatage de dates
    └── taskUtils.ts   # Fonctions utilitaires pour les tâches
```

## 🛠️ Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) ou Android Studio (Windows/Mac/Linux)

### Installation des dépendances

```bash
cd Focusa-Mobile
npm install
```

### Lancer l'application

```bash
# Démarrer Expo
npm start

# Lancer sur iOS
npm run ios

# Lancer sur Android
npm run android
```

## 🔧 Configuration

L'API backend est configurée dans `src/constants/config.ts`:

```typescript
export const API_BASE_URL = 'https://www.api.focusa.app/api';
```

## 📝 API Backend

L'application utilise le backend Focusa existant avec les endpoints suivants:

- `/auth/*` - Authentification
- `/projects/*` - Gestion des projets
- `/tasks/*` - Gestion des tâches
- `/notes/*` - Gestion des notes
- `/custom-tags/*` - Tags personnalisés
- `/user/*` - Profil utilisateur

## 🎨 Design System

### Couleurs principales
- **Primary**: `#4AB37F` (Vert Focusa)
- **Background**: `#F9FAFB`
- **Text**: `#333333`
- **Error**: `#EF4444`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`

### Typographie
- Police système native (San Francisco sur iOS, Roboto sur Android)

## 📦 Build pour production

### iOS (App Store)
```bash
expo build:ios
# ou avec EAS
eas build --platform ios
```

### Android (Google Play)
```bash
expo build:android
# ou avec EAS
eas build --platform android
```

## 🤝 Contribution

1. Créer une branche feature: `git checkout -b feature/ma-feature`
2. Commit: `git commit -m 'Ajout de ma feature'`
3. Push: `git push origin feature/ma-feature`
4. Créer une Pull Request

## 📄 License

Propriétaire - Focusa © 2024
