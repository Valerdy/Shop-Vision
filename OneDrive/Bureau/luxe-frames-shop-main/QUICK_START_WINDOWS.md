# Démarrage Rapide - Windows

## 🚨 Résolution de l'Erreur Prisma

Vous avez cette erreur car le client Prisma n'a pas été généré. Suivez ces étapes :

## 📋 Solution Rapide (3 commandes)

```bash
# 1. Générer le client Prisma
npm run prisma:generate

# 2. Configurer la base de données (créer les tables + données initiales)
npm run db:setup

# 3. Relancer l'application
npm run dev:all
```

---

## 📝 Solution Détaillée Étape par Étape

### Étape 1 : Vérifier PostgreSQL

Assurez-vous que PostgreSQL est installé et démarré sur votre machine.

**Vérifier si PostgreSQL est démarré :**
- Ouvrez "Services" Windows (Win + R, tapez `services.msc`)
- Cherchez "postgresql-x64-XX"
- Le statut doit être "En cours d'exécution"

**Si PostgreSQL n'est pas installé :**
1. Téléchargez : https://www.postgresql.org/download/windows/
2. Installez avec les paramètres par défaut
3. Notez le mot de passe de l'utilisateur `postgres`

### Étape 2 : Modifier le fichier .env

J'ai créé un fichier `.env` dans le dossier `server/`. **MODIFIEZ-LE** avec vos identifiants :

Ouvrez `server/.env` et modifiez cette ligne :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/luxvision_db?schema=public"
```

Remplacez `VOTRE_MOT_DE_PASSE` par le mot de passe PostgreSQL que vous avez défini lors de l'installation.

### Étape 3 : Créer la Base de Données

Ouvrez **SQL Shell (psql)** :

1. Appuyez sur Entrée pour tous les paramètres par défaut
2. Entrez votre mot de passe PostgreSQL
3. Tapez cette commande :

```sql
CREATE DATABASE luxvision_db;
```

4. Tapez `\q` pour quitter

### Étape 4 : Générer le Client Prisma

Dans votre terminal (à la racine du projet) :

```bash
npm run prisma:generate
```

Vous devriez voir : "✔ Generated Prisma Client"

### Étape 5 : Créer les Tables et Données Initiales

```bash
npm run db:setup
```

Cette commande va :
- Créer toutes les tables (users, products, orders, etc.)
- Ajouter les données initiales (8 produits, 2 utilisateurs de test)

Quand on vous demande un nom pour la migration, tapez : `init`

### Étape 6 : Démarrer l'Application

```bash
npm run dev:all
```

Vous devriez voir :

```
🚀 LuxVision API Server
📡 Server running on port 3001
```

Et dans un autre terminal, Vite qui démarre sur le port 8080.

---

## 🎯 Script Automatique (Alternative)

J'ai aussi créé un script batch pour automatiser tout ça :

```bash
setup-windows.bat
```

Double-cliquez sur ce fichier ou exécutez-le dans le terminal.

---

## ✅ Vérification

Une fois tout démarré, testez :

**1. API Backend :**
Ouvrez http://localhost:3001/health dans votre navigateur

Vous devriez voir :
```json
{
  "success": true,
  "message": "LuxVision API is running"
}
```

**2. Frontend :**
Ouvrez http://localhost:8080

Vous devriez voir votre site LuxVision.

---

## 🔑 Comptes de Test

Après le seed, vous avez accès à ces comptes :

**Administrateur :**
- Email : `admin@luxvision.cg`
- Mot de passe : `password123`

**Client :**
- Email : `client@example.com`
- Mot de passe : `password123`

---

## 🐛 Problèmes Courants

### Erreur "Port 3001 already in use"

```bash
# Trouver le processus
netstat -ano | findstr :3001

# Tuer le processus (remplacer 12345 par le PID trouvé)
taskkill /PID 12345 /F
```

### Erreur "Can't reach database server"

1. Vérifiez que PostgreSQL est démarré (Services Windows)
2. Vérifiez le mot de passe dans `server/.env`
3. Vérifiez que la base `luxvision_db` existe

### Erreur "role postgres does not exist"

Créez l'utilisateur postgres :

```sql
-- Dans psql en tant que superuser
CREATE USER postgres WITH PASSWORD 'votre_mot_de_passe' SUPERUSER;
```

Ou changez `DATABASE_URL` dans `server/.env` pour utiliser votre nom d'utilisateur Windows.

---

## 📚 Documentation Complète

- `TROUBLESHOOTING.md` - Guide de dépannage détaillé
- `DATABASE_SETUP.md` - Configuration PostgreSQL complète
- `API_DOCUMENTATION.md` - Documentation de l'API
- `server/README.md` - Documentation du serveur

---

## 🆘 Besoin d'Aide ?

Si vous êtes bloqué :

1. Vérifiez que PostgreSQL est installé et démarré
2. Vérifiez que le fichier `.env` existe et contient les bons identifiants
3. Lisez les messages d'erreur attentivement
4. Consultez `TROUBLESHOOTING.md`

Bonne chance ! 🚀
