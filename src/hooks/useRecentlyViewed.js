import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'abf_recently_viewed';
const MAX_ITEMS = 8;

function loadFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Hook to track and retrieve recently viewed product IDs.
 * @returns {{ recentlyViewed: string[], addToRecentlyViewed: (id: string) => void }}
 */
export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToRecentlyViewed = useCallback((productId) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  return { recentlyViewed, addToRecentlyViewed };
}
