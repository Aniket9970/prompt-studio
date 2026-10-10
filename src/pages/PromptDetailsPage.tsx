import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Sparkles,
  BadgeCheck,
  Zap,
  ShoppingCart,
  Info,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Heart,
  Lock,
} from 'lucide-react';
import { usePrompts } from '../context/PromptsContext';
import { PromptCard } from '../components/PromptCard';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { motion } from 'motion/react';
import { Tilt } from '../components/motion-primitives/tilt';
import { BorderTrail } from '../components/motion-primitives/border-trail';
import { Magnetic } from '../components/motion-primitives/magnetic';
import { AnimatedBackground } from '../components/motion-primitives/animated-background';
import { useAuth, useClerk } from '@clerk/react';
import { getSafeMediaUrl } from '../lib/utils';

export const PromptDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prompts, isLoading, getPromptById, trackPromptCopy, trackPromptView, fetchPromptVideo } = usePrompts();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [activeTab, setActiveTab] = useState<'Description' | 'Use Cases' | 'Examples'>('Description');
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  // Find prompt by ID or fallback to first prompt only when no ID in URL
  const prompt = id ? getPromptById(id) : prompts[0];
  const relatedPrompts = prompt ? prompts.filter((p) => p.id !== prompt.id).slice(0, 4) : [];

  useEffect(() => {
    if (prompt?.id) {
      trackPromptView(prompt.id);
      if (!prompt.previewVideo) {
        fetchPromptVideo(prompt.id);
      }
    }
  }, [prompt?.id, prompt?.previewVideo, trackPromptView, fetchPromptVideo]);

  if (isLoading && !prompt) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-[#FFFEFB]">
        <div className="w-8 h-8 border-2 border-[#1A1A18] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-[#8B8E9A]">Loading prompt details...</p>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 text-center bg-[#FFFEFB]">
        <div className="w-16 h-16 bg-[#F7F8FC] border border-[#E8E9F0] rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#1A1A18]">
          <Zap className="w-7 h-7 text-[#8AAAFF]" />
        </div>
        <h2 className="font-display text-3xl font-extrabold text-[#1A1A18] mb-2">Prompt Not Found</h2>
        <p className="text-sm text-[#8B8E9A] max-w-md mx-auto mb-8">
          This prompt does not exist or has been removed from the studio catalog.
        </p>
        <Link
          to="/browse"
          className="px-6 py-3.5 bg-[#1A1A18] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#333333] transition-colors shadow-sm"
        >
          Explore Marketplace
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(prompt);
    setAdded(true);
    setTimeout(() => {
      navigate('/cart');
    }, 400);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#FFFEFB] pb-28 sm:pb-32">
      {/* Breadcrumb & Preview Header */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-4 sm:pt-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-[#1A1A18]/40 uppercase tracking-widest mb-6 sm:mb-8 overflow-hidden text-ellipsis whitespace-nowrap">
          <Link to="/" className="hover:text-[#1A1A18] transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to="/browse" className="hover:text-[#1A1A18] transition-colors shrink-0">
            Marketplace
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[#1A1A18]/70 truncate">{prompt.title}</span>
        </nav>

        {/* Hero Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 sm:mb-20">
          {/* Left: 16/9 Preview Image with 3D Tilt & BorderTrail */}
          <div className="lg:col-span-8">
            <Tilt
              rotationFactor={5}
              className="w-full"
            >
              <div className="relative group rounded-2xl sm:rounded-[32px] overflow-hidden bg-[#EEF0F5] aspect-[16/9] card-shadow border border-[#E8E9F0]">
                <BorderTrail
                  size={120}
                  className="bg-gradient-to-r from-transparent via-[#8AAAFF] to-transparent opacity-60"
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                />
                {getSafeMediaUrl(prompt.previewVideo) ? (
                  <video
                    src={getSafeMediaUrl(prompt.previewVideo)}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : prompt.imageUrl ? (
                  <img
                    src={prompt.imageUrl}
                    alt={prompt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F7F8FC]">
                    <span className="font-display text-2xl sm:text-4xl font-bold text-[#CBD0DF]">{prompt.title}</span>
                  </div>
                )}
                <div className="absolute top-3 sm:top-6 right-3 sm:right-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/95 backdrop-blur-md rounded-xl text-[10px] sm:text-[12px] font-black tracking-widest text-[#1A1A18] uppercase shadow-sm z-10">
                  {prompt.typeLabel || prompt.category}
                </div>
              </div>
            </Tilt>
          </div>

          {/* Right: Quick Stats & Info */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#8AAAFF]/10 text-[#8AAAFF] border border-[#8AAAFF]/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official Studio Release
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Check className="w-3 h-3" />
                  Verified Prompt
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tighter mb-3 sm:mb-4 text-[#1A1A18]">
                {prompt.title}
              </h1>
              <div className="text-2xl sm:text-3xl font-black text-[#1A1A18] mb-6 sm:mb-8">
                {typeof prompt.price === 'number' ? `$${prompt.price.toFixed(2)}` : prompt.price}
              </div>
            </motion.div>

            {/* Creator Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center justify-between p-4 sm:p-6 bg-[#F7F8FC] border border-[#E8E9F0] rounded-2xl sm:rounded-[24px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#E8E9F0] border border-[#1A1A18]/5 overflow-hidden">
                  <img
                    src={prompt.creator.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator'}
                    alt={prompt.creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm sm:text-[16px] text-[#1A1A18]">@{prompt.creator.handle.replace(/^@+/, '')}</span>
                    <BadgeCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8AAAFF]" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-[#1A1A18]/30 uppercase tracking-widest">
                    {prompt.creator.followers || 'Official Studio'}
                  </p>
                </div>
              </div>
              <Magnetic intensity={0.15} range={50}>
                <button className="px-4 sm:px-6 py-2 bg-white border border-[#E8E9F0] text-xs font-bold rounded-xl hover:bg-[#F7F8FC] transition-colors uppercase tracking-widest text-[#1A1A18] shadow-sm">
                  Follow
                </button>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Tabs & Sticky Purchase Sidebar */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 sm:mb-32">
        {/* Left: Tab Content */}
        <div className="lg:col-span-8">
          <div className="border-b border-[#E8E9F0] pb-2 flex gap-2 mb-8 sm:mb-10 overflow-x-auto no-scrollbar">
            <AnimatedBackground
              defaultValue="Description"
              className="bg-[#1A1A18] rounded-xl"
              transition={{
                type: 'spring',
                bounce: 0.2,
                duration: 0.35,
              }}
              onValueChange={(val) => {
                if (val) setActiveTab(val as 'Description' | 'Use Cases' | 'Examples');
              }}
            >
              {(['Description', 'Use Cases', 'Examples'] as const).map((tab) => (
                <button
                  key={tab}
                  data-id={tab}
                  type="button"
                  className={`px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-[14px] font-bold uppercase tracking-widest rounded-xl transition-colors z-10 whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-white'
                      : 'text-[#1A1A18]/50 hover:text-[#1A1A18]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </AnimatedBackground>
          </div>

          {activeTab === 'Description' && (
            <div>
              <div className="text-[#1A1A18]/70 text-base sm:text-lg leading-relaxed mb-8 sm:mb-12">
                <p className="mb-4 sm:mb-6">{prompt.description}</p>
                {prompt.keyFeatures && prompt.keyFeatures.length > 0 && (
                  <>
                    <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1A1A18] mb-4 sm:mb-6 tracking-tight">
                      Key Features
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 list-none p-0 mb-8 sm:mb-12">
                      {prompt.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-1 w-6 h-6 flex-shrink-0 bg-[#8AAAFF]/10 text-[#8AAAFF] rounded-lg flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="block font-bold text-sm sm:text-base text-[#1A1A18]">{feat.title}</span>
                            <span className="text-xs sm:text-sm text-[#1A1A18]/50">{feat.subtitle}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Use Cases' && (
            <div className="space-y-4 sm:space-y-6 text-[#1A1A18]/80 text-base sm:text-lg leading-relaxed">
              <div className="p-5 sm:p-6 bg-[#F7F8FC] rounded-2xl border border-[#E8E9F0]">
                <h4 className="font-bold text-lg sm:text-xl mb-2 text-[#1A1A18]">Character Design & Concept Art</h4>
                <p className="text-sm sm:text-base">Ideal for video game hero models, anime cover art, and graphic novel prototyping.</p>
              </div>
              <div className="p-5 sm:p-6 bg-[#F7F8FC] rounded-2xl border border-[#E8E9F0]">
                <h4 className="font-bold text-lg sm:text-xl mb-2 text-[#1A1A18]">Album & Poster Artwork</h4>
                <p className="text-sm sm:text-base">Generates high-contrast neon compositions ready for editorial vinyl covers and promotional posters.</p>
              </div>
            </div>
          )}

          {activeTab === 'Examples' && (
            <div className="space-y-6">
              {isSignedIn ? (
                <div className="relative">
                  <div className="p-5 sm:p-6 bg-[#1A1A18] text-white rounded-2xl font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto border border-[#2E2E34] selection:bg-[#8AAAFF]/30">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-white/50">
                      <span>SYSTEM PROMPT & INSTRUCTION TEMPLATE</span>
                      <button
                        type="button"
                        onClick={() => {
                          const text = prompt.promptTemplate || prompt.promptSnippet || prompt.description;
                          navigator.clipboard.writeText(text);
                          trackPromptCopy(prompt.id);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-white hover:text-[#8AAAFF] flex items-center gap-1.5 transition-colors cursor-pointer font-sans text-xs font-bold"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Full Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm leading-relaxed">
                      {prompt.promptTemplate || prompt.description}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8E9F0] bg-[#1A1A18] shadow-sm">
                  {/* Blurred mock preview */}
                  <div className="p-6 sm:p-8 text-white/30 font-mono text-xs sm:text-sm leading-relaxed blur-md select-none pointer-events-none filter">
                    <p className="mb-2">// SYSTEM PROMPT & INSTRUCTION TEMPLATE (LOCKED)</p>
                    <p className="mb-2">You are an expert full-stack AI engineer and system architect. Generate production-ready layouts with responsive architecture, optimized component hierarchies, and interactive states...</p>
                    <p className="mb-2">Ensure high-fidelity fidelity, type safety, modular structures, and fast zero-latency rendering across all devices...</p>
                    <p className="mb-2">Include strict validation, resilient recovery mechanisms, and sleek aesthetic design guidelines...</p>
                    <p>Parameters: --style raw --v 6.1 --temperature 0.7 --seed 98214</p>
                  </div>

                  {/* Lock Overlay Modal */}
                  <div className="absolute inset-0 bg-[#1A1A18]/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#8AAAFF]/10 border border-[#8AAAFF]/30 flex items-center justify-center text-[#8AAAFF] mb-3 shadow-lg">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="font-display text-lg sm:text-xl font-extrabold text-white mb-1.5">
                      Prompt Template Locked
                    </h4>
                    <p className="text-xs sm:text-sm text-white/70 max-w-md mb-5 leading-relaxed">
                      Sign in or create a free account to unlock, view, and copy this full prompt template.
                    </p>
                    <button
                      type="button"
                      onClick={() => openSignIn()}
                      className="px-6 py-3 bg-[#8AAAFF] hover:bg-[#A3BFFF] text-[#1A1A18] rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sign In to Unlock Prompt</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Purchase Sidebar (Desktop & tablet) */}
        <div className="lg:col-span-4">
          <div className="sticky top-28">
            <div className="bg-white border border-[#E8E9F0] rounded-2xl sm:rounded-[32px] p-6 sm:p-8 card-shadow">
              <div className="text-3xl sm:text-4xl font-black text-[#1A1A18] mb-6 sm:mb-8">
                {typeof prompt.price === 'number' ? `$${prompt.price.toFixed(2)}` : prompt.price}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
                <Magnetic intensity={0.15} range={60}>
                  <button
                    onClick={() => {
                      if (!isSignedIn) {
                        openSignIn();
                        return;
                      }
                      const text = prompt.promptTemplate || prompt.promptSnippet || prompt.description;
                      navigator.clipboard.writeText(text);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="w-full h-14 sm:h-[64px] bg-[#1A1A18] text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-[#3A3A42] transition-colors shadow-sm active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 text-emerald-400" />
                        <span>Prompt Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 text-[#8AAAFF]" />
                        <span>Copy Prompt (Free)</span>
                      </>
                    )}
                  </button>
                </Magnetic>
                <Magnetic intensity={0.1} range={50}>
                  <button
                    onClick={handleAddToCart}
                    className="w-full h-14 sm:h-[64px] bg-white border border-[#E8E9F0] text-[#1A1A18] rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-[#F7F8FC] transition-colors active:scale-95"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>{added ? 'Added to Cart!' : 'Add to Collection'}</span>
                  </button>
                </Magnetic>
                <button
                  type="button"
                  onClick={() => toggleFavorite(prompt)}
                  className={`w-full h-12 sm:h-[52px] rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 ${
                    isFavorite(prompt.id)
                      ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                      : 'bg-white border-[#E8E9F0] text-[#1A1A18] hover:bg-[#F7F8FC]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite(prompt.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{isFavorite(prompt.id) ? 'Favourited' : 'Add to Favourites'}</span>
                </button>
              </div>

              {/* Stats Table */}
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8 border-t border-[#E8E9F0]">
                <div className="flex justify-between items-center text-xs sm:text-[13px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest">Format</span>
                  <span className="text-[#1A1A18]">{prompt.typeLabel || 'Web App'}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-[13px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest">Category</span>
                  <span className="text-[#1A1A18]">{prompt.category}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-[13px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest">Status</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Official Studio Release
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-[13px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest">License</span>
                  <span className="flex items-center gap-1 text-[#1A1A18]">
                    Commercial Ready <Info className="w-3.5 h-3.5 text-[#8AAAFF]" />
                  </span>
                </div>
              </div>

              {/* Share Bar */}
              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-[#E8E9F0] flex items-center justify-between text-[#1A1A18]/40">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest">Share Prompt</span>
                <div className="flex gap-4">
                  <a href="#twitter" aria-label="Twitter" className="hover:text-[#1A1A18] transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#linkedin" aria-label="LinkedIn" className="hover:text-[#1A1A18] transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <button onClick={handleCopyLink} aria-label="Copy Link" className="hover:text-[#1A1A18] transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar for Mobile Devices */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFEFB]/95 backdrop-blur-md border-t border-[#E8E9F0] p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-[#1A1A18]/40 tracking-wider">Price</span>
          <span className="font-display font-extrabold text-lg text-[#1A1A18]">
            {typeof prompt.price === 'number' ? `$${prompt.price.toFixed(2)}` : prompt.price}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => toggleFavorite(prompt)}
            className="p-3 rounded-xl border border-[#E8E9F0] bg-white text-[#1A1A18] hover:bg-[#F7F8FC] active:scale-95 transition-all"
            aria-label="Favorite prompt"
          >
            <Heart className={`w-4 h-4 ${isFavorite(prompt.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={() => {
              if (!isSignedIn) {
                openSignIn();
                return;
              }
              const text = prompt.promptTemplate || prompt.promptSnippet || prompt.description;
              navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="flex-1 max-w-[140px] h-11 bg-[#1A1A18] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#8AAAFF]" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 max-w-[140px] h-11 bg-[#8AAAFF] text-[#1A1A18] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{added ? 'Added!' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>

      {/* Related Prompts Section */}
      {relatedPrompts.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-4 sm:px-8 pt-12 sm:pt-16 border-t border-[#E8E9F0]">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <h2 className="font-display text-xl sm:text-3xl font-bold tracking-tight text-[#1A1A18]">
              More from This Creator
            </h2>
            <Link
              to="/browse"
              className="text-xs sm:text-[14px] font-bold text-[#8AAAFF] hover:text-[#1A1A18] transition-colors uppercase tracking-widest"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {relatedPrompts.map((related) => (
              <PromptCard key={related.id} prompt={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
