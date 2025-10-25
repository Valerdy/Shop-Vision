import { useState, useEffect } from 'react';
import { Product } from '@/data/products';

const MAX_RECENT_PRODUCTS = 8;
const STORAGE_KEY = 'recentlyViewedProducts';

export const useRecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentProducts));
  }, [recentProducts]);

  const addRecentProduct = (product: Product) => {
    setRecentProducts((current) => {
      // Remove duplicate if exists
      const filtered = current.filter((p) => p.id !== product.id);
      // Add to beginning and limit to MAX_RECENT_PRODUCTS
      return [product, ...filtered].slice(0, MAX_RECENT_PRODUCTS);
    });
  };

  const clearRecentProducts = () => {
    setRecentProducts([]);
  };

  return {
    recentProducts,
    addRecentProduct,
    clearRecentProducts,
  };
};
