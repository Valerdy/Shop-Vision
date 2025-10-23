# Guide de Résolution - Démarrage du Serveur

## Étapes à Suivre (Windows)

### Étape 1 : Créer le Fichier .env

Dans le terminal, exécutez :

```bash
# Copier le fichier .env.example vers .env
copy .env.example .env
```

Ou créez manuellement un fichier `.env` à la racine du projet avec ce contenu minimum :

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/luxvision_db?schema=public"

# JWT
JWT_SECRET="dev-secret-key-change-in-production-abc123xyz789"
REFRESH_TOKEN_SECRET="dev-refresh-secret-key-change-in-production-xyz789abc123"

# App
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:8080"
```

**IMPORTANT** : Modifiez `DATABASE_URL` avec vos identifiants PostgreSQL :
- Remplacez `postgres` par votre nom d'utilisateur PostgreSQL
- Remplacez `password` par votre mot de passe PostgreSQL
- Vérifiez que le port `5432` est correct

### Étape 2 : Installer PostgreSQL (si pas encore fait)

Si PostgreSQL n'est pas installé :

1. Téléchargez PostgreSQL : https://www.postgresql.org/download/windows/
2. Installez-le avec les paramètres par défaut
3. Notez le mot de passe que vous définissez pour l'utilisateur `postgres`

### Étape 3 : Créer la Base de Données

Ouvrez **SQL Shell (psql)** ou **pgAdmin** et exécutez :

```sql
CREATE DATABASE luxvision_db;
```

### Étape 4 : Générer le Client Prisma

Dans le terminal à la racine du projet :

```bash
npm run prisma:generate
```

Cette commande va créer le client Prisma nécessaire pour communiquer avec la base de données.

### Étape 5 : Exécuter les Migrations

```bash
npm run prisma:migrate
```

Lorsqu'on vous demande un nom pour la migration, tapez : `init`

Cette commande va créer toutes les tables dans la base de données.

### Étape 6 : Peupler la Base de Données (Seed)

```bash
npm run prisma:seed
```

Cette commande va ajouter les données initiales (produits, catégories, utilisateurs de test).

### Étape 7 : Relancer le Serveur

```bash
npm run dev:all
```

## Commande Tout-en-Un (Alternative)

Si vous voulez tout faire en une fois après avoir créé le fichier .env :

```bash
npm run db:setup
```

Puis :

```bash
npm run dev:all
```

## Vérification

Une fois le serveur démarré, vous devriez voir :

```
🚀 LuxVision API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Server running on port 3001
🌍 Environment: development
🔗 API URL: http://localhost:3001/api/v1
💚 Health check: http://localhost:3001/health
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Testez avec :

```bash
curl http://localhost:3001/health
```

Ou dans votre navigateur : http://localhost:3001/health

## Dépannage

### Erreur "Port 3001 déjà utilisé"

```bash
# Trouver le processus
netstat -ano | findstr :3001

# Tuer le processus (remplacer PID par le numéro trouvé)
taskkill /PID <PID> /F
```

### Erreur "Can't reach database server"

1. Vérifiez que PostgreSQL est démarré
2. Vérifiez les identifiants dans DATABASE_URL
3. Vérifiez que la base de données `luxvision_db` existe

### Erreur "Prisma schema not found"

Assurez-vous d'être à la racine du projet (pas dans le dossier `server`).

## Support

Si vous rencontrez d'autres problèmes, consultez :
- `DATABASE_SETUP.md` pour plus de détails sur PostgreSQL
- `server/README.md` pour la documentation du serveur
