import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { FeaturedPrompts } from '../components/FeaturedPrompts';
import { CtaBanner } from '../components/CtaBanner';
import { promptItems } from '../data/prompts';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div>
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryCarousel
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <FeaturedPrompts
        prompts={promptItems}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
      <CtaBanner />
    </div>
  );
};
