import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { PromptItem } from '../types';
import { supabase } from '../lib/supabase';

interface FavoritesContextType {
  favorites: PromptItem[];
  toggleFavorite: (prompt: PromptItem) => Promise<void>;
  isFavorite: (promptId: string) => boolean;
  clearFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId, isSignedIn } = useAuth();
  const storageKey = userId ? `ps_favorites_${userId}` : 'ps_favorites_guest';

  const [favorites, setFavorites] = useState<PromptItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // When user switches or signs in, load their personal favorites
  useEffect(() => {
    let isCancelled = false;

    if (!isSignedIn || !userId) {
      setFavorites([]);
      return;
    }

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('prompt_id, prompts (*)')
          .eq('user_id', userId);

        if (!error && data && !isCancelled) {
          const loaded: PromptItem[] = data
            .map((row: any) => {
              if (!row.prompts) return null;
              const p = row.prompts;
              return {
                id: p.id,
                title: p.title,
                description: p.description,
                model: p.model,
                category: p.category,
                price: p.is_free ? 'Free' : Number(p.price),
                imageUrl: p.image_url,
                previewVideo: p.preview_video,
                fallbackIcon: p.fallback_icon,
                rating: Number(p.rating),
                reviewsCount: p.reviews_count,
                downloads: p.downloads,
                uses: p.uses,
                likes: p.likes,
                promptTemplate: p.prompt_template,
                promptSnippet: p.prompt_snippet,
                typeLabel: p.type_label,
                isPopular: p.is_popular,
                isRecent: p.is_recent,
                creator: {
                  name: p.creator_name || 'Prompt Studio',
                  handle: p.creator_handle || '@promptstudio',
                  avatarUrl: p.creator_avatar_url,
                },
                keyFeatures: p.key_features || [],
              } as PromptItem;
            })
            .filter(Boolean) as PromptItem[];

          if (loaded.length > 0) {
            setFavorites(loaded);
          }
        }
      } catch (err) {
        console.warn('Error loading favorites from Supabase:', err);
      }
    };

    fetchFavorites();

    return () => {
      isCancelled = true;
    };
  }, [userId, isSignedIn]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites, storageKey]);

  const toggleFavorite = async (prompt: PromptItem) => {
    const exists = favorites.some((item) => item.id === prompt.id);

    if (exists) {
      setFavorites((prev) => prev.filter((item) => item.id !== prompt.id));
      if (userId) {
        try {
          await supabase.from('favorites').delete().eq('user_id', userId).eq('prompt_id', prompt.id);
        } catch (err) {
          console.warn('Could not delete favorite from Supabase:', err);
        }
      }
    } else {
      setFavorites((prev) => [prompt, ...prev]);
      if (userId) {
        try {
          await supabase.from('favorites').insert([{ user_id: userId, prompt_id: prompt.id }]);
        } catch (err) {
          console.warn('Could not insert favorite into Supabase:', err);
        }
      }
    }
  };

  const isFavorite = (promptId: string) => {
    return favorites.some((item) => item.id === promptId);
  };

  const clearFavorites = async () => {
    setFavorites([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    if (userId) {
      try {
        await supabase.from('favorites').delete().eq('user_id', userId);
      } catch (err) {
        console.warn('Could not clear favorites in Supabase:', err);
      }
    }
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
