import React, { createContext, useContext, useState, useEffect } from 'react';
import { PromptItem, Creator } from '../types';
import { promptItems as initialDummyPrompts } from '../data/prompts';

export const DEFAULT_STUDIO_CREATOR: Creator = {
  name: 'PROMPT STUDIO',
  handle: 'promptstudio',
  avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=promptstudio&backgroundColor=1a1a18',
  followers: 'Official Studio',
  isVerified: true,
};

interface PromptsContextType {
  prompts: PromptItem[];
  addPrompt: (promptData: Partial<PromptItem> & { title: string; description: string; promptTemplate: string; category: string }) => PromptItem;
  deletePrompt: (id: string) => void;
  updatePrompt: (id: string, updated: Partial<PromptItem>) => void;
  resetPrompts: () => void;
  getPromptById: (id: string) => PromptItem | undefined;
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
      console.warn('Failed to parse stored prompts:', e);
    }
    return initialDummyPrompts;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
    } catch (e) {
      console.warn('Failed to persist prompts to localStorage:', e);
    }
  }, [prompts]);

  const addPrompt = (promptData: Partial<PromptItem> & { title: string; description: string; promptTemplate: string; category: string }): PromptItem => {
    const slug = promptData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    const newPrompt: PromptItem = {
      id: `${slug || 'prompt'}-${Date.now()}`,
      title: promptData.title,
      description: promptData.description,
      model: promptData.model || 'AI APP',
      typeLabel: promptData.typeLabel || 'Interactive App',
      // Always attributed to our website name PROMPT STUDIO
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
      keyFeatures: promptData.keyFeatures && promptData.keyFeatures.length > 0 
        ? promptData.keyFeatures 
        : [
            { title: 'Optimized Workflow', subtitle: 'Verified high-fidelity instructions.', icon: 'Sparkles' },
            { title: 'Clean Architecture', subtitle: 'Modern standards & tested code quality.', icon: 'Check' },
            { title: 'One-Click Deploy', subtitle: 'Ready for production environments.', icon: 'Zap' },
          ],
      promptTemplate: promptData.promptTemplate,
      promptSnippet: promptData.promptTemplate.slice(0, 140) + '...',
    };

    setPrompts((prev) => [newPrompt, ...prev]);
    return newPrompt;
  };

  const deletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePrompt = (id: string, updated: Partial<PromptItem>) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated, creator: DEFAULT_STUDIO_CREATOR } : p))
    );
  };

  const resetPrompts = () => {
    setPrompts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const getPromptById = (id: string) => {
    return prompts.find((p) => p.id === id);
  };

  return (
    <PromptsContext.Provider
      value={{
        prompts,
        addPrompt,
        deletePrompt,
        updatePrompt,
        resetPrompts,
        getPromptById,
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
