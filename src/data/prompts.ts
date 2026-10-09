import { PromptItem, Category } from '../types';

export const categories: Category[] = [
  { id: 'all', name: 'All', count: 'Templates', iconName: 'Sparkles' },
  { id: 'popular', name: 'Popular', count: 'Curated', iconName: 'Flame' },
  { id: 'sections', name: 'Sections', count: 'Components', iconName: 'Layers' },
  { id: 'hero', name: 'Hero', count: 'Sections', iconName: 'LayoutTemplate' },
  { id: 'landing-page', name: 'Landing Page', count: 'Pages', iconName: 'Monitor' },
  { id: 'saas', name: 'Saas', count: 'Platforms', iconName: 'Cloud' },
  { id: 'agency', name: 'Agency', count: 'Agencies', iconName: 'Briefcase' },
  { id: 'creative', name: 'Creative', count: 'Projects', iconName: 'Palette' },
  { id: 'portfolio', name: 'Portfolio', count: 'Portfolios', iconName: 'UserCheck' },
  { id: '3d', name: '3d', count: 'Experiences', iconName: 'Box' },
  { id: 'ai', name: 'Ai', count: 'Systems', iconName: 'Bot' },
  { id: 'fintech', name: 'Fintech', count: 'Dashboards', iconName: 'DollarSign' },
  { id: 'technology', name: 'Technology', count: 'Platforms', iconName: 'Cpu' },
  { id: 'travel', name: 'Travel', count: 'Explorers', iconName: 'Compass' },
  { id: 'wellness', name: 'Wellness', count: 'Experiences', iconName: 'Heart' },
  { id: '3d-website', name: '3d Website', count: 'WebGL Sites', iconName: 'Globe' },
  { id: 'ecommerce', name: 'Ecommerce', count: 'Stores', iconName: 'ShoppingBag' },
  { id: 'carousel', name: 'Carousel', count: 'Carousels', iconName: 'Sliders' },
];

/**
 * All dummy data has been removed.
 * Prompts will now be created and managed by PROMPT STUDIO through the Creator Studio
 * or defined directly in this array.
 */
export const promptItems: PromptItem[] = [];
