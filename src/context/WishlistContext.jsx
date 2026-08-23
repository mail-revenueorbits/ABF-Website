import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'abf_wishlist';

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(loadFromStorage);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openWishlist = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeWishlist = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleWishlistDrawer = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const addToWishlist = useCallback((productId) => {
    setItems((prev) => {
      if (prev.includes(productId)) return prev;
      return [...prev, productId];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setItems((prev) => prev.filter((id) => id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  const toggleWishlist = useCallback((productId) => {
    setItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId) => items.includes(productId),
    [items]
  );

  const value = {
    items,
    count: items.length,
    isOpen,
    openWishlist,
    closeWishlist,
    toggleWishlistDrawer,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
}
