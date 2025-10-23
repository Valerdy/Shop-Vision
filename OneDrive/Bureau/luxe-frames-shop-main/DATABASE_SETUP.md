# Guide de Configuration de la Base de Données

Ce guide vous aidera à configurer la base de données PostgreSQL avec Prisma pour LuxVision Shop.

## Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v14 ou supérieur) installé et en cours d'exécution
- npm ou yarn comme gestionnaire de paquets

## Étape 1: Installation des Dépendances

Installez Prisma et les dépendances nécessaires :

```bash
npm install @prisma/client
npm install -D prisma
npm install bcryptjs
npm install -D @types/bcryptjs
```

## Étape 2: Configuration de PostgreSQL

### Créer la Base de Données

Connectez-vous à PostgreSQL et créez une nouvelle base de données :

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Dans le prompt PostgreSQL, créer la base de données
CREATE DATABASE luxvision_db;

# Créer un utilisateur (optionnel)
CREATE USER luxvision_user WITH PASSWORD 'votre_mot_de_passe';

# Donner les privilèges
GRANT ALL PRIVILEGES ON DATABASE luxvision_db TO luxvision_user;

# Quitter
\q
```

## Étape 3: Configuration des Variables d'Environnement

Créez un fichier `.env` à la racine du projet en vous basant sur `.env.example` :

```bash
cp .env.example .env
```

Éditez le fichier `.env` et configurez vos variables :

```env
# Database
DATABASE_URL="postgresql://luxvision_user:votre_mot_de_passe@localhost:5432/luxvision_db?schema=public"

# JWT Secret (générez une clé aléatoire sécurisée)
JWT_SECRET="votre_secret_jwt_tres_securise"
REFRESH_TOKEN_SECRET="votre_secret_refresh_token"

# Application
NODE_ENV="development"
PORT=3000

# Payment (à configurer plus tard)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
MOBILE_MONEY_API_KEY="your_mobile_money_api_key"

# Email (à configurer plus tard)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
```

### Générer un Secret JWT Sécurisé

Utilisez cette commande pour générer un secret aléatoire :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Étape 4: Initialisation de Prisma

Si ce n'est pas déjà fait, initialisez Prisma :

```bash
npx prisma init
```

Le fichier `prisma/schema.prisma` est déjà configuré avec le schéma complet.

## Étape 5: Créer les Tables (Migration)

Exécutez la migration pour créer toutes les tables dans la base de données :

```bash
npx prisma migrate dev --name init
```

Cette commande va :
- Créer toutes les tables selon le schéma
- Générer le client Prisma
- Créer un fichier de migration dans `prisma/migrations/`

## Étape 6: Peupler la Base de Données (Seed)

Exécutez le script de seed pour ajouter les données initiales :

```bash
npx prisma db seed
```

Cette commande va ajouter :
- 2 catégories (Optical, Sunglasses)
- 8 produits avec tous leurs détails
- 2 utilisateurs de démonstration
- Quelques avis clients
- Une adresse de démonstration

### Identifiants de Démonstration

Après le seed, vous aurez accès à ces comptes :

**Administrateur :**
- Email: `admin@luxvision.cg`
- Mot de passe: `password123`

**Client :**
- Email: `client@example.com`
- Mot de passe: `password123`

## Étape 7: Vérification

Vérifiez que tout fonctionne correctement :

```bash
# Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

Prisma Studio s'ouvrira dans votre navigateur à l'adresse `http://localhost:5555`.

Vous devriez voir :
- 2 catégories
- 8 produits
- 2 utilisateurs
- Plusieurs avis
- 1 adresse

## Commandes Prisma Utiles

### Régénérer le Client Prisma

```bash
npx prisma generate
```

### Voir l'État de la Base de Données

```bash
npx prisma db pull
```

### Réinitialiser la Base de Données (ATTENTION: Supprime toutes les données)

```bash
npx prisma migrate reset
```

Cette commande va :
1. Supprimer toutes les données
2. Recréer les tables
3. Exécuter le seed automatiquement

### Créer une Nouvelle Migration

```bash
npx prisma migrate dev --name nom_de_la_migration
```

### Appliquer les Migrations en Production

```bash
npx prisma migrate deploy
```

## Structure de la Base de Données

### Modèles Principaux

1. **User** - Gestion des utilisateurs et authentification
2. **Product** - Catalogue de produits
3. **Category** - Catégories de produits
4. **Order** - Commandes clients
5. **OrderItem** - Articles dans les commandes
6. **Payment** - Transactions de paiement
7. **Review** - Avis clients
8. **Address** - Adresses de livraison
9. **Wishlist** - Liste de souhaits
10. **CartItem** - Panier d'achat
11. **Newsletter** - Abonnements newsletter
12. **Contact** - Messages de contact

### Relations Importantes

- Un utilisateur peut avoir plusieurs commandes, avis, adresses
- Un produit appartient à une catégorie
- Une commande contient plusieurs articles (OrderItems)
- Chaque commande a un paiement associé

## Dépannage

### Erreur de Connexion

Si vous obtenez une erreur de connexion :

1. Vérifiez que PostgreSQL est en cours d'exécution :
   ```bash
   sudo service postgresql status  # Linux
   brew services list              # macOS
   ```

2. Vérifiez l'URL de connexion dans `.env`
3. Assurez-vous que l'utilisateur a les bonnes permissions

### Erreur de Migration

Si une migration échoue :

```bash
# Marquer la migration comme appliquée
npx prisma migrate resolve --applied nom_migration

# Ou réinitialiser complètement
npx prisma migrate reset
```

### Prisma Client non Généré

Si vous obtenez l'erreur "Cannot find module '@prisma/client'" :

```bash
npx prisma generate
```

## Prochaines Étapes

Après avoir configuré la base de données, vous devrez :

1. **Créer l'API Backend** - Express.js ou NestJS pour gérer les requêtes
2. **Implémenter l'Authentification** - JWT avec bcrypt
3. **Créer les Routes API** - CRUD pour produits, commandes, utilisateurs
4. **Intégrer les Paiements** - Stripe et Mobile Money
5. **Connecter le Frontend** - Remplacer les données statiques par des appels API

## Support

Pour plus d'informations sur Prisma :
- [Documentation Prisma](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma CLI Reference](https://www.prisma.io/docs/reference/api-reference/command-reference)
