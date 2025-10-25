# Guide des Images - LuxVision

Ce guide explique comment gérer les images des produits.

## 📁 Structure des Dossiers

```
frontend/public/images/
├── products/
│   ├── optical/           # Images des lunettes de vue
│   └── sunglasses/        # Images des lunettes de soleil
├── categories/            # Images des catégories
└── brands/               # Logos des marques
```

## 🖼️ Sources d'Images

### Option 1 : Images Unsplash (Actuelle)
Nous utilisons actuellement des images gratuites depuis Unsplash API.
- Haute qualité
- Libres de droits
- Pas besoin de téléchargement

### Option 2 : Images Locales
Pour utiliser vos propres images :

1. **Placer les images dans le bon dossier**
   ```
   frontend/public/images/products/optical/classic-round-1.jpg
   frontend/public/images/products/optical/classic-round-2.jpg
   ```

2. **Mettre à jour products.json**
   ```json
   "images": [
     "/images/products/optical/classic-round-1.jpg",
     "/images/products/optical/classic-round-2.jpg"
   ]
   ```

## 📸 Conventions de Nommage

Format: `{slug}-{numero}.{extension}`

Exemples:
- `classic-round-1.jpg`
- `aviator-pro-1.jpg`
- `cat-eye-elegance-1.jpg`

## 🎨 Spécifications Images

- **Format**: JPG ou PNG
- **Dimensions recommandées**:
  - Image principale: 800x800px minimum
  - Images galerie: 1200x1200px minimum
- **Poids max**: 500KB par image (optimisé)
- **Fond**: Blanc ou transparent

## 🔄 Remplacement des Images

Pour remplacer les images Unsplash par vos propres images :

1. Ajoutez vos images dans `frontend/public/images/products/`
2. Exécutez le script : `npm run update-images`
3. Les chemins seront automatiquement mis à jour

## 📝 TODO

- [ ] Remplacer les URLs Unsplash par des images locales
- [ ] Ajouter des logos de marques
- [ ] Optimiser les images (compression)
- [ ] Ajouter des images pour les catégories
