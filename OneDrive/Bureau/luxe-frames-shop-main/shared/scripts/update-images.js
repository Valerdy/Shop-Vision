#!/usr/bin/env node

/**
 * Script pour mettre à jour les images des produits
 * Utilise images-mapping.json pour remplacer les placeholder par des vraies images
 */

const fs = require('fs');
const path = require('path');

// Chemins des fichiers
const IMAGES_MAPPING_PATH = path.join(__dirname, '../data/images-mapping.json');
const PRODUCTS_JSON_PATH = path.join(__dirname, '../data/products.json');
const PRODUCTS_TS_PATH = path.join(__dirname, '../../frontend/src/data/products.ts');

console.log('🖼️  Mise à jour des images des produits...\n');

// Charger les fichiers
const imagesMapping = JSON.parse(fs.readFileSync(IMAGES_MAPPING_PATH, 'utf-8'));
const productsData = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));

// Compteurs
let updatedCount = 0;
let skippedCount = 0;

// Mettre à jour chaque produit
productsData.forEach((product) => {
  const imageData = imagesMapping.products[product.id];

  if (imageData) {
    product.image = imageData.image;
    product.images = imageData.images;
    updatedCount++;
    console.log(`✅ Produit ${product.id}: ${product.name}`);
  } else {
    skippedCount++;
    console.log(`⚠️  Produit ${product.id}: ${product.name} - Pas d'images trouvées`);
  }
});

// Sauvegarder products.json
fs.writeFileSync(
  PRODUCTS_JSON_PATH,
  JSON.stringify(productsData, null, 2),
  'utf-8'
);

console.log('\n📝 Génération du fichier products.ts...');

// Générer products.ts
const productsTs = `export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  images: string[];
  category: 'optical' | 'sunglasses';
  gender: 'men' | 'women' | 'unisex';
  description: string;
  features: string[];
  frameShape: string;
  material: string;
  color: string;
  stock: number;
  rating?: number;
  reviewsCount?: number;
}

export const products: Product[] = ${JSON.stringify(productsData, null, 2)};
`;

fs.writeFileSync(PRODUCTS_TS_PATH, productsTs, 'utf-8');

console.log('\n✨ Mise à jour terminée !');
console.log(`   - ${updatedCount} produits mis à jour`);
if (skippedCount > 0) {
  console.log(`   - ${skippedCount} produits ignorés`);
}
console.log('\n📁 Fichiers modifiés:');
console.log(`   - ${PRODUCTS_JSON_PATH}`);
console.log(`   - ${PRODUCTS_TS_PATH}`);
console.log('\n🚀 Vous pouvez maintenant tester l\'application !\n');
