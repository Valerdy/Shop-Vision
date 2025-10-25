# LuxVision Server - Backend API

API REST sécurisée pour la plateforme e-commerce LuxVision, construite avec Express.js, TypeScript, Prisma et JWT.

## 🚀 Démarrage Rapide

### Prérequis

- Node.js (v18+)
- PostgreSQL (v14+)
- npm ou yarn

### Installation

1. **Installer les dépendances du serveur**

```bash
cd server
npm install
```

2. **Configurer la base de données**

Suivez les instructions dans `DATABASE_SETUP.md` à la racine du projet.

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet (pas dans server/) :

```bash
cp .env.example .env
```

Modifiez `.env` avec vos valeurs :

```env
DATABASE_URL="postgresql://user:password@localhost:5432/luxvision_db"
JWT_SECRET="your-secret-key"
REFRESH_TOKEN_SECRET="your-refresh-secret-key"
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:5173"
```

### Lancer le Serveur

**Mode Développement (avec hot-reload):**
```bash
npm run dev:server
```

**Ou depuis la racine du projet:**
```bash
cd server && npm run dev
```

Le serveur démarrera sur `http://localhost:3001`

## 📁 Structure du Projet

```
server/
├── src/
│   ├── config/           # Configuration (Prisma, etc.)
│   │   └── prisma.ts
│   ├── controllers/      # Contrôleurs de routes
│   │   └── auth.controller.ts
│   ├── middleware/       # Middlewares Express
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/          # Définition des routes
│   │   └── auth.routes.ts
│   ├── services/        # Logique métier
│   │   ├── auth.service.ts
│   │   └── jwt.service.ts
│   ├── types/           # Types TypeScript
│   │   └── express.d.ts
│   └── index.ts         # Point d'entrée
├── dist/                # Code compilé (généré)
├── tsconfig.json        # Config TypeScript
└── package.json
```

## 🔐 Authentification JWT

Le serveur utilise JWT avec deux types de tokens :

- **Access Token** : Expire après 15 minutes
- **Refresh Token** : Expire après 7 jours

### Endpoints Disponibles

**Public :**
- `POST /api/v1/auth/register` - Créer un compte
- `POST /api/v1/auth/login` - Se connecter
- `POST /api/v1/auth/refresh` - Rafraîchir le token

**Protégé (nécessite authentification) :**
- `GET /api/v1/auth/me` - Obtenir le profil
- `PUT /api/v1/auth/profile` - Modifier le profil
- `PUT /api/v1/auth/change-password` - Changer le mot de passe
- `POST /api/v1/auth/logout` - Se déconnecter

Consultez `API_DOCUMENTATION.md` pour des exemples détaillés.

## 🛠️ Scripts NPM

```bash
npm run dev           # Démarre en mode dev avec hot-reload
npm run build         # Compile TypeScript vers JavaScript
npm start             # Lance le serveur compilé (production)
npm run lint          # Vérifie le code avec ESLint
npm run type-check    # Vérifie les types TypeScript
```

## 🔧 Développement

### Ajouter une Nouvelle Route

1. Créer le service dans `src/services/`
2. Créer le contrôleur dans `src/controllers/`
3. Créer la route dans `src/routes/`
4. Importer et utiliser dans `src/index.ts`

**Exemple :**

```typescript
// src/routes/products.routes.ts
import { Router } from 'express';
import { getProducts } from '../controllers/products.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', authenticate, getProductById);

export default router;

// src/index.ts
import productRoutes from './routes/products.routes';
app.use('/api/v1/products', productRoutes);
```

### Middleware d'Authentification

Pour protéger une route, utilisez le middleware `authenticate` :

```typescript
import { authenticate, authorize } from '../middleware/auth.middleware';

// Route protégée (utilisateur connecté)
router.get('/protected', authenticate, controller);

// Route avec rôle requis (admin seulement)
router.delete('/admin-only', authenticate, authorize('ADMIN'), controller);
```

### Gestion des Erreurs

Utilisez `asyncHandler` pour capturer automatiquement les erreurs :

```typescript
import { asyncHandler } from '../middleware/error.middleware';

export const myController = asyncHandler(async (req, res) => {
  // Le code ici est automatiquement dans un try-catch
  const data = await myService();
  res.json({ success: true, data });
});
```

## 🧪 Test des Endpoints

### Avec cURL

```bash
# Enregistrement
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Connexion
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Profile (remplacer TOKEN)
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Health Check

```bash
curl http://localhost:3001/health
```

## 📊 Base de Données

### Générer le Client Prisma

Après modification du schéma :

```bash
# Depuis la racine du projet
npm run prisma:generate
```

### Créer une Migration

```bash
npm run prisma:migrate
```

### Visualiser les Données

```bash
npm run prisma:studio
```

## 🚀 Déploiement

### Build pour Production

```bash
npm run build
```

### Variables d'Environnement Production

Assurez-vous de définir :

```env
NODE_ENV=production
DATABASE_URL=your_production_db_url
JWT_SECRET=strong_random_secret
REFRESH_TOKEN_SECRET=another_strong_secret
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
```

### Lancer en Production

```bash
npm start
```

Ou avec PM2 :

```bash
npm install -g pm2
pm2 start dist/index.js --name luxvision-api
pm2 save
pm2 startup
```

## 🔒 Sécurité

- ✅ Helmet.js pour les en-têtes de sécurité
- ✅ CORS configuré
- ✅ Mots de passe hashés avec bcrypt (12 rounds)
- ✅ JWT avec expiration courte
- ✅ Refresh tokens pour renouvellement
- ✅ Validation des entrées
- ✅ Protection contre les injections SQL (Prisma)

## 📝 Logs

En développement, Morgan log toutes les requêtes HTTP.

Pour ajouter des logs personnalisés :

```typescript
console.log('Info:', data);
console.error('Error:', error);
```

## 🐛 Dépannage

### Port déjà utilisé

```bash
# Linux/Mac
lsof -ti:3001 | xargs kill

# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Erreur de connexion Prisma

Vérifiez :
1. PostgreSQL est en cours d'exécution
2. DATABASE_URL est correct dans .env
3. La base de données existe

```bash
npm run prisma:migrate
```

### Token invalide

Régénérez les secrets JWT :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 📚 Ressources

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [JWT.io](https://jwt.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 Licence

MIT
