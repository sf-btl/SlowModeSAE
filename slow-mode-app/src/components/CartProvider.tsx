"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  type: 'produit' | 'tissu';
  nom: string;
  prix: number;
  image: string | null;
  quantite: number;
  // Pour les produits
  stock?: number;
  // Pour les tissus
  metrage?: number;
  unite?: string; // 'm' pour les tissus
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantite'>) => void;
  removeFromCart: (id: number, type: 'produit' | 'tissu') => void;
  updateQuantity: (id: number, type: 'produit' | 'tissu', quantite: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'slowmode-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger le panier depuis localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Sauvegarder le panier dans localStorage à chaque changement
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (newItem: Omit<CartItem, 'quantite'>) => {
    setItems((prevItems) => {
      // Vérifier si l'item existe déjà
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.type === newItem.type
      );

      if (existingItemIndex > -1) {
        // Augmenter la quantité
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantite += 1;
        return updatedItems;
      } else {
        // Ajouter le nouvel item
        return [...prevItems, { ...newItem, quantite: 1 }];
      }
    });
  };

  const removeFromCart = (id: number, type: 'produit' | 'tissu') => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.type === type))
    );
  };

  const updateQuantity = (id: number, type: 'produit' | 'tissu', quantite: number) => {
    if (quantite <= 0) {
      removeFromCart(id, type);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.type === type
          ? { ...item, quantite }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantite, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.prix * item.quantite, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart doit être utilisé dans un CartProvider');
  }
  return context;
}