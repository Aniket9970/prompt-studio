import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Star,
  StarHalf,
  BadgeCheck,
  Zap,
  Camera,
  Sun,
  Layout,
  ShoppingCart,
  Info,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Heart,
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

export const PromptDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { prompts, getPromptById } = usePrompts();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [activeTab, setActiveTab] = useState<'Description' | 'Use Cases' | 'Examples'>('Description');
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  // Find prompt by ID or fallback to first prompt
  const prompt = (id ? getPromptById(id) : undefined) || prompts[0];
  const relatedPrompts = prompt ? prompts.filter((p) => p.id !== prompt.id).slice(0, 4) : [];

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
    <div className="bg-[#FFFEFB] pb-32">
      {/* Breadcrumb & Preview Header */}
      <div className="max-w-[1240px] mx-auto px-8 pt-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-[#1A1A18]/30 uppercase tracking-widest mb-8">
          <Link to="/" className="hover:text-[#1A1A18] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/browse" className="hover:text-[#1A1A18] transition-colors">
            Marketplace
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1A1A18]/60">{prompt.title}</span>
        </nav>

        {/* Hero Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Left: 16/9 Preview Image with 3D Tilt & BorderTrail */}
          <div className="lg:col-span-8">
            <Tilt
              rotationFactor={5}
              className="w-full"
            >
              <div className="relative group rounded-[32px] overflow-hidden bg-[#EEF0F5] aspect-[16/9] card-shadow border border-[#E8E9F0]">
                <BorderTrail
                  size={120}
                  className="bg-gradient-to-r from-transparent via-[#8AAAFF] to-transparent opacity-60"
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                />
                {prompt.previewVideo ? (
                  <video
                    src={prompt.previewVideo}
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
                    <span className="font-display text-4xl font-bold text-[#CBD0DF]">{prompt.title}</span>
                  </div>
                )}
                <div className="absolute top-6 right-6 px-4 py-2 bg-white/95 backdrop-blur-md rounded-xl text-[12px] font-black tracking-widest text-[#1A1A18] uppercase shadow-sm z-10">
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
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#8AAAFF]">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <StarHalf className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[14px] font-bold text-[#1A1A18]/60">
                  {prompt.rating || 4.8}/5 ({prompt.reviewsCount || 247} reviews)
                </span>
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4 text-[#1A1A18]">
                {prompt.title}
              </h1>
              <div className="text-3xl font-black text-[#1A1A18] mb-8">
                {typeof prompt.price === 'number' ? `$${prompt.price.toFixed(2)}` : prompt.price}
              </div>
            </motion.div>

            {/* Creator Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center justify-between p-6 bg-[#F7F8FC] border border-[#E8E9F0] rounded-[24px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#E8E9F0] border border-[#1A1A18]/5 overflow-hidden">
                  <img
                    src={prompt.creator.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator'}
                    alt={prompt.creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-[16px] text-[#1A1A18]">@{prompt.creator.handle}</span>
                    <BadgeCheck className="w-4 h-4 text-[#8AAAFF]" />
                  </div>
                  <p className="text-xs font-bold text-[#1A1A18]/30 uppercase tracking-widest">
                    {prompt.creator.followers || '1.2k Followers'}
                  </p>
                </div>
              </div>
              <Magnetic intensity={0.15} range={50}>
                <button className="px-6 py-2 bg-white border border-[#E8E9F0] text-xs font-bold rounded-xl hover:bg-[#F7F8FC] transition-colors uppercase tracking-widest text-[#1A1A18] shadow-sm">
                  Follow
                </button>
              </Magnetic>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Tabs & Sticky Purchase Sidebar */}
      <div className="max-w-[1240px] mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 mb-32">
        {/* Left: Tab Content */}
        <div className="lg:col-span-8">
          <div className="border-b border-[#E8E9F0] pb-2 flex gap-2 mb-10">
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
                  className={`px-5 py-2.5 text-[14px] font-bold uppercase tracking-widest rounded-xl transition-colors z-10 ${
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
              <div className="text-[#1A1A18]/70 text-lg leading-relaxed mb-12">
                <p className="mb-6">{prompt.description}</p>
                <p className="mb-6">
                  Create stunning, hyper-realistic cinematic portraits set in a futuristic Neo-Tokyo environment. This prompt is meticulously engineered to balance neon lighting, complex lens flares, and skin textures that look indistinguishable from real photography.
                </p>

                <h3 className="font-display text-2xl font-bold text-[#1A1A18] mb-6 tracking-tight">
                  Key Features
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 mb-12">
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 flex-shrink-0 bg-[#8AAAFF]/10 text-[#8AAAFF] rounded-lg flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold text-[#1A1A18]">Optimized for V6.1</span>
                      <span className="text-sm text-[#1A1A18]/50">Leverages the latest Midjourney parameters.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 flex-shrink-0 bg-[#8AAAFF]/10 text-[#8AAAFF] rounded-lg flex items-center justify-center">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold text-[#1A1A18]">DSLR Quality</span>
                      <span className="text-sm text-[#1A1A18]/50">Includes specific camera settings for depth.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 flex-shrink-0 bg-[#8AAAFF]/10 text-[#8AAAFF] rounded-lg flex items-center justify-center">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold text-[#1A1A18]">Neon Dynamics</span>
                      <span className="text-sm text-[#1A1A18]/50">Expert handling of high-contrast lighting.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-1 w-6 h-6 flex-shrink-0 bg-[#8AAAFF]/10 text-[#8AAAFF] rounded-lg flex items-center justify-center">
                      <Layout className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block font-bold text-[#1A1A18]">Infinite Variety</span>
                      <span className="text-sm text-[#1A1A18]/50">Works with any subject, age, or gender.</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Customer Reviews Section */}
              <div className="pt-12 border-t border-[#E8E9F0]">
                <div className="flex items-center justify-between mb-12">
                  <h3 className="font-display text-3xl font-bold tracking-tight text-[#1A1A18]">
                    Customer Reviews
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex text-[#8AAAFF]">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <StarHalf className="w-4 h-4 fill-current" />
                    </div>
                    <span className="font-bold text-[#1A1A18]">4.8 Average</span>
                  </div>
                </div>

                <div className="space-y-8 mb-12">
                  <div className="p-8 bg-[#F7F8FC] border border-[#E8E9F0] rounded-[24px]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8E9F0] overflow-hidden">
                          <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
                            alt="Alex Rivers"
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1A18]">Alex Rivers</p>
                          <p className="text-xs text-[#1A1A18]/30 font-bold uppercase tracking-widest">
                            2 days ago
                          </p>
                        </div>
                      </div>
                      <div className="flex text-[#8AAAFF]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#1A1A18]/70 leading-relaxed">
                      Absolutely phenomenal prompt. The lighting is exactly what I was looking for. Highly recommend for any character design projects.
                    </p>
                  </div>

                  <div className="p-8 bg-[#F7F8FC] border border-[#E8E9F0] rounded-[24px]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#E8E9F0] overflow-hidden">
                          <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                            alt="Sarah K."
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1A18]">Sarah K.</p>
                          <p className="text-xs text-[#1A1A18]/30 font-bold uppercase tracking-widest">
                            1 week ago
                          </p>
                        </div>
                      </div>
                      <div className="flex text-[#8AAAFF]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[#1A1A18]/70 leading-relaxed">
                      The skin textures are incredible. A bit complex to tweak at first but once you get the hang of it, the results are elite.
                    </p>
                  </div>
                </div>

                <button className="text-[14px] font-bold text-[#8AAAFF] uppercase tracking-widest hover:underline">
                  View all 247 reviews
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Use Cases' && (
            <div className="space-y-6 text-[#1A1A18]/80 text-lg leading-relaxed">
              <div className="p-6 bg-[#F7F8FC] rounded-2xl border border-[#E8E9F0]">
                <h4 className="font-bold text-xl mb-2 text-[#1A1A18]">Character Design & Concept Art</h4>
                <p>Ideal for video game hero models, anime cover art, and graphic novel prototyping.</p>
              </div>
              <div className="p-6 bg-[#F7F8FC] rounded-2xl border border-[#E8E9F0]">
                <h4 className="font-bold text-xl mb-2 text-[#1A1A18]">Album & Poster Artwork</h4>
                <p>Generates high-contrast neon compositions ready for editorial vinyl covers and promotional posters.</p>
              </div>
            </div>
          )}

          {activeTab === 'Examples' && (
            <div className="space-y-6">
              <div className="p-6 bg-[#1A1A18] text-white rounded-2xl font-mono text-sm leading-relaxed overflow-x-auto">
                {prompt.promptTemplate || '/imagine prompt: cyberpunk portrait in Neo-Tokyo --v 6.1 --style raw'}
              </div>
            </div>
          )}
        </div>

        {/* Right: Purchase Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-28">
            <div className="bg-white border border-[#E8E9F0] rounded-[32px] p-8 card-shadow">
              <div className="text-4xl font-black text-[#1A1A18] mb-8">
                {typeof prompt.price === 'number' ? `$${prompt.price.toFixed(2)}` : prompt.price}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mb-10">
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
                    className="w-full h-[64px] bg-[#1A1A18] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#3A3A42] transition-colors shadow-sm active:scale-95"
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
                    className="w-full h-[64px] bg-white border border-[#E8E9F0] text-[#1A1A18] rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-[#F7F8FC] transition-colors active:scale-95"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {added ? 'Added to Cart!' : 'Add to Collection'}
                  </button>
                </Magnetic>
                <button
                  type="button"
                  onClick={() => toggleFavorite(prompt)}
                  className={`w-full h-[52px] rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 ${
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
              <div className="space-y-4 pt-8 border-t border-[#E8E9F0]">
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest">Downloads</span>
                  <span className="text-[#1A1A18]">{prompt.downloads || '3.4k'}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest">Uses</span>
                  <span className="text-[#1A1A18]">{prompt.uses || '12k+'}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest">Likes</span>
                  <span className="text-[#1A1A18]">{prompt.likes || 892}</span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest">License</span>
                  <span className="flex items-center gap-1 text-[#1A1A18]">
                    Standard <Info className="w-3.5 h-3.5 text-[#8AAAFF]" />
                  </span>
                </div>
              </div>

              {/* Share Bar */}
              <div className="mt-10 pt-8 border-t border-[#E8E9F0] flex items-center justify-between text-[#1A1A18]/40">
                <span className="text-xs font-bold uppercase tracking-widest">Share Prompt</span>
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

      {/* Related Prompts Section */}
      {relatedPrompts.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-8 pt-16 border-t border-[#E8E9F0]">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#1A1A18]">
              Explore More from This Creator
            </h2>
            <Link
              to="/browse"
              className="text-[14px] font-bold text-[#8AAAFF] hover:text-[#1A1A18] transition-colors uppercase tracking-widest"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedPrompts.map((related) => (
              <PromptCard key={related.id} prompt={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
