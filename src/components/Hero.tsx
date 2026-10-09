import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, CheckCircle2, Users, Zap } from 'lucide-react';
import { TextLoop } from './motion-primitives/text-loop';
import { TextShimmer } from './motion-primitives/text-shimmer';
import { TextEffect } from './motion-primitives/text-effect';
import { Magnetic } from './motion-primitives/magnetic';
import { motion } from 'motion/react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <section className="relative hero-gradient pt-28 pb-28 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none"></div>
      <div className="max-w-[1240px] mx-auto px-8 text-center relative">
        {/* Announcement Pill with subtle shimmer */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#F7F8FC] border border-[#E8E9F0] rounded-full text-[11px] font-bold font-display tracking-widest text-[#1A1A18]/50 mb-10 uppercase shadow-sm hover:border-[#8AAAFF]/50 transition-colors"
        >
          <span className="flex h-2 w-2 rounded-full bg-[#8AAAFF] animate-pulse"></span>
          <TextShimmer duration={2.4} className="font-bold text-[11px] text-[#1A1A18] tracking-widest uppercase">
            NEW: Midjourney V6.1 Packs available
          </TextShimmer>
        </motion.div>

        {/* Heading with smooth TextLoop */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 max-w-5xl mx-auto text-[#1A1A18] leading-[1.05]">
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
        <div className="max-w-2xl mx-auto mb-12">
          <TextEffect
            preset="fade-in-blur"
            speedReveal={1.3}
            className="text-lg md:text-xl text-[#1A1A18]/60 leading-relaxed font-medium"
          >
            Unlock the full potential of AI with our curated library of high-performance prompts for ChatGPT, Midjourney, and Claude.
          </TextEffect>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <div className="relative flex items-center group">
            <div className="absolute left-6 text-[#1A1A18]/30 flex items-center group-focus-within:text-[#8AAAFF] transition-colors pointer-events-none">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search prompts, creators, topics..."
              className="w-full h-20 pl-16 pr-8 bg-white border border-[#E8E9F0] rounded-[24px] focus:outline-none focus:ring-4 focus:ring-[#8AAAFF]/10 focus:border-[#8AAAFF] text-xl card-shadow transition-all font-medium group-hover:border-[#CBD0DF]"
            />
          </div>
        </motion.div>

        {/* CTA Buttons with Magnetic effect */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex flex-wrap justify-center items-center gap-5"
        >
          <Magnetic intensity={0.2} range={70}>
            <Link
              to="/browse"
              id="hero-browse"
              className="h-[64px] px-10 bg-[#1A1A18] text-white rounded-2xl font-bold text-lg flex items-center gap-3 hover:bg-[#3A3A42] transition-colors shadow-lg shadow-[#1A1A18]/5 active:scale-95"
            >
              Browse Prompts
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Magnetic>
          <Magnetic intensity={0.15} range={60}>
            <a
              href="#sell"
              id="hero-sell"
              className="h-[64px] px-10 bg-white border border-[#E8E9F0] text-[#1A1A18] rounded-2xl font-bold text-lg flex items-center hover:bg-[#F7F8FC] transition-colors active:scale-95"
            >
              Sell Your Prompts
            </a>
          </Magnetic>
        </motion.div>

        {/* Social Proof Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-20 pt-10 border-t border-[#E8E9F0] flex flex-wrap justify-center gap-16 text-[#1A1A18]/40 text-sm font-bold tracking-tight uppercase"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#8AAAFF]" /> 10,000+ Prompts
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#8AAAFF]" /> 50,000+ Users
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#8AAAFF]" /> Curated Selection
          </div>
        </motion.div>
      </div>
    </section>
  );
};

