import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, LayoutGrid, List, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { usePrompts } from '../context/PromptsContext';
import { PromptCard } from '../components/PromptCard';
import { motion, AnimatePresence } from 'motion/react';
import { TextLoop } from '../components/motion-primitives/text-loop';
import { TextEffect } from '../components/motion-primitives/text-effect';

export const BrowsePage: React.FC = () => {
  const { prompts, getPromptPopularity } = usePrompts();
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(50);
  const [minRating4, setMinRating4] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('Popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleModel = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedModels([]);
    setMaxPrice(100);
    setMinRating4(false);
    setSearch('');
    setSortBy('Popular');
  };

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          prompt.title.toLowerCase().includes(q) ||
          prompt.description.toLowerCase().includes(q) ||
          prompt.creator.name.toLowerCase().includes(q) ||
          prompt.creator.handle.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Categories
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.some((sc) => sc.toLowerCase() === prompt.category.toLowerCase())
      ) {
        return false;
      }

      // Models / Format
      if (selectedModels.length > 0) {
        const matchesFmt =
          selectedModels.includes(prompt.model) ||
          (prompt.typeLabel && selectedModels.includes(prompt.typeLabel));
        if (!matchesFmt) return false;
      }

      // Price
      const numericPrice = typeof prompt.price === 'number' ? prompt.price : 0;
      if (numericPrice > maxPrice) {
        return false;
      }

      // Rating
      if (minRating4 && (prompt.rating || 0) < 4.0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Popular') {
        return getPromptPopularity(b) - getPromptPopularity(a);
      }
      if (sortBy === 'Newest') {
        return (b.isRecent ? 1 : 0) - (a.isRecent ? 1 : 0);
      }
      if (sortBy === 'PriceLow') {
        const pA = typeof a.price === 'number' ? a.price : 0;
        const pB = typeof b.price === 'number' ? b.price : 0;
        return pA - pB;
      }
      if (sortBy === 'PriceHigh') {
        const pA = typeof a.price === 'number' ? a.price : 0;
        const pB = typeof b.price === 'number' ? b.price : 0;
        return pB - pA;
      }
      return 0;
    });
  }, [prompts, search, selectedCategories, selectedModels, maxPrice, minRating4, sortBy, getPromptPopularity]);

  const activeFiltersCount = selectedCategories.length + selectedModels.length + (minRating4 ? 1 : 0) + (maxPrice < 100 ? 1 : 0);

  const filterContent = (
    <div className="space-y-8">
      {/* Category Filter */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-widest text-[#1A1A18]/40">
            Categories
          </h3>
          {selectedCategories.length > 0 && (
            <button
              onClick={() => setSelectedCategories([])}
              className="text-xs font-bold text-[#8AAAFF] hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-60 sm:max-h-72 overflow-y-auto pr-2 no-scrollbar">
          {[
            'Sections',
            'Hero',
            'Landing Page',
            'Saas',
            'Agency',
            'Creative',
            'Portfolio',
            '3d',
            'Ai',
            'Fintech',
            'Technology',
            'Travel',
            'Wellness',
            '3d Website',
            'Ecommerce',
            'Carousel',
          ].map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4.5 h-4.5 rounded-md border-[#E8E9F0] text-[#8AAAFF] focus:ring-[#8AAAFF] cursor-pointer"
              />
              <span className="text-sm font-semibold text-[#1A1A18]/70 group-hover:text-[#1A1A18] transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Format & Style Filter */}
      <div>
        <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-widest text-[#1A1A18]/40 mb-4 sm:mb-6">
          Experience Format
        </h3>
        <div className="space-y-3 sm:space-y-4">
          {[
            { label: 'Interactive Apps', key: 'Interactive App' },
            { label: 'Full Landing Pages', key: 'Full Landing Page' },
            { label: '3D & WebGL Experiences', key: '3D Web' },
            { label: 'Hero Sections', key: 'Hero Section' },
            { label: 'Feature Sections', key: 'Feature Section' },
          ].map((fmt) => (
            <label key={fmt.key} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedModels.includes(fmt.key)}
                onChange={() => toggleModel(fmt.key)}
                className="w-4.5 h-4.5 rounded-md border-[#E8E9F0] text-[#8AAAFF] focus:ring-[#8AAAFF] cursor-pointer"
              />
              <span className="text-sm font-semibold text-[#1A1A18]/70 group-hover:text-[#1A1A18] transition-colors">
                {fmt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-widest text-[#1A1A18]/40">
            Price Range
          </h3>
          <span className="text-xs font-black text-[#1A1A18]">
            $0 - ${maxPrice >= 100 ? '100+' : maxPrice}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="range-slider w-full appearance-none bg-transparent cursor-pointer"
        />
        <div className="flex justify-between mt-2.5 text-[11px] sm:text-[12px] font-bold text-[#1A1A18]/30">
          <span>Free</span>
          <span>Premium</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="font-display font-bold text-xs sm:text-sm uppercase tracking-widest text-[#1A1A18]/40 mb-4 sm:mb-6">
          Rating
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={minRating4}
            onChange={(e) => setMinRating4(e.target.checked)}
            className="w-4.5 h-4.5 rounded-md border-[#E8E9F0] text-[#8AAAFF] focus:ring-[#8AAAFF] cursor-pointer"
          />
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-[#1A1A18]/70">4.0 & Up</span>
          </div>
        </label>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full py-3.5 bg-[#F7F8FC] border border-[#E8E9F0] rounded-xl text-xs sm:text-sm font-bold text-[#1A1A18]/60 hover:text-[#1A1A18] hover:border-[#1A1A18]/20 transition-standard"
      >
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="bg-[#FFFEFB] pb-24">
      {/* Page Header */}
      <header className="relative py-10 sm:py-16 md:py-20 border-b border-[#E8E9F0] overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-3 sm:mb-4 text-[#1A1A18]">
              Browse{' '}
              <span className="text-[#8AAAFF] inline-block">
                <TextLoop interval={3}>
                  <span>Prompts</span>
                  <span>Templates</span>
                  <span>AI Workflows</span>
                  <span>Styles</span>
                </TextLoop>
              </span>
            </h1>
            <div className="text-sm sm:text-lg text-[#1A1A18]/60 font-medium mb-6 sm:mb-10 max-w-2xl">
              <TextEffect preset="fade-in-blur" speedReveal={1.2}>
                Discover 247 high-performance prompt assets for your creative projects.
              </TextEffect>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-[#1A1A18]/30 group-focus-within:text-[#8AAAFF] transition-colors w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts, tools, or styles..."
                className="w-full h-14 sm:h-[60px] pl-12 sm:pl-16 pr-4 sm:pr-6 bg-white border border-[#E8E9F0] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8AAAFF]/10 focus:border-[#8AAAFF] text-base sm:text-lg card-shadow transition-all font-medium"
              />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center justify-center gap-2 h-14 sm:h-[60px] px-6 bg-white border border-[#E8E9F0] rounded-2xl font-bold transition-colors hover:bg-[#F7F8FC] text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#1A1A18] text-white text-[11px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </motion.div>
        </div>
      </header>

      {/* Mobile Bottom-Sheet Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 max-h-[85vh] bg-[#FFFEFB] rounded-t-[32px] border-t border-[#E8E9F0] p-6 overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E9F0] mb-6">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#8AAAFF]" />
                  <h3 className="font-display font-extrabold text-xl text-[#1A1A18]">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#1A1A18] text-white font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 rounded-full hover:bg-[#F7F8FC] text-[#1A1A18] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pb-4">
                {filterContent}
              </div>

              <div className="pt-4 border-t border-[#E8E9F0] flex gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3.5 bg-[#1A1A18] text-white rounded-xl font-bold text-sm shadow-md"
                >
                  Show Results ({filteredPrompts.length})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-6 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-32">
              {filterContent}
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Top Sorting & View Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
              <div className="text-xs sm:text-sm font-bold text-[#1A1A18]/40">
                Showing {filteredPrompts.length > 0 ? `1-${filteredPrompts.length}` : '0'} of {prompts.length} templates
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm font-bold text-[#1A1A18]/40 uppercase tracking-wider">
                    Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-bold text-xs sm:text-sm text-[#1A1A18] focus:outline-none cursor-pointer border-none"
                  >
                    <option value="Popular">Popular</option>
                    <option value="Newest">Newest</option>
                    <option value="PriceLow">Price: Low to High</option>
                    <option value="PriceHigh">Price: High to Low</option>
                  </select>
                </div>

                <div className="flex items-center bg-[#F7F8FC] border border-[#E8E9F0] p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white card-shadow text-[#1A1A18]' : 'text-[#1A1A18]/30 hover:text-[#1A1A18]'
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white card-shadow text-[#1A1A18]' : 'text-[#1A1A18]/30 hover:text-[#1A1A18]'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt Grid (3-column layout on desktop) */}
            {filteredPrompts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 sm:gap-x-8 gap-y-6 sm:gap-y-12'
                    : 'flex flex-col gap-6'
                }
              >
                <AnimatePresence mode="popLayout">
                  {filteredPrompts.map((prompt) => (
                    <div key={prompt.id}>
                      <PromptCard prompt={prompt} />
                    </div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 sm:py-20 bg-[#F7F8FC] rounded-3xl border border-[#E8E9F0] px-4">
                <p className="font-display font-bold text-xl sm:text-2xl text-[#1A1A18] mb-2">No prompts found</p>
                <p className="text-xs sm:text-sm text-[#8B8E9A] mb-6">Try clearing some of your filter criteria.</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#1A1A18] text-white font-bold rounded-xl hover:bg-[#3A3A42] transition-colors text-xs sm:text-sm"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-[#E8E9F0] flex items-center justify-between">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-black text-[#1A1A18]/40 hover:text-[#1A1A18] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              {/* Desktop pagination numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                      currentPage === page
                        ? 'bg-[#1A1A18] text-white'
                        : 'hover:bg-[#F7F8FC] text-[#1A1A18]/40 hover:text-[#1A1A18]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="w-10 h-10 flex items-center justify-center text-[#1A1A18]/20 text-xs font-bold">
                  ...
                </span>
                <button
                  onClick={() => setCurrentPage(21)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors ${
                    currentPage === 21
                      ? 'bg-[#1A1A18] text-white'
                      : 'hover:bg-[#F7F8FC] text-[#1A1A18]/40 hover:text-[#1A1A18]'
                  }`}
                >
                  21
                </button>
              </div>

              {/* Mobile page indicator */}
              <div className="sm:hidden text-xs font-bold text-[#1A1A18]/60">
                Page {currentPage} of 21
              </div>

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-black text-[#1A1A18] hover:text-[#8AAAFF] transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
