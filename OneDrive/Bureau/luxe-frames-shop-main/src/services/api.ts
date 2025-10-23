import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// URL de base de l'API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Créer une instance Axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour rafraîchir le token automatiquement
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          // Pas de refresh token, rediriger vers login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Tenter de rafraîchir le token
        const { data } = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        // Sauvegarder les nouveaux tokens
        localStorage.setItem('accessToken', data.data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.data.tokens.refreshToken);

        // Réessayer la requête originale avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${data.data.tokens.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Le refresh a échoué, déconnecter l'utilisateur
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==================================================
// AUTH API
// ==================================================

export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },
};

// ==================================================
// PRODUCTS API
// ==================================================

export const productsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get(`/products/slug/${slug}`);
    return response.data;
  },

  getFeatured: async (limit?: number) => {
    const response = await api.get('/products/featured', {
      params: { limit },
    });
    return response.data;
  },

  getSimilar: async (id: string, limit?: number) => {
    const response = await api.get(`/products/${id}/similar`, {
      params: { limit },
    });
    return response.data;
  },
};

// ==================================================
// ORDERS API
// ==================================================

export const ordersAPI = {
  create: async (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: any;
    paymentMethod: string;
    customerNote?: string;
  }) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
};

// ==================================================
// CART API
// ==================================================

export const cartAPI = {
  get: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  add: async (productId: string, quantity: number = 1) => {
    const response = await api.post('/cart', { productId, quantity });
    return response.data;
  },

  update: async (cartItemId: string, quantity: number) => {
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return response.data;
  },

  remove: async (cartItemId: string) => {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  },

  clear: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

// ==================================================
// WISHLIST API
// ==================================================

export const wishlistAPI = {
  get: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  add: async (productId: string) => {
    const response = await api.post('/wishlist', { productId });
    return response.data;
  },

  remove: async (productId: string) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },

  clear: async () => {
    const response = await api.delete('/wishlist');
    return response.data;
  },
};

// ==================================================
// REVIEWS API
// ==================================================

export const reviewsAPI = {
  create: async (data: {
    productId: string;
    rating: number;
    title?: string;
    comment: string;
  }) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getByProduct: async (productId: string) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// ==================================================
// ADDRESSES API
// ==================================================

export const addressesAPI = {
  getAll: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/addresses', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/addresses/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  setDefault: async (id: string) => {
    const response = await api.put(`/addresses/${id}/default`);
    return response.data;
  },
};

export default api;
