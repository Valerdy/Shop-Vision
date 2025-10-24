import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { cartAPI } from '@/services/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface CartItem extends Product {
  quantity: number;
  cartItemId?: string; // Backend cart item ID
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    // For non-authenticated users, load from localStorage
    if (!isAuthenticated) {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);

  // Fetch cart from backend when authenticated
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) {
        // Load from localStorage for guests
        const saved = localStorage.getItem('cart');
        setItems(saved ? JSON.parse(saved) : []);
        return;
      }

      try {
        setLoading(true);
        const response = await cartAPI.get();
        const backendCart = response.data.cart;

        // Transform backend cart to match CartItem structure
        const cartItems: CartItem[] = backendCart.items.map((item: any) => ({
          ...item.product,
          quantity: item.quantity,
          cartItemId: item.id, // Store backend cart item ID
        }));

        setItems(cartItems);
      } catch (error: any) {
        console.error('Error fetching cart:', error);
        // Fallback to localStorage if backend fails
        const saved = localStorage.getItem('cart');
        setItems(saved ? JSON.parse(saved) : []);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, user]);

  // Sync to localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addToCart = async (product: Product, quantity = 1) => {
    // Optimistic update
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      if (existingItem) {
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...currentItems, { ...product, quantity }];
    });

    // Sync to backend if authenticated
    if (isAuthenticated) {
      try {
        await cartAPI.add(product.id, quantity);
      } catch (error: any) {
        console.error('Error adding to cart:', error);
        toast.error('Erreur lors de l\'ajout au panier');
        // Revert optimistic update on error
        setItems(currentItems => currentItems.filter(item => item.id !== product.id));
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    const itemToRemove = items.find(item => item.id === productId);

    // Optimistic update
    setItems(currentItems => currentItems.filter(item => item.id !== productId));

    // Sync to backend if authenticated
    if (isAuthenticated && itemToRemove?.cartItemId) {
      try {
        await cartAPI.remove(itemToRemove.cartItemId);
      } catch (error: any) {
        console.error('Error removing from cart:', error);
        toast.error('Erreur lors de la suppression du panier');
        // Revert on error
        if (itemToRemove) {
          setItems(currentItems => [...currentItems, itemToRemove]);
        }
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const itemToUpdate = items.find(item => item.id === productId);
    const previousQuantity = itemToUpdate?.quantity || 0;

    // Optimistic update
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    // Sync to backend if authenticated
    if (isAuthenticated && itemToUpdate?.cartItemId) {
      try {
        await cartAPI.update(itemToUpdate.cartItemId, quantity);
      } catch (error: any) {
        console.error('Error updating cart:', error);
        toast.error('Erreur lors de la mise à jour du panier');
        // Revert on error
        setItems(currentItems =>
          currentItems.map(item =>
            item.id === productId ? { ...item, quantity: previousQuantity } : item
          )
        );
      }
    }
  };

  const clearCart = async () => {
    const previousItems = [...items];

    // Optimistic update
    setItems([]);

    // Sync to backend if authenticated
    if (isAuthenticated) {
      try {
        await cartAPI.clear();
      } catch (error: any) {
        console.error('Error clearing cart:', error);
        toast.error('Erreur lors du vidage du panier');
        // Revert on error
        setItems(previousItems);
      }
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
