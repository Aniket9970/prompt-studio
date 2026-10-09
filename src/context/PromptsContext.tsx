import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PromptItem, Creator } from '../types';
import { promptItems as initialDummyPrompts } from '../data/prompts';
import {
  supabase,
  isSupabaseConfigured,
  mapRowToPrompt,
  mapPromptToRow,
} from '../lib/supabase';

export const DEFAULT_STUDIO_CREATOR: Creator = {
  name: 'PROMPT STUDIO',
  handle: 'promptstudio',
  avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=promptstudio&backgroundColor=1a1a18',
  followers: 'Official Studio',
  isVerified: true,
};

interface PromptsContextType {
  prompts: PromptItem[];
  isLoading: boolean;
  isSupabaseLive: boolean;
  addPrompt: (
    promptData: Partial<PromptItem> & {
      title: string;
      description: string;
      promptTemplate: string;
      category: string;
    }
  ) => Promise<PromptItem>;
  deletePrompt: (id: string) => Promise<void>;
  updatePrompt: (id: string, updated: Partial<PromptItem>) => Promise<void>;
  resetPrompts: () => Promise<void>;
  getPromptById: (id: string) => PromptItem | undefined;
  refreshPrompts: () => Promise<void>;
  fetchPromptVideo: (id: string) => Promise<string | null>;
  trackPromptCopy: (id: string) => void;
  trackPromptView: (id: string) => void;
  getPromptPopularity: (prompt: PromptItem) => number;
}

const PromptsContext = createContext<PromptsContextType | undefined>(undefined);

const STORAGE_KEY = 'prompt_studio_prompts_v1';

export const PromptsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [prompts, setPrompts] = useState<PromptItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse cached prompts:', e);
    }
    return initialDummyPrompts;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(isSupabaseConfigured);

  // Columns to fetch initially for fast rendering without statement timeouts
  const PROMPT_METADATA_COLUMNS =
    'id, title, description, model, category, price, is_free, image_url, fallback_icon, rating, reviews_count, downloads, uses, likes, prompt_template, prompt_snippet, type_label, creator_name, creator_handle, creator_avatar_url, is_popular, is_recent, key_features, created_at';

  // Sync prompts to localStorage cache for offline/instant initial render (stripping heavy base64 video URLs to avoid QuotaExceededError)
  useEffect(() => {
    try {
      const sanitized = prompts.map((p) => {
        if (p.previewVideo && p.previewVideo.startsWith('data:')) {
          const { previewVideo, ...rest } = p;
          return rest;
        }
        return p;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    } catch (e) {
      console.warn('Failed to persist prompts to cache:', e);
    }
  }, [prompts]);

  // Dedup set for video requests to avoid duplicate network fetches
  const videoFetchInProgress = React.useRef<Set<string>>(new Set());

  // Fetch a single prompt video on-demand (used when viewing prompt details or card)
  const fetchPromptVideo = useCallback(async (id: string): Promise<string | null> => {
    if (!isSupabaseConfigured || !id) return null;
    if (videoFetchInProgress.current.has(id)) return null;

    videoFetchInProgress.current.add(id);

    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('preview_video')
        .eq('id', id)
        .single();

      if (!error && data?.preview_video) {
        setPrompts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, previewVideo: data.preview_video } : p))
        );
        return data.preview_video;
      }
    } catch (e) {
      console.warn('Single prompt video load error:', e);
      videoFetchInProgress.current.delete(id);
    }
    return null;
  }, []);

  // Fetch prompts directly from Supabase backend
  const fetchPromptsFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Rapidly fetch all prompts metadata (<1 second response time)
      const { data, error } = await supabase
        .from('prompts')
        .select(PROMPT_METADATA_COLUMNS)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch notice:', error.message);
        setIsSupabaseLive(false);
        setIsLoading(false);
        return;
      }

      setIsSupabaseLive(true);
      if (data && Array.isArray(data)) {
        // Exclude initial test prompts and any deleted IDs
        const deletedIds: string[] = JSON.parse(
          localStorage.getItem('ps_deleted_prompt_ids') || '[]'
        );
        const legacyTestIds = [
          'ab5fed01-7def-4fda-ae08-2e096d481928',
          'fb773d9d-3444-412d-b620-04f9cc3b6b92',
          'cb090fcf-9f6c-45ee-9dd5-820a7dcef230',
        ];

        const validRows = data.filter((row: any) => {
          const id = String(row.id);
          const title = (row.title || '').toLowerCase().trim();
          if (legacyTestIds.includes(id) || deletedIds.includes(id)) return false;
          if (title === 'test' || title === 'agent grove system' || title === 'rls test') return false;
          return true;
        });

        const mappedPrompts = validRows.map(mapRowToPrompt);

        // Instantly render all prompts to screen (preserving any previewVideo already fetched)
        setPrompts((prev) => {
          return mappedPrompts.map((newP) => {
            const existing = prev.find((p) => p.id === newP.id);
            if (existing?.previewVideo) {
              return { ...newP, previewVideo: existing.previewVideo };
            }
            return newP;
          });
        });
        setIsLoading(false);

        // Step 2: Pre-fetch video only for the top 3 cards in the hero section for instant playback without network congestion
        const topIds = validRows.slice(0, 3).map((r: any) => String(r.id));
        if (topIds.length > 0) {
          try {
            const { data: videoData, error: videoError } = await supabase
              .from('prompts')
              .select('id, preview_video')
              .in('id', topIds);

            if (!videoError && videoData && videoData.length > 0) {
              setPrompts((currentPrompts) =>
                currentPrompts.map((p) => {
                  const match = videoData.find((v: any) => String(v.id) === String(p.id));
                  if (match && match.preview_video) {
                    return { ...p, previewVideo: match.preview_video };
                  }
                  return p;
                })
              );
            }
          } catch (e) {
            console.warn('Initial top video load error:', e);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load prompts from Supabase:', err);
      setIsSupabaseLive(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and Realtime subscription
  useEffect(() => {
    fetchPromptsFromSupabase();

    if (!isSupabaseConfigured) return;

    // Supabase Realtime channel to keep all users in sync automatically
    const channel = supabase
      .channel('public:prompts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'prompts' },
        () => {
          fetchPromptsFromSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPromptsFromSupabase]);

  // Add new prompt to Supabase backend
  const addPrompt = async (
    promptData: Partial<PromptItem> & {
      title: string;
      description: string;
      promptTemplate: string;
      category: string;
    }
  ): Promise<PromptItem> => {
    const slug = promptData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Fallback local template
    let newPrompt: PromptItem = {
      id: `${slug || 'prompt'}-${Date.now()}`,
      title: promptData.title,
      description: promptData.description,
      model: promptData.model || 'AI APP',
      typeLabel: promptData.typeLabel || 'Interactive App',
      creator: DEFAULT_STUDIO_CREATOR,
      price: promptData.price !== undefined ? promptData.price : 'Free',
      category: promptData.category,
      imageUrl: promptData.imageUrl,
      previewVideo: promptData.previewVideo,
      rating: 5.0,
      reviewsCount: 0,
      downloads: '1',
      uses: '1',
      likes: 1,
      isPopular: promptData.isPopular ?? true,
      isRecent: true,
      keyFeatures:
        promptData.keyFeatures && promptData.keyFeatures.length > 0
          ? promptData.keyFeatures
          : [
              { title: 'Optimized Workflow', subtitle: 'Verified high-fidelity instructions.', icon: 'Sparkles' },
              { title: 'Clean Architecture', subtitle: 'Modern standards & tested code quality.', icon: 'Check' },
              { title: 'One-Click Deploy', subtitle: 'Ready for production environments.', icon: 'Zap' },
            ],
      promptTemplate: promptData.promptTemplate,
      promptSnippet: promptData.promptTemplate.slice(0, 140) + '...',
    };

    if (isSupabaseConfigured) {
      try {
        const rowPayload = mapPromptToRow(promptData);
        const { data, error } = await supabase
          .from('prompts')
          .insert([rowPayload])
          .select()
          .single();

        if (error) {
          console.warn('Supabase insert notice:', error.message);
        } else if (data) {
          newPrompt = mapRowToPrompt(data);
        }
      } catch (err) {
        console.warn('Failed to save prompt to Supabase:', err);
      }
    }

    setPrompts((prev) => [newPrompt, ...prev.filter((p) => p.id !== newPrompt.id)]);
    return newPrompt;
  };

  // Delete prompt from Supabase backend
  const deletePrompt = async (id: string): Promise<void> => {
    try {
      const deletedIds: string[] = JSON.parse(
        localStorage.getItem('ps_deleted_prompt_ids') || '[]'
      );
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('ps_deleted_prompt_ids', JSON.stringify(deletedIds));
      }
    } catch (e) {
      console.warn('Failed to store deleted prompt id:', e);
    }

    setPrompts((prev) => prev.filter((p) => p.id !== id));

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase.from('prompts').delete().eq('id', id);
        if (error) {
          console.warn('Supabase delete error:', error.message);
        }
      } catch (err) {
        console.warn('Failed to delete from Supabase:', err);
      }
    }
  };

  // Update prompt in Supabase backend
  const updatePrompt = async (id: string, updated: Partial<PromptItem>): Promise<void> => {
    setPrompts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          ...updated,
          creator: updated.creator || p.creator || DEFAULT_STUDIO_CREATOR,
        };
      })
    );

    if (isSupabaseConfigured) {
      try {
        const payload: any = {};
        if (updated.title !== undefined) payload.title = updated.title;
        if (updated.description !== undefined) payload.description = updated.description;
        if (updated.category !== undefined) payload.category = updated.category;
        if (updated.model !== undefined) payload.model = updated.model;
        if (updated.price !== undefined) {
          payload.price = typeof updated.price === 'number' ? updated.price : 0;
          payload.is_free = updated.price === 'Free';
        }
        if (updated.imageUrl !== undefined) payload.image_url = updated.imageUrl || null;
        if (updated.previewVideo !== undefined) payload.preview_video = updated.previewVideo || null;
        if (updated.promptTemplate !== undefined) {
          payload.prompt_template = updated.promptTemplate;
          payload.prompt_snippet = updated.promptTemplate.slice(0, 140) + '...';
        }
        if (updated.typeLabel !== undefined) payload.type_label = updated.typeLabel;
        if (updated.isPopular !== undefined) payload.is_popular = updated.isPopular;
        if (updated.creator?.name !== undefined) payload.creator_name = updated.creator.name;
        if (updated.creator?.handle !== undefined) {
          payload.creator_handle = updated.creator.handle.replace(/^@+/, '');
        }
        if (updated.keyFeatures !== undefined) payload.key_features = updated.keyFeatures;
        payload.updated_at = new Date().toISOString();

        const { error } = await supabase
          .from('prompts')
          .update(payload)
          .eq('id', id);

        if (error) {
          console.warn('Supabase update notice:', error.message);
        }
      } catch (err) {
        console.warn('Failed to update in Supabase:', err);
      }
    }
  };

  // Clear all prompts
  const resetPrompts = async (): Promise<void> => {
    setPrompts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    if (isSupabaseConfigured) {
      try {
        await supabase.from('prompts').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (err) {
        console.warn('Failed to clear Supabase table:', err);
      }
    }
  };

  const getPromptById = (id: string) => {
    return prompts.find((p) => p.id === id);
  };

  // Engagement tracking: Copies & Views
  const [statsTick, setStatsTick] = useState<number>(0);

  const trackPromptCopy = useCallback((id: string) => {
    try {
      const key = `ps_copies_${id}`;
      const current = parseInt(localStorage.getItem(key) || '0', 10);
      localStorage.setItem(key, String(current + 1));
      setStatsTick((t) => t + 1);

      // Optimistically update prompt uses in state
      setPrompts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const currentUses = parseInt(p.uses || '0', 10) || 0;
            return { ...p, uses: String(currentUses + 1) };
          }
          return p;
        })
      );

      // Best effort update in Supabase
      if (isSupabaseConfigured) {
        Promise.resolve(
          supabase
            .rpc('increment_prompt_uses', { prompt_id: id })
            .then(({ error }) => {
              if (error) {
                // Fallback to fetch current uses then increment
                supabase
                  .from('prompts')
                  .select('uses')
                  .eq('id', id)
                  .single()
                  .then(({ data }) => {
                    const num = parseInt(data?.uses || '0', 10) || 0;
                    supabase.from('prompts').update({ uses: String(num + 1) }).eq('id', id);
                  });
              }
            })
        ).catch(() => {});
      }
    } catch (e) {
      console.warn('Could not record prompt copy:', e);
    }
  }, []);

  const trackPromptView = useCallback((id: string) => {
    try {
      const key = `ps_views_${id}`;
      const current = parseInt(localStorage.getItem(key) || '0', 10);
      localStorage.setItem(key, String(current + 1));
      setStatsTick((t) => t + 1);
    } catch (e) {
      console.warn('Could not record prompt view:', e);
    }
  }, []);

  const getPromptPopularity = useCallback(
    (prompt: PromptItem): number => {
      // Base uses / downloads / likes
      const rawUses = parseInt(prompt.uses || '0', 10) || 0;
      const rawDownloads = parseInt(prompt.downloads || '0', 10) || 0;
      const likes = prompt.likes || 0;
      const isPopularBonus = prompt.isPopular ? 10 : 0;

      // Realtime local tracking
      let localCopies = 0;
      let localViews = 0;
      try {
        localCopies = parseInt(localStorage.getItem(`ps_copies_${prompt.id}`) || '0', 10);
        localViews = parseInt(localStorage.getItem(`ps_views_${prompt.id}`) || '0', 10);
      } catch {}

      // Popularity score formula: copies count for 5 points, uses count for 3, views for 1, downloads for 2, likes for 3
      return (
        localCopies * 5 +
        rawUses * 3 +
        localViews * 1 +
        rawDownloads * 2 +
        likes * 3 +
        isPopularBonus
      );
    },
    [statsTick] // recompute when stats tick updates
  );

  return (
    <PromptsContext.Provider
      value={{
        prompts,
        isLoading,
        isSupabaseLive,
        addPrompt,
        deletePrompt,
        updatePrompt,
        resetPrompts,
        getPromptById,
        refreshPrompts: fetchPromptsFromSupabase,
        fetchPromptVideo,
        trackPromptCopy,
        trackPromptView,
        getPromptPopularity,
      }}
    >
      {children}
    </PromptsContext.Provider>
  );
};

export const usePrompts = (): PromptsContextType => {
  const context = useContext(PromptsContext);
  if (!context) {
    throw new Error('usePrompts must be used within a PromptsProvider');
  }
  return context;
};
