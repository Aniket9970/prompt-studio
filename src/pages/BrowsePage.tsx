import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, LayoutGrid, List, ArrowLeft, ArrowRight } from 'lucide-react';
import { usePrompts } from '../context/PromptsContext';
import { PromptCard } from '../components/PromptCard';
import { motion, AnimatePresence } from 'motion/react';
import { TextLoop } from '../components/motion-primitives/text-loop';
import { TextEffect } from '../components/motion-primitives/text-effect';

export const BrowsePage: React.FC = () => {
  const { prompts } = usePrompts();
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
      if (selectedCategories.length > 0 && !selectedCategories.includes(prompt.category)) {
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
    });
  }, [search, selectedCategories, selectedModels, maxPrice, minRating4]);

  return (
    <div className="bg-[#FFFEFB] pb-24">
      {/* Page Header */}
      <header className="relative py-20 border-b border-[#E8E9F0] overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none"></div>
        <div className="max-w-[1240px] mx-auto px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 text-[#1A1A18]">
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
            <div className="text-lg text-[#1A1A18]/60 font-medium mb-10 max-w-2xl">
              <TextEffect preset="fade-in-blur" speedReveal={1.2}>
                Discover 247 high-performance prompt assets for your creative projects.
              </TextEffect>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col md:flex-row gap-4 items-stretch"
          >
            <div className="relative flex-1 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1A1A18]/30 group-focus-within:text-[#8AAAFF] transition-colors w-5 h-5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts, tools, or styles..."
                className="w-full h-[60px] pl-16 pr-6 bg-white border border-[#E8E9F0] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#8AAAFF]/10 focus:border-[#8AAAFF] text-lg card-shadow transition-all font-medium"
              />
            </div>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center justify-center gap-2 h-[60px] px-8 bg-white border border-[#E8E9F0] rounded-2xl font-bold transition-colors hover:bg-[#F7F8FC]"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </motion.div>
        </div>
      </header>


      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar Filters */}
          <aside className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block w-full lg:w-[280px] shrink-0`}>
            <div className="lg:sticky lg:top-32 space-y-10">
              {/* Category Filter */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[#1A1A18]/40">
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
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 no-scrollbar">
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
                        className="w-5 h-5 rounded-md border-[#E8E9F0] text-[#8AAAFF] focus:ring-[#8AAAFF] cursor-pointer"
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
                <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[#1A1A18]/40 mb-6">
                  Experience Format
                </h3>
                <div className="space-y-4">
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
                        className="w-5 h-5 rounded-md border-[#E8E9F0] text-[#8AAAFF] focus:ring-[#8AAAFF] cursor-pointer"
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[#1A1A18]/40">
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
                <div className="flex justify-between mt-3 text-[12px] font-bold text-[#1A1A18]/30">
                  <span>Free</span>
                  <span>Premium</span>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-widest text-[#1A1A18]/40 mb-6">
                  Rating
                </h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={minRating4}
                    onChange={(e) => setMinRating4(e.target.checked)}
                    className="w-5 h-5 rounded-md border-[#E8E9F0] text-[#8AAAFF] focus:ring-[#8AAAFF] cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-[15px] font-bold text-[#1A1A18]/70">4.0 & Up</span>
                  </div>
                </label>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetFilters}
                className="w-full py-4 bg-[#F7F8FC] border border-[#E8E9F0] rounded-xl text-sm font-bold text-[#1A1A18]/60 hover:text-[#1A1A18] hover:border-[#1A1A18]/20 transition-standard"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Top Sorting & View Controls */}
            <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
              <div className="text-[14px] font-bold text-[#1A1A18]/40">
                Showing {filteredPrompts.length > 0 ? `1-${filteredPrompts.length}` : '0'} of {prompts.length} web & app templates
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#1A1A18]/40 uppercase tracking-wider">
                    Sort by:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-bold text-[#1A1A18] focus:outline-none cursor-pointer border-none"
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
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-white card-shadow text-[#1A1A18]' : 'text-[#1A1A18]/30 hover:text-[#1A1A18]'
                    }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-white card-shadow text-[#1A1A18]' : 'text-[#1A1A18]/30 hover:text-[#1A1A18]'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Prompt Grid (3-column layout on desktop) */}
            {filteredPrompts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12'
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
              <div className="text-center py-20 bg-[#F7F8FC] rounded-3xl border border-[#E8E9F0]">
                <p className="font-display font-bold text-2xl text-[#1A1A18] mb-2">No prompts found</p>
                <p className="text-[#8B8E9A] mb-6">Try clearing some of your filter criteria.</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-[#1A1A18] text-white font-bold rounded-xl hover:bg-[#3A3A42] transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="mt-20 pt-10 border-t border-[#E8E9F0] flex items-center justify-between">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="flex items-center gap-2 text-sm font-black text-[#1A1A18]/40 hover:text-[#1A1A18] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1">
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

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                className="flex items-center gap-2 text-sm font-black text-[#1A1A18] hover:text-[#8AAAFF] transition-colors"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
