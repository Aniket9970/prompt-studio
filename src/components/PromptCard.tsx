import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PromptItem } from '../types';
import { Image as ImageIcon, FileText, Music, BarChart2, Copy, Check, Sparkles } from 'lucide-react';
import { Tilt } from './motion-primitives/tilt';
import { BorderTrail } from './motion-primitives/border-trail';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, useClerk } from '@clerk/react';

interface PromptCardProps {
  prompt: PromptItem;
}

const fallbackIcons: Record<string, React.FC<{ className?: string }>> = {
  Image: ImageIcon,
  FileText: FileText,
  Music: Music,
  BarChart: BarChart2,
};

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [imageError, setImageError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const FallbackIcon = prompt.fallbackIcon ? fallbackIcons[prompt.fallbackIcon] || ImageIcon : ImageIcon;

  // Use IntersectionObserver to only load and decode videos when card is near the viewport
  useEffect(() => {
    if (!prompt.previewVideo) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsInViewport(entry.isIntersecting);
      },
      { rootMargin: '200px 0px 200px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [prompt.previewVideo]);

  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  // Play/pause video based on viewport visibility to free GPU during 144Hz scroll
  useEffect(() => {
    if (!videoRef.current) return;
    if (isInViewport) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInViewport]);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      openSignIn();
      return;
    }

    const textToCopy = prompt.promptTemplate || prompt.promptSnippet || prompt.description;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={cardRef} className="h-full w-full [content-visibility:auto] [contain-intrinsic-size:380px_450px]">
      <Tilt
        rotationFactor={5}
        isRevese={false}
        className="h-full flex"
      >
        <div className="group relative w-full bg-white border border-[#E8E9F0] rounded-[28px] overflow-hidden card-shadow flex flex-col hover:-translate-y-1 transition-transform duration-200">
          {/* Subtle animated border trail on popular prompts when hovered */}
          {prompt.isPopular && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <BorderTrail
                size={90}
                className="bg-gradient-to-r from-transparent via-[#8AAAFF] to-transparent opacity-80"
                transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
              />
            </div>
          )}

          {/* Visual / Video Area */}
          <div className="aspect-[16/10] bg-[#EEF0F5] relative overflow-hidden">
            <Link to={`/prompt/${prompt.id}`} className="block w-full h-full relative group">
              {prompt.previewVideo && isInViewport ? (
                <div className="w-full h-full relative overflow-hidden bg-black/5">
                  <video
                    ref={videoRef}
                    src={prompt.previewVideo}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Live Stream / Preview Glow indicator */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full flex items-center gap-1.5 text-[10px] font-bold text-white tracking-wider z-10 border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>PREVIEW</span>
                  </div>
                </div>
              ) : prompt.imageUrl && !imageError ? (
              <img
                src={prompt.imageUrl}
                alt={prompt.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-[#F7F8FC] flex items-center justify-center">
                <FallbackIcon className="w-12 h-12 text-[#CBD0DF]" />
              </div>
            )}
          </Link>

          {/* Quick Copy Prompt Button overlaid on image */}
          <button
            onClick={handleCopyPrompt}
            type="button"
            title="Copy prompt to clipboard"
            className={`absolute bottom-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-md backdrop-blur-md ${
              copied
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-white/95 text-[#1A1A18] hover:bg-white hover:scale-105 active:scale-95 border border-[#E8E9F0]'
            }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1 text-[11px]"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Copied!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3.5 h-3.5 text-[#1A1A18]/60 group-hover:text-[#8AAAFF]" />
                  <span>Copy Prompt</span>
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Tag Pill */}
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black tracking-wider text-[#1A1A18] uppercase shadow-sm border border-[#E8E9F0]/60 pointer-events-none z-10 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8AAAFF]" />
            <span>{prompt.category}</span>
          </div>
        </div>

        {/* Details Area */}
        <div className="p-6 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8AAAFF] bg-[#8AAAFF]/10 px-2.5 py-0.5 rounded-full">
                {prompt.typeLabel || prompt.category}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                Free
              </span>
            </div>

            <h3 className="font-display font-bold text-base leading-snug mb-2 text-[#1A1A18] transition-colors group-hover:text-[#8AAAFF]">
              <Link to={`/prompt/${prompt.id}`} className="hover:underline underline-offset-2 line-clamp-1">
                {prompt.title}
              </Link>
            </h3>

            <p className="text-xs text-[#6B6D75] line-clamp-2 leading-relaxed mb-4">
              {prompt.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#F0F1F6] mt-auto">
            <div className="flex items-center gap-2">
              {prompt.creator.avatarUrl ? (
                <img
                  src={prompt.creator.avatarUrl}
                  alt={prompt.creator.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#E8E9F0]"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#E8E9F0] flex items-center justify-center text-[10px] font-bold text-[#8B8E9A]">
                  {prompt.creator.name.charAt(0)}
                </div>
              )}
              <span className="text-xs font-semibold text-[#1A1A18]/70">@{prompt.creator.handle}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                FREE
              </span>
              <Link
                to={`/prompt/${prompt.id}`}
                className="text-xs font-bold text-[#1A1A18]/40 hover:text-[#1A1A18] transition-colors"
              >
                Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
    </div>
  );
};
