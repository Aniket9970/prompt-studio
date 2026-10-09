import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { CategoryCarousel } from '../components/CategoryCarousel';
import { FeaturedPrompts } from '../components/FeaturedPrompts';
import { CtaBanner } from '../components/CtaBanner';
import { usePrompts } from '../context/PromptsContext';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { prompts } = usePrompts();

  return (
    <div>
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryCarousel
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <FeaturedPrompts
        prompts={prompts}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />
      <CtaBanner />
    </div>
  );
};
