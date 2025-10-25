import { productsAPI } from './api';
import { products as staticProducts } from '@/data/products';

const APP_MODE = import.meta.env.VITE_APP_MODE || 'development';
const DEBUG = import.meta.env.VITE_DEBUG === 'true';

const log = (...args: any[]) => {
  if (DEBUG) {
    console.log('[ProductService]', ...args);
  }
};

/**
 * Service intelligent pour récupérer les produits
 * - En mode "offline": Utilise uniquement les données statiques
 * - En mode "development": Essaie l'API, puis fallback sur données statiques
 * - En mode "production": Utilise uniquement l'API (lance une erreur si échec)
 */
export const productService = {
  /**
   * Récupère tous les produits
   */
  getAll: async (params?: any) => {
    log('getAll called with params:', params);

    // Mode offline: utiliser directement les données statiques
    if (APP_MODE === 'offline') {
      log('Mode offline: Using static data');
      return {
        success: true,
        data: {
          products: staticProducts,
          total: staticProducts.length,
          page: 1,
          limit: staticProducts.length,
        },
        fromCache: true,
      };
    }

    // Mode production ou development: essayer l'API
    try {
      log('Trying to fetch from API...');
      const response = await productsAPI.getAll(params);
      log('API call successful:', response);
      return response;
    } catch (error: any) {
      log('API call failed:', error.message);

      // En mode production, propager l'erreur
      if (APP_MODE === 'production') {
        throw error;
      }

      // En mode development, utiliser les données statiques comme fallback
      log('Falling back to static data');
      return {
        success: true,
        data: {
          products: staticProducts,
          total: staticProducts.length,
          page: 1,
          limit: staticProducts.length,
        },
        fromCache: true,
        error: 'API non disponible, données locales utilisées',
      };
    }
  },

  /**
   * Récupère un produit par ID
   */
  getById: async (id: string) => {
    log('getById called with id:', id);

    if (APP_MODE === 'offline') {
      log('Mode offline: Using static data');
      const product = staticProducts.find((p) => p.id === id);
      if (!product) {
        throw new Error('Produit non trouvé');
      }
      return {
        success: true,
        data: { product },
        fromCache: true,
      };
    }

    try {
      log('Trying to fetch from API...');
      const response = await productsAPI.getById(id);
      log('API call successful');
      return response;
    } catch (error: any) {
      log('API call failed:', error.message);

      if (APP_MODE === 'production') {
        throw error;
      }

      log('Falling back to static data');
      const product = staticProducts.find((p) => p.id === id);
      if (!product) {
        throw new Error('Produit non trouvé');
      }
      return {
        success: true,
        data: { product },
        fromCache: true,
        error: 'API non disponible, données locales utilisées',
      };
    }
  },

  /**
   * Récupère un produit par slug
   */
  getBySlug: async (slug: string) => {
    log('getBySlug called with slug:', slug);

    if (APP_MODE === 'offline') {
      log('Mode offline: Using static data');
      const product = staticProducts.find(
        (p) => p.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
      );
      if (!product) {
        throw new Error('Produit non trouvé');
      }
      return {
        success: true,
        data: { product },
        fromCache: true,
      };
    }

    try {
      log('Trying to fetch from API...');
      const response = await productsAPI.getBySlug(slug);
      log('API call successful');
      return response;
    } catch (error: any) {
      log('API call failed:', error.message);

      if (APP_MODE === 'production') {
        throw error;
      }

      log('Falling back to static data');
      const product = staticProducts.find(
        (p) => p.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
      );
      if (!product) {
        throw new Error('Produit non trouvé');
      }
      return {
        success: true,
        data: { product },
        fromCache: true,
        error: 'API non disponible, données locales utilisées',
      };
    }
  },

  /**
   * Récupère les produits en vedette
   */
  getFeatured: async (limit: number = 4) => {
    log('getFeatured called with limit:', limit);

    if (APP_MODE === 'offline') {
      log('Mode offline: Using static data');
      const featured = staticProducts
        .filter((p) => (p.rating || 0) >= 4.5)
        .slice(0, limit);
      return {
        success: true,
        data: { products: featured },
        fromCache: true,
      };
    }

    try {
      log('Trying to fetch from API...');
      const response = await productsAPI.getFeatured(limit);
      log('API call successful');
      return response;
    } catch (error: any) {
      log('API call failed:', error.message);

      if (APP_MODE === 'production') {
        throw error;
      }

      log('Falling back to static data');
      const featured = staticProducts
        .filter((p) => (p.rating || 0) >= 4.5)
        .slice(0, limit);
      return {
        success: true,
        data: { products: featured },
        fromCache: true,
        error: 'API non disponible, données locales utilisées',
      };
    }
  },

  /**
   * Récupère des produits similaires
   */
  getSimilar: async (id: string, limit: number = 4) => {
    log('getSimilar called with id:', id, 'limit:', limit);

    if (APP_MODE === 'offline') {
      log('Mode offline: Using static data');
      const product = staticProducts.find((p) => p.id === id);
      if (!product) {
        return {
          success: true,
          data: { products: [] },
          fromCache: true,
        };
      }
      const similar = staticProducts
        .filter(
          (p) =>
            p.id !== id &&
            (p.category === product.category || p.brand === product.brand)
        )
        .slice(0, limit);
      return {
        success: true,
        data: { products: similar },
        fromCache: true,
      };
    }

    try {
      log('Trying to fetch from API...');
      const response = await productsAPI.getSimilar(id, limit);
      log('API call successful');
      return response;
    } catch (error: any) {
      log('API call failed:', error.message);

      if (APP_MODE === 'production') {
        throw error;
      }

      log('Falling back to static data');
      const product = staticProducts.find((p) => p.id === id);
      if (!product) {
        return {
          success: true,
          data: { products: [] },
          fromCache: true,
          error: 'API non disponible, données locales utilisées',
        };
      }
      const similar = staticProducts
        .filter(
          (p) =>
            p.id !== id &&
            (p.category === product.category || p.brand === product.brand)
        )
        .slice(0, limit);
      return {
        success: true,
        data: { products: similar },
        fromCache: true,
        error: 'API non disponible, données locales utilisées',
      };
    }
  },
};

export default productService;
