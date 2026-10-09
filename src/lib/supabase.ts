import { createClient } from '@supabase/supabase-js';
import { PromptItem } from '../types';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseUrl =
  rawUrl && !rawUrl.includes('placeholder')
    ? rawUrl
    : 'https://zkbqbxpmljfknevjdmiw.supabase.co';

const rawKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();
const supabaseAnonKey =
  rawKey && !rawKey.includes('placeholder')
    ? rawKey
    : 'sb_publishable_wqHMFCE0XJVZ1epUI6MnSg_BYX5lX0u';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Uploads a video or image file from the device to Supabase Storage (bucket: prompt-media).
 * Returns the permanent public CDN URL of the media.
 */
export async function uploadMediaToSupabase(
  file: File,
  folder: 'videos' | 'images' = 'videos'
): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop() || 'mp4';
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = `${Date.now()}_${cleanFileName}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Attempt upload to Supabase storage bucket 'prompt-media'
    const { error: uploadError } = await supabase.storage
      .from('prompt-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || (folder === 'videos' ? 'video/mp4' : 'image/jpeg'),
      });

    if (uploadError) {
      console.warn('Supabase storage bucket upload notice:', uploadError.message);
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from('prompt-media')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err?.message || 'Upload failed' };
  }
}

/**
 * Maps a Supabase prompts table row to frontend PromptItem.
 */
export function mapRowToPrompt(row: any): PromptItem {
  return {
    id: String(row.id),
    title: row.title || 'Untitled Prompt',
    description: row.description || '',
    model: row.model || 'AI APP',
    typeLabel: row.type_label || 'Interactive App',
    creator: {
      name: row.creator_name || 'PROMPT STUDIO',
      handle: (row.creator_handle || 'promptstudio').replace(/^@+/, ''),
      avatarUrl:
        row.creator_avatar_url ||
        'https://api.dicebear.com/7.x/identicon/svg?seed=promptstudio&backgroundColor=1a1a18',
      followers: 'Official Studio',
      isVerified: true,
    },
    price: row.is_free ? 'Free' : (Number(row.price) > 0 ? Number(row.price) : 'Free'),
    category: row.category || 'Ai',
    imageUrl: row.image_url || undefined,
    previewVideo: row.preview_video || undefined,
    fallbackIcon: row.fallback_icon || 'Sparkles',
    rating: Number(row.rating) || 5.0,
    reviewsCount: Number(row.reviews_count) || 0,
    downloads: row.downloads || '1',
    uses: row.uses || '1',
    likes: Number(row.likes) || 1,
    isPopular: Boolean(row.is_popular),
    isRecent: Boolean(row.is_recent ?? true),
    keyFeatures: Array.isArray(row.key_features) && row.key_features.length > 0
      ? row.key_features
      : [
          { title: 'Optimized Workflow', subtitle: 'Verified high-fidelity instructions.', icon: 'Sparkles' },
          { title: 'Clean Architecture', subtitle: 'Modern standards & tested code quality.', icon: 'Check' },
          { title: 'One-Click Deploy', subtitle: 'Ready for production environments.', icon: 'Zap' },
        ],
    promptTemplate: row.prompt_template || '',
    promptSnippet:
      row.prompt_snippet ||
      (row.prompt_template ? row.prompt_template.slice(0, 140) + '...' : ''),
  };
}

/**
 * Maps a frontend PromptItem data object to Supabase prompts table row payload.
 */
export function mapPromptToRow(
  prompt: Partial<PromptItem> & {
    title: string;
    description: string;
    promptTemplate: string;
    category: string;
  }
): any {
  const isFree = prompt.price === 'Free' || prompt.price === 0 || prompt.price === undefined;
  const numPrice = typeof prompt.price === 'number' ? prompt.price : 0;

  return {
    title: prompt.title,
    description: prompt.description,
    model: prompt.model || 'AI APP',
    category: prompt.category,
    price: numPrice,
    is_free: isFree,
    image_url: prompt.imageUrl || null,
    preview_video: prompt.previewVideo || null,
    fallback_icon: prompt.fallbackIcon || 'Sparkles',
    rating: prompt.rating || 5.0,
    reviews_count: prompt.reviewsCount || 0,
    downloads: prompt.downloads || '1',
    uses: prompt.uses || '1',
    likes: prompt.likes || 1,
    prompt_template: prompt.promptTemplate,
    prompt_snippet:
      prompt.promptSnippet ||
      prompt.promptTemplate.slice(0, 140) + '...',
    type_label: prompt.typeLabel || 'Interactive App',
    creator_name: prompt.creator?.name || 'PROMPT STUDIO',
    creator_handle: (prompt.creator?.handle || 'promptstudio').replace(/^@+/, ''),
    creator_avatar_url:
      prompt.creator?.avatarUrl ||
      'https://api.dicebear.com/7.x/identicon/svg?seed=promptstudio&backgroundColor=1a1a18',
    is_popular: prompt.isPopular ?? true,
    is_recent: true,
    key_features: prompt.keyFeatures || [],
  };
}
