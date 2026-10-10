import React, { useState, useEffect } from 'react';
import { PromptItem } from '../types';
import { PromptCard } from './PromptCard';
import { AnimatedBackground } from './motion-primitives/animated-background';
import { InView } from './motion-primitives/in-view';
import { AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import { usePrompts } from '../context/PromptsContext';

interface FeaturedPromptsProps {
  prompts: PromptItem[];
  selectedCategory: string | null;
  searchQuery: string;
}

type FilterTab = 'All' | 'Popular' | 'Free';

const PROMPTS_PER_PAGE = 15;

export const FeaturedPrompts: React.FC<FeaturedPromptsProps> = ({
  prompts,
  selectedCategory,
  searchQuery,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { getPromptPopularity } = usePrompts();

  // Reset to page 1 whenever category, tab, or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, activeTab]);

  const filteredPrompts = prompts
    .filter((p) => {
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
      if (selectedCategory && selectedCategory.toLowerCase() !== 'all') {
        if (p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
      }

      // Tab filter
      if (activeTab === 'Free') {
        return p.price === 'Free';
      }

      return true;
    })
    .sort((a, b) => {
      if (activeTab === 'Popular') {
        return getPromptPopularity(b) - getPromptPopularity(a);
      }
      return 0;
    });

  // Calculate 15-prompt pagination slices
  const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / PROMPTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PROMPTS_PER_PAGE;
  const endIndex = Math.min(startIndex + PROMPTS_PER_PAGE, filteredPrompts.length);
  const paginatedPrompts = filteredPrompts.slice(startIndex, startIndex + PROMPTS_PER_PAGE);

  // Keep currentPage strictly within valid range [1, totalPages]
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    const section = document.getElementById('featured');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="featured" className="py-12 sm:py-20 md:py-24 bg-[#FFFEFB]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <InView
          variants={{
            hidden: { opacity: 0, y: 15 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-12">
            <div>
              <h2 className="clash-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1A1A18] uppercase">
                PROMPTS LIVE INTERACTIVE PREVIEWS
              </h2>
              {filteredPrompts.length > 0 && (
                <p className="mt-2 text-xs sm:text-sm font-semibold text-[#8B8E9A]">
                  Showing {startIndex + 1}–{endIndex} of {filteredPrompts.length} curated prompts
                </p>
              )}
            </div>

            {/* Filter Tabs using AnimatedBackground */}
            <div className="flex items-center gap-1 bg-[#F7F8FC] p-1.5 rounded-2xl border border-[#E8E9F0] self-stretch sm:self-start md:self-auto card-shadow">
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
                    className={`flex-1 sm:flex-initial px-3.5 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl transition-colors z-10 text-center ${
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

        {/* Prompts Grid with AnimatePresence - Exactly 15 Loaded at once */}
        {paginatedPrompts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            <AnimatePresence mode="popLayout">
              {paginatedPrompts.map((prompt) => (
                <div key={prompt.id}>
                  <PromptCard prompt={prompt} />
                </div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12 sm:py-20 bg-[#F7F8FC] rounded-2xl sm:rounded-[32px] border border-[#E8E9F0] px-4">
            <p className="text-lg sm:text-xl font-bold text-[#1A1A18] mb-2">
              {prompts.length === 0 ? 'No Prompts Published Yet' : 'No previews match your criteria'}
            </p>
            <p className="text-xs sm:text-sm text-[#8B8E9A] mb-6 max-w-md mx-auto">
              {prompts.length === 0
                ? 'Official prompts will appear here as soon as they are uploaded by PROMPT STUDIO.'
                : 'Try choosing another category or clearing the current filter.'}
            </p>
            {prompts.length > 0 && (
              <button
                onClick={() => setActiveTab('All')}
                className="px-6 py-3 bg-[#1A1A18] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination Bar (15 Prompts Per Page) */}
        {totalPages > 1 && (
          <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-5 bg-white border border-[#E8E9F0] rounded-2xl card-shadow">
            <div className="text-xs sm:text-sm font-semibold text-[#8B8E9A]">
              Page <span className="text-[#1A1A18] font-bold">{currentPage}</span> of{' '}
              <span className="text-[#1A1A18] font-bold">{totalPages}</span>
              <span className="hidden sm:inline"> • Showing {startIndex + 1}–{endIndex} of {filteredPrompts.length} prompts</span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Previous Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-[#E8E9F0] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-[#F7F8FC] hover:enabled:border-[#1A1A18]/20 text-[#1A1A18]"
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Prev</span>
              </button>

              {/* Numbered Page Buttons */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                      isActive
                        ? 'bg-[#1A1A18] text-white shadow-sm scale-105'
                        : 'bg-transparent text-[#1A1A18]/70 hover:bg-[#F7F8FC] hover:text-[#1A1A18] border border-[#E8E9F0]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold transition-all border border-[#E8E9F0] disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-[#F7F8FC] hover:enabled:border-[#1A1A18]/20 text-[#1A1A18]"
                aria-label="Next Page"
              >
                <span className="hidden xs:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Action - Explores All Web and App Prompts */}
        {filteredPrompts.length > 0 && (
          <div className="mt-10 sm:mt-14 text-center">
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto h-12 sm:h-[56px] px-6 sm:px-10 bg-[#1A1A18] text-white rounded-2xl font-bold hover:bg-[#333333] transition-all card-shadow text-sm sm:text-base group shadow-md"
            >
              <span>Explore All Web & App Prompts Available</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-mono font-bold">
                {filteredPrompts.length}
              </span>
              <ArrowRight className="w-4 h-4 text-[#8AAAFF] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
