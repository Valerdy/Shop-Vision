# Documentation API - LuxVision

## Base URL

```
http://localhost:3001/api/v1
```

## Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification. Après connexion réussie, vous recevrez deux tokens :

- **Access Token** : Valide 15 minutes, utilisé pour les requêtes authentifiées
- **Refresh Token** : Valide 7 jours, utilisé pour renouveler l'access token

### Format du Header d'Authentification

```
Authorization: Bearer <access_token>
```

---

## Endpoints Authentification

### 1. Enregistrement d'un Utilisateur

Crée un nouveau compte utilisateur.

**Endpoint:** `POST /api/v1/auth/register`

**Accès:** Public

**Corps de la Requête:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+242 06 123 4567"
}
```

**Réponse Succès (201):**
```json
{
  "success": true,
  "message": "Compte créé avec succès",
  "data": {
    "user": {
      "id": "clxxx123456",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+242 06 123 4567",
      "role": "CUSTOMER",
      "emailVerified": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Erreurs:**
- `400` : Données invalides
- `409` : Email déjà utilisé

---

### 2. Connexion

Authentifie un utilisateur existant.

**Endpoint:** `POST /api/v1/auth/login`

**Accès:** Public

**Corps de la Requête:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Réponse Succès (200):**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "user": {
      "id": "clxxx123456",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+242 06 123 4567",
      "role": "CUSTOMER",
      "emailVerified": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Erreurs:**
- `400` : Données manquantes
- `401` : Email ou mot de passe incorrect

---

### 3. Rafraîchir le Token

Renouvelle l'access token avec un refresh token valide.

**Endpoint:** `POST /api/v1/auth/refresh`

**Accès:** Public

**Corps de la Requête:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Réponse Succès (200):**
```json
{
  "success": true,
  "message": "Token rafraîchi avec succès",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Erreurs:**
- `400` : Refresh token manquant
- `401` : Refresh token invalide ou expiré

---

### 4. Obtenir le Profil

Récupère les informations de l'utilisateur connecté.

**Endpoint:** `GET /api/v1/auth/me`

**Accès:** Privé (Authentification requise)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Réponse Succès (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clxxx123456",
      "email": "john.doe@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+242 06 123 4567",
      "role": "CUSTOMER",
      "emailVerified": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  }
}
```

**Erreurs:**
- `401` : Non authentifié
- `404` : Utilisateur non trouvé

---

### 5. Mettre à Jour le Profil

Modifie les informations du profil utilisateur.

**Endpoint:** `PUT /api/v1/auth/profile`

**Accès:** Privé (Authentification requise)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Corps de la Requête:**
```json
{
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "+242 06 987 6543"
}
```

**Réponse Succès (200):**
```json
{
  "success": true,
  "message": "Profil mis à jour avec succès",
  "data": {
    "user": {
      "id": "clxxx123456",
      "email": "john.doe@example.com",
      "firstName": "Jean",
      "lastName": "Dupont",
      "phone": "+242 06 987 6543",
      "role": "CUSTOMER",
      "emailVerified": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T11:00:00.000Z"
    }
  }
}
```

**Erreurs:**
- `401` : Non authentifié

---

### 6. Changer le Mot de Passe

Modifie le mot de passe de l'utilisateur.

**Endpoint:** `PUT /api/v1/auth/change-password`

**Accès:** Privé (Authentification requise)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Corps de la Requête:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newSecurePassword456"
}
```

**Réponse Succès (200):**
```json
{
  "success": true,
  "message": "Mot de passe changé avec succès"
}
```

**Erreurs:**
- `400` : Données manquantes ou nouveau mot de passe trop court
- `401` : Non authentifié ou ancien mot de passe incorrect

---

### 7. Déconnexion

Déconnecte l'utilisateur (invalidation côté client).

**Endpoint:** `POST /api/v1/auth/logout`

**Accès:** Privé (Authentification requise)

**Headers:**
```
Authorization: Bearer <access_token>
```

**Réponse Succès (200):**
```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

---

## Gestion des Erreurs

Toutes les erreurs suivent ce format :

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "error": "Détails techniques (uniquement en développement)"
}
```

### Codes HTTP

- `200` : Succès
- `201` : Ressource créée
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Accès refusé
- `404` : Ressource non trouvée
- `409` : Conflit (ressource existe déjà)
- `500` : Erreur serveur

---

## Exemples d'Utilisation

### Avec cURL

**Enregistrement:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Connexion:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Obtenir le Profil:**
```bash
curl -X GET http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Avec JavaScript (Fetch)

```javascript
// Connexion
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (data.success) {
    // Stocker les tokens
    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
    return data.data.user;
  }

  throw new Error(data.message);
};

// Requête authentifiée
const getProfile = async () => {
  const token = localStorage.getItem('accessToken');

  const response = await fetch('http://localhost:3001/api/v1/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (data.success) {
    return data.data.user;
  }

  throw new Error(data.message);
};
```

### Avec Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api/v1',
});

// Intercepteur pour ajouter le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour rafraîchir le token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(
          'http://localhost:3001/api/v1/auth/refresh',
          { refreshToken }
        );

        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.tokens.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Rediriger vers la page de connexion
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## Sécurité

### Bonnes Pratiques

1. **Stockage des Tokens**
   - Utilisez `localStorage` ou `sessionStorage` pour les tokens
   - Ne jamais exposer les tokens dans l'URL
   - Effacez les tokens lors de la déconnexion

2. **Gestion de l'Expiration**
   - L'access token expire après 15 minutes
   - Utilisez le refresh token pour obtenir un nouveau access token
   - Implémentez un refresh automatique avant expiration

3. **HTTPS en Production**
   - Utilisez toujours HTTPS en production
   - Configurez les en-têtes de sécurité appropriés

4. **Validation Côté Client**
   - Validez les données avant l'envoi
   - Gérez les erreurs de manière appropriée
   - Affichez des messages d'erreur clairs

---

## Endpoints à Venir

Les endpoints suivants seront bientôt disponibles :

- `GET /api/v1/products` - Liste des produits
- `GET /api/v1/products/:id` - Détails d'un produit
- `POST /api/v1/orders` - Créer une commande
- `GET /api/v1/orders` - Historique des commandes
- `GET /api/v1/addresses` - Adresses de livraison
- `POST /api/v1/reviews` - Ajouter un avis

---

## Support

Pour toute question ou problème, consultez :
- DATABASE_SETUP.md pour la configuration de la base de données
- README.md pour les instructions d'installation générales
