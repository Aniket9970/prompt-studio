import React from 'react';
import {
  Sparkles,
  Flame,
  Smartphone,
  Layers,
  LayoutTemplate,
  Monitor,
  Cloud,
  Briefcase,
  Palette,
  UserCheck,
  Box,
  Bot,
  DollarSign,
  Cpu,
  Compass,
  Heart,
  Globe,
  ShoppingBag,
  Sliders,
} from 'lucide-react';
import { categories } from '../data/prompts';
import { InView } from './motion-primitives/in-view';
import { motion } from 'motion/react';

interface CategoryCarouselProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles,
  Flame,
  Smartphone,
  Layers,
  LayoutTemplate,
  Monitor,
  Cloud,
  Briefcase,
  Palette,
  UserCheck,
  Box,
  Bot,
  DollarSign,
  Cpu,
  Compass,
  Heart,
  Globe,
  ShoppingBag,
  Sliders,
};

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="py-10 border-y border-[#E8E9F0] bg-white/50 backdrop-blur-sm">
      <div className="max-w-[1240px] mx-auto px-6">
        <InView
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="clash-display text-2xl font-bold text-[#1A1A18]">Explore by Category</h2>
              <p className="text-xs font-medium text-[#1A1A18]/50 mt-1">Browse templates, sections, and full interactive flows</p>
            </div>
            <div className="flex items-center gap-3">
              {selectedCategory && (
                <button
                  onClick={() => onSelectCategory(null)}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#1A1A18]/5 text-[#1A1A18] hover:bg-[#1A1A18]/10 transition-all"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => onSelectCategory(null)}
                className={`text-sm font-semibold transition-standard ${
                  selectedCategory === null
                    ? 'text-[#1A1A18] font-bold underline'
                    : 'text-[#8AAAFF] hover:underline'
                }`}
              >
                View all ({categories.length})
              </button>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.iconName] || Sparkles;
              const isSelected =
                (selectedCategory === null && cat.id === 'all') ||
                selectedCategory === cat.name;

              return (
                <motion.button
                  key={cat.id}
                  onClick={() => {
                    if (cat.id === 'all') {
                      onSelectCategory(null);
                    } else {
                      onSelectCategory(isSelected ? null : cat.name);
                    }
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-200 group text-left ${
                    isSelected
                      ? 'bg-[#1A1A18] border-[#1A1A18] text-white shadow-md'
                      : 'bg-[#F7F8FC] border-[#E8E9F0] text-[#1A1A18] hover:border-[#8AAAFF]/60 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <IconComponent
                    className={`w-4 h-4 transition-colors ${
                      isSelected ? 'text-[#8AAAFF]' : 'text-[#8B8E9A] group-hover:text-[#8AAAFF]'
                    }`}
                  />
                  <div>
                    <p className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-[#1A1A18]'}`}>
                      {cat.name}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </InView>
      </div>
    </section>
  );
};
