import React from 'react';
import { Link } from 'react-router-dom';
import { InView } from './motion-primitives/in-view';
import { BorderTrail } from './motion-primitives/border-trail';
import { Magnetic } from './motion-primitives/magnetic';
import { ArrowRight } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-14 sm:py-20 md:py-24 bg-[#1A1A18] text-white relative overflow-hidden">
      {/* Ambient Blue Radial Glow */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#8AAAFF]/15 blur-[120px] pointer-events-none"></div>

      {/* Decorative Border Trail at the bottom edge */}
      <BorderTrail
        size={120}
        className="bg-gradient-to-r from-transparent via-[#8AAAFF] to-transparent opacity-40"
        transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
      />

      <div className="max-w-[1152px] mx-auto px-4 sm:px-6 relative flex flex-col items-center text-center">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center w-full"
        >
          <h2 className="clash-display text-2xl sm:text-4xl md:text-5xl font-semibold mb-4 sm:mb-6 leading-tight">
            Start Creating Better with <br className="hidden sm:inline" /> Prompt Studio Today
          </h2>
          <p className="text-[#8B8E9A] text-base sm:text-lg max-w-xl mb-8 sm:mb-10 leading-relaxed px-2">
            Join thousands of creators who are already using Prompt Studio to level up their AI workflow and build better products.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto items-stretch sm:items-center justify-center max-w-xs sm:max-w-none">
            <Magnetic intensity={0.2} range={70}>
              <Link
                to="/browse"
                className="w-full sm:w-auto h-13 sm:h-[56px] px-8 sm:px-10 py-3.5 sm:py-0 bg-[#8AAAFF] text-[#1A1A18] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#B8C9FF] transition-colors shadow-sm active:scale-95 text-sm sm:text-base"
              >
                <span>Get Started for Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
            <Magnetic intensity={0.15} range={60}>
              <Link
                to="/browse"
                className="w-full sm:w-auto h-13 sm:h-[56px] px-8 sm:px-10 py-3.5 sm:py-0 bg-transparent border border-white/20 text-white rounded-xl font-semibold flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95 text-sm sm:text-base"
              >
                Browse Marketplace
              </Link>
            </Magnetic>
          </div>
        </InView>
      </div>
    </section>
  );
};

