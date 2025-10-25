# LuxVision - E-commerce de Lunettes Premium

Boutique en ligne de lunettes de vue et de soleil premium basée à Pointe-Noire, Congo.

## 📁 Structure du Projet

```
luxe-frames-shop-main/
├── frontend/              # Application React + Vite + TypeScript
│   ├── src/              # Code source frontend
│   │   ├── components/   # Composants React réutilisables
│   │   ├── contexts/     # Contextes React (Cart, Auth, Wishlist)
│   │   ├── data/         # Données statiques et types
│   │   ├── pages/        # Pages de l'application
│   │   ├── services/     # Services API
│   │   └── lib/          # Utilitaires
│   ├── public/           # Assets statiques
│   ├── package.json      # Dépendances frontend
│   └── vite.config.ts    # Configuration Vite
│
├── server/               # API Backend Express.js
│   ├── src/             # Code source backend
│   │   ├── routes/      # Routes API
│   │   ├── controllers/ # Contrôleurs
│   │   ├── middleware/  # Middlewares (auth, etc.)
│   │   └── index.ts     # Point d'entrée serveur
│   ├── prisma/          # Schéma et migrations base de données
│   │   ├── schema.prisma
│   │   └── seed.ts      # Données initiales
│   └── package.json     # Dépendances backend
│
├── API_DOCUMENTATION.md  # Documentation de l'API
├── DATABASE_SETUP.md     # Guide de configuration de la BDD
└── README.md            # Ce fichier
```

## 🚀 Technologies Utilisées

### Frontend
- **React 18.3** - Framework UI
- **TypeScript 5.8** - Typage statique
- **Vite 5.4** - Build tool ultra-rapide
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **shadcn/ui** - Composants UI modernes
- **React Router 6** - Routing
- **React Query** - Gestion d'état serveur
- **Zod** - Validation de schémas

### Backend
- **Express.js** - Framework serveur Node.js
- **TypeScript** - Typage pour le backend
- **Prisma ORM** - ORM moderne pour PostgreSQL
- **PostgreSQL** - Base de données relationnelle
- **JWT** - Authentification
- **bcryptjs** - Hachage de mots de passe
- **Multer** - Upload de fichiers

## 💻 Installation et Démarrage

### Prérequis
- Node.js 18+ et npm
- PostgreSQL 14+
- Git

### Installation

1. **Cloner le repository**
```sh
git clone <YOUR_GIT_URL>
cd luxe-frames-shop-main
```

2. **Installer les dépendances frontend**
```sh
cd frontend
npm install
```

3. **Installer les dépendances backend**
```sh
cd ../server
npm install
```

4. **Configuration de la base de données**

Consulter le fichier [DATABASE_SETUP.md](./DATABASE_SETUP.md) pour les instructions détaillées.

```sh
cd server
cp .env.example .env
# Éditer .env avec vos paramètres PostgreSQL
npm run prisma:migrate
npm run prisma:seed
```

### Démarrage en développement

**Option 1: Démarrer frontend et backend séparément**

Terminal 1 (Frontend):
```sh
cd frontend
npm run dev
# Frontend: http://localhost:5173
```

Terminal 2 (Backend):
```sh
cd server
npm run dev
# Backend API: http://localhost:3000
```

**Option 2: Démarrer les deux simultanément**

Depuis la racine du projet:
```sh
npm run dev:all
```

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Documentation complète de l'API REST
- [Database Setup](./DATABASE_SETUP.md) - Configuration de PostgreSQL
- [Quick Start Windows](./QUICK_START_WINDOWS.md) - Guide rapide pour Windows
- [Troubleshooting](./TROUBLESHOOTING.md) - Résolution des problèmes courants

## 🔑 Comptes de Démonstration

Après avoir exécuté `npm run prisma:seed`:

- **Admin**: admin@luxvision.cg / password123
- **Client**: client@example.com / password123

## 🌐 Fonctionnalités

### Client
- Catalogue de produits avec filtres
- Panier d'achat (localStorage + backend)
- Liste de souhaits
- Authentification (inscription/connexion)
- Profil utilisateur
- Historique des commandes
- Processus de checkout

### Admin
- Dashboard administrateur
- Gestion des produits (CRUD)
- Gestion des commandes
- Gestion des utilisateurs
- Statistiques de vente

## 📦 Build Production

**Frontend:**
```sh
cd frontend
npm run build
# Les fichiers de build seront dans frontend/dist/
```

**Backend:**
```sh
cd server
npm run build
# Les fichiers de build seront dans server/dist/
```

## 🤝 Contribution

Ce projet utilise [Lovable](https://lovable.dev/projects/0a6b8945-1ea4-40e1-aa3f-a98970d7ee43) pour le développement rapide.

## 📄 Licence

Tous droits réservés - LuxVision 2024
