export type AIModelType = string;

export interface Creator {
  name: string;
  handle: string;
  avatarUrl?: string;
  followers?: string;
  isVerified?: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  content: string;
  avatarUrl?: string;
}

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  model: AIModelType;
  creator: Creator;
  price: number | 'Free';
  category: string;
  imageUrl?: string;
  previewVideo?: string;
  fallbackIcon?: string;
  rating?: number;
  reviewsCount?: number;
  downloads?: string;
  uses?: string;
  likes?: number;
  keyFeatures?: { title: string; subtitle: string; icon: string }[];
  reviews?: Review[];
  promptTemplate?: string;
  promptSnippet?: string;
  typeLabel?: string;
  creatorHandle?: string;
  creatorAvatarUrl?: string;
  isPopular?: boolean;
  isRecent?: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: string;
  iconName: string;
}

export interface CartItem {
  prompt: PromptItem;
  quantity: number;
}
