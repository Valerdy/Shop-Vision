# Données Partagées - LuxVision

Ce dossier contient les données partagées entre le frontend et le backend de l'application LuxVision.

## 📁 Fichiers

### `products.json`
Fichier JSON contenant tous les produits de la boutique.

**Format:**
```json
{
  "id": "string",
  "name": "string",
  "brand": "string",
  "price": number,
  "image": "string",
  "images": ["string"],
  "category": "optical" | "sunglasses",
  "gender": "men" | "women" | "unisex",
  "description": "string",
  "features": ["string"],
  "frameShape": "string",
  "material": "string",
  "color": "string",
  "stock": number,
  "rating": number,
  "reviewsCount": number,
  "isFeatured": boolean
}
```

## 🔄 Utilisation

### Frontend
Le fichier `frontend/src/data/products.ts` utilise ces données en mode fallback quand le backend n'est pas disponible.

### Backend
Le fichier `server/prisma/seed.ts` utilise ce fichier pour peupler la base de données lors du seed :

```bash
cd server
npm run prisma:seed
```

## ✏️ Comment Ajouter un Nouveau Produit

1. **Ouvrez `shared/data/products.json`**

2. **Ajoutez un nouvel objet produit** avec tous les champs requis :
   ```json
   {
     "id": "25",
     "name": "Nom du Produit",
     "brand": "Marque",
     "price": 99000,
     "image": "/placeholder.svg?height=400&width=400&text=Product+Name",
     "images": [
       "/placeholder.svg?height=600&width=600&text=Product+1",
       "/placeholder.svg?height=600&width=600&text=Product+2",
       "/placeholder.svg?height=600&width=600&text=Product+3"
     ],
     "category": "optical",
     "gender": "unisex",
     "description": "Description du produit...",
     "features": [
       "Caractéristique 1",
       "Caractéristique 2"
     ],
     "frameShape": "Round",
     "material": "Acetate",
     "color": "Black",
     "stock": 15,
     "rating": 4.5,
     "reviewsCount": 30,
     "isFeatured": false
   }
   ```

3. **Mettez à jour `frontend/src/data/products.ts`** pour refléter les changements

4. **Exécutez le seed backend** pour importer les nouveaux produits en base de données :
   ```bash
   cd server
   npm run prisma:seed
   ```

## 🎯 Avantages de cette Approche

✅ **Source unique de vérité** : Un seul fichier pour tous les produits
✅ **Synchronisation facile** : Frontend et backend utilisent les mêmes données
✅ **Mode offline** : Le frontend peut fonctionner sans backend
✅ **Facile à maintenir** : Ajouter/modifier des produits en un seul endroit
✅ **Versionnable** : Les données sont trackées dans git

## 📊 Statistiques Actuelles

- **Total produits**: 24
- **Lunettes de vue (optical)**: 13
- **Lunettes de soleil (sunglasses)**: 11
- **Produits vedettes (isFeatured)**: 10

## 🔍 Catégories

- **optical**: Lunettes de vue premium
- **sunglasses**: Lunettes de soleil avec protection UV

## 👥 Genres

- **men**: Pour hommes
- **women**: Pour femmes
- **unisex**: Unisexe

## 💰 Gammes de Prix

- **Entrée de gamme**: 68 000 - 85 000 FCFA
- **Moyen de gamme**: 85 000 - 120 000 FCFA
- **Haut de gamme**: 120 000 - 185 000 FCFA

## 🏷️ Marques Disponibles

- LuxVision
- SkyLine
- Femme
- ModernEdge
- Vintage Soul
- ActiveVision
- Diva
- Essence
- BusinessPro
- Retro Chic
- ModernVue
- FlexiFrame
- Heritage
- TechVision
- UrbanStyle

---

**Note**: Ce fichier est la source de vérité pour tous les produits. Toute modification ici sera reflétée dans le frontend (mode offline) et dans la base de données (après seed).
