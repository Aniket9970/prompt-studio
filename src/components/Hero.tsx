import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, CheckCircle2, Users, Zap } from 'lucide-react';
import { TextLoop } from './motion-primitives/text-loop';
import { TextEffect } from './motion-primitives/text-effect';
import { Magnetic } from './motion-primitives/magnetic';
import { motion } from 'motion/react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <section className="relative hero-gradient pt-12 sm:pt-20 md:pt-28 pb-12 sm:pb-20 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none"></div>
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 text-center relative">


        {/* Heading with smooth TextLoop */}
        <h1 className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-4 sm:mb-8 max-w-5xl mx-auto text-[#1A1A18] leading-[1.08] break-words">
          Discover{' '}
          <span className="text-[#8AAAFF] inline-block">
            <TextLoop
              interval={2.8}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="inline-block"
            >
              <span>Powerful</span>
              <span>Curated</span>
              <span>Trending</span>
              <span>Elite</span>
            </TextLoop>
          </span>
          <br />
          AI Prompts
        </h1>

        {/* Subtitle with fade-in-blur TextEffect */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-2 sm:px-0">
          <TextEffect
            preset="fade-in-blur"
            speedReveal={1.3}
            className="text-base sm:text-lg md:text-xl text-[#1A1A18]/60 leading-relaxed font-medium"
          >
            Unlock the full potential of AI with our curated library of high-performance prompts for Claude, Google Studio, Codex, and Cursor.
          </TextEffect>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="max-w-2xl mx-auto mb-6 sm:mb-10"
        >
          <div className="relative flex items-center group">
            <div className="absolute left-4 sm:left-6 text-[#1A1A18]/30 flex items-center group-focus-within:text-[#8AAAFF] transition-colors pointer-events-none">
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search prompts, creators, topics..."
              className="w-full h-14 sm:h-20 pl-12 sm:pl-16 pr-4 sm:pr-8 bg-white border border-[#E8E9F0] rounded-2xl sm:rounded-[24px] focus:outline-none focus:ring-4 focus:ring-[#8AAAFF]/10 focus:border-[#8AAAFF] text-base sm:text-xl card-shadow transition-all font-medium group-hover:border-[#CBD0DF]"
            />
          </div>
        </motion.div>

        {/* CTA Buttons with Magnetic effect */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-3 sm:gap-5 w-full max-w-xs sm:max-w-none mx-auto"
        >
          <Magnetic intensity={0.2} range={70}>
            <Link
              to="/browse"
              id="hero-browse"
              className="w-full sm:w-auto h-13 sm:h-[64px] px-8 sm:px-10 py-3.5 sm:py-0 bg-[#1A1A18] text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-[#3A3A42] transition-colors shadow-lg shadow-[#1A1A18]/5 active:scale-95"
            >
              <span>Browse Prompts</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </Magnetic>
          <Magnetic intensity={0.15} range={60}>
            <Link
              to="/browse#categories"
              id="hero-sell"
              className="w-full sm:w-auto h-13 sm:h-[64px] px-8 sm:px-10 py-3.5 sm:py-0 bg-white border border-[#E8E9F0] text-[#1A1A18] rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center hover:bg-[#F7F8FC] transition-colors active:scale-95"
            >
              Explore Categories
            </Link>
          </Magnetic>
        </motion.div>

        {/* Social Proof Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-[#E8E9F0] flex flex-wrap justify-center gap-6 sm:gap-12 md:gap-16 text-[#1A1A18]/40 text-xs sm:text-sm font-bold tracking-tight uppercase"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#8AAAFF]" /> 10,000+ Prompts
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#8AAAFF]" /> 50,000+ Users
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#8AAAFF]" /> Curated Selection
          </div>
        </motion.div>
      </div>
    </section>
  );
};

