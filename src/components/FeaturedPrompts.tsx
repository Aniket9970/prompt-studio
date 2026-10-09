import React, { useState } from 'react';
import { PromptItem } from '../types';
import { PromptCard } from './PromptCard';
import { AnimatedBackground } from './motion-primitives/animated-background';
import { InView } from './motion-primitives/in-view';
import { AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FeaturedPromptsProps {
  prompts: PromptItem[];
  selectedCategory: string | null;
  searchQuery: string;
}

type FilterTab = 'All' | 'Popular' | 'Free';

export const FeaturedPrompts: React.FC<FeaturedPromptsProps> = ({
  prompts,
  selectedCategory,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const filteredPrompts = prompts.filter((p) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.creator.name.toLowerCase().includes(q) ||
        p.creator.handle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory && p.category !== selectedCategory) {
      return false;
    }

    // Tab filter
    if (activeTab === 'Popular') {
      return p.isPopular ?? true;
    }
    if (activeTab === 'Free') {
      return p.price === 'Free';
    }

    return true;
  });

  return (
    <section id="featured" className="py-24 bg-[#FFFEFB]">
      <div className="max-w-[1240px] mx-auto px-6">
        {/* Section Header */}
        <InView
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="clash-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1A18] uppercase">
                PROMPTS LIVE INTERACTIVE PREVIEWS
              </h2>
            </div>

            {/* Filter Tabs using AnimatedBackground */}
            <div className="flex items-center gap-1 bg-[#F7F8FC] p-1.5 rounded-2xl border border-[#E8E9F0] self-start md:self-auto card-shadow">
              <AnimatedBackground
                defaultValue="All"
                className="bg-white rounded-xl shadow-sm border border-[#E8E9F0]"
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.35,
                }}
                onValueChange={(val) => {
                  if (val) setActiveTab(val as FilterTab);
                }}
              >
                {(['All', 'Popular', 'Free'] as FilterTab[]).map((tab) => (
                  <button
                    key={tab}
                    data-id={tab}
                    type="button"
                    className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors z-10 ${
                      activeTab === tab ? 'text-[#1A1A18]' : 'text-[#8B8E9A] hover:text-[#1A1A18]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </AnimatedBackground>
            </div>
          </div>
        </InView>

        {/* Prompts Grid with AnimatePresence */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPrompts.map((prompt) => (
                <div key={prompt.id}>
                  <PromptCard prompt={prompt} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-[#F7F8FC] rounded-[32px] border border-[#E8E9F0]">
            <p className="text-xl font-bold text-[#1A1A18] mb-2">No previews match your criteria</p>
            <p className="text-sm text-[#8B8E9A] mb-6">
              Try choosing another category or clearing the current filter.
            </p>
            <button
              onClick={() => setActiveTab('All')}
              className="px-6 py-3 bg-[#1A1A18] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom Action */}
        <div className="mt-16 text-center">
          <Link
            to="/browse"
            className="inline-flex items-center gap-3 h-[56px] px-10 bg-white border border-[#E8E9F0] text-[#1A1A18] rounded-2xl font-bold hover:bg-[#F7F8FC] hover:border-[#8AAAFF]/40 transition-all card-shadow"
          >
            <span>Explore All Web & App Prompts</span>
            <ArrowRight className="w-4 h-4 text-[#8AAAFF]" />
          </Link>
        </div>
      </div>
    </section>
  );
};
