import React, { createContext, useContext, useState, useEffect } from 'react';
import { PromptItem } from '../types';
import { promptItems } from '../data/prompts';

interface FavoritesContextType {
  favorites: PromptItem[];
  toggleFavorite: (prompt: PromptItem) => void;
  isFavorite: (promptId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem('ps_favorites');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    // Default initial favorites so Favourites tab displays items right away
    return [promptItems[0], promptItems[4]];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ps_favorites', JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const toggleFavorite = (prompt: PromptItem) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === prompt.id);
      if (exists) {
        return prev.filter((item) => item.id !== prompt.id);
      }
      return [prompt, ...prev];
    });
  };

  const isFavorite = (promptId: string) => {
    return favorites.some((item) => item.id === promptId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
