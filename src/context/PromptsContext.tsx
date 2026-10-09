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

  // Sync prompts to localStorage cache for offline/instant initial render
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    } catch (e) {
      console.warn('Failed to persist prompts to cache:', e);
    }
  }, [prompts]);

  // Fetch prompts directly from Supabase backend
  const fetchPromptsFromSupabase = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch notice:', error.message);
        setIsSupabaseLive(false);
        return;
      }

      setIsSupabaseLive(true);
      if (data && Array.isArray(data)) {
        const mappedPrompts = data.map(mapRowToPrompt);
        setPrompts(mappedPrompts);
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
      prev.map((p) => (p.id === id ? { ...p, ...updated, creator: DEFAULT_STUDIO_CREATOR } : p))
    );

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('prompts')
          .update({
            title: updated.title,
            description: updated.description,
            category: updated.category,
            model: updated.model,
            price: typeof updated.price === 'number' ? updated.price : 0,
            is_free: updated.price === 'Free',
            image_url: updated.imageUrl,
            preview_video: updated.previewVideo,
            prompt_template: updated.promptTemplate,
            type_label: updated.typeLabel,
            is_popular: updated.isPopular,
          })
          .eq('id', id);
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
