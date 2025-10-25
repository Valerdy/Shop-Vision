import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { wishlistAPI } from '@/services/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
  wishlistCount: number;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    // For non-authenticated users, load from localStorage
    if (!isAuthenticated) {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [loading, setLoading] = useState(false);

  // Fetch wishlist from backend when authenticated
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        // Load from localStorage for guests
        const saved = localStorage.getItem('wishlist');
        setWishlist(saved ? JSON.parse(saved) : []);
        return;
      }

      try {
        setLoading(true);
        const response = await wishlistAPI.get();
        const backendWishlist = response.data.wishlist;

        // Transform backend wishlist to match Product structure
        const wishlistProducts: Product[] = backendWishlist.items.map((item: any) => item.product);

        setWishlist(wishlistProducts);
      } catch (error: any) {
        console.error('Error fetching wishlist:', error);
        // Fallback to localStorage if backend fails
        const saved = localStorage.getItem('wishlist');
        setWishlist(saved ? JSON.parse(saved) : []);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated, user]);

  // Sync to localStorage for guest users
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isAuthenticated]);

  const addToWishlist = async (product: Product) => {
    // Check if already in wishlist
    if (wishlist.find((item) => item.id === product.id)) {
      return;
    }

    // Optimistic update
    setWishlist((current) => [...current, product]);

    // Sync to backend if authenticated
    if (isAuthenticated) {
      try {
        await wishlistAPI.add(product.id);
      } catch (error: any) {
        console.error('Error adding to wishlist:', error);
        toast.error('Erreur lors de l\'ajout aux favoris');
        // Revert on error
        setWishlist((current) => current.filter((item) => item.id !== product.id));
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const productToRemove = wishlist.find((item) => item.id === productId);

    // Optimistic update
    setWishlist((current) => current.filter((item) => item.id !== productId));

    // Sync to backend if authenticated
    if (isAuthenticated) {
      try {
        await wishlistAPI.remove(productId);
      } catch (error: any) {
        console.error('Error removing from wishlist:', error);
        toast.error('Erreur lors de la suppression des favoris');
        // Revert on error
        if (productToRemove) {
          setWishlist((current) => [...current, productToRemove]);
        }
      }
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  };

  const clearWishlist = async () => {
    const previousWishlist = [...wishlist];

    // Optimistic update
    setWishlist([]);

    // Sync to backend if authenticated
    if (isAuthenticated) {
      try {
        await wishlistAPI.clear();
      } catch (error: any) {
        console.error('Error clearing wishlist:', error);
        toast.error('Erreur lors du vidage des favoris');
        // Revert on error
        setWishlist(previousWishlist);
      }
    }
  };

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        clearWishlist,
        wishlistCount,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};
