import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Zap, ShieldCheck, LifeBuoy, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePrompts } from '../context/PromptsContext';
import { PromptCard } from '../components/PromptCard';
import { motion, AnimatePresence } from 'motion/react';
import { Magnetic } from '../components/motion-primitives/magnetic';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, subtotal, discount, total, promoCode, applyPromo, promoError } = useCart();
  const { prompts } = usePrompts();
  const [inputPromo, setInputPromo] = useState('');
  const [promoSuccess, setPromoSuccess] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPromo.trim()) return;
    const success = applyPromo(inputPromo);
    setPromoSuccess(success);
  };

  // Recommended prompts for bottom section
  const recommendedPrompts = prompts.slice(0, 4);

  return (
    <main className="min-h-screen pt-6 sm:pt-12 pb-20 sm:pb-32 relative overflow-hidden bg-[#FFFEFB]">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold tracking-tight uppercase text-[#1A1A18]/30 mb-6 sm:mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#1A1A18] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/browse" className="hover:text-[#1A1A18] transition-colors">
            Browse
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1A1A18]">Cart</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Cart Items */}
          <div className="flex-1">
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tighter mb-6 sm:mb-12">
              Your Cart <span className="text-[#1A1A18]/20">({cart.length})</span>
            </h1>

            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-[#E8E9F0] rounded-2xl sm:rounded-[32px] p-8 sm:p-12 text-center card-shadow mb-8 sm:mb-12"
              >
                <p className="text-lg sm:text-xl font-bold text-[#1A1A18]/60 mb-6">Your shopping cart is empty.</p>
                <Magnetic intensity={0.15} range={60}>
                  <Link
                    to="/browse"
                    className="inline-flex h-12 sm:h-14 px-6 sm:px-8 bg-[#1A1A18] text-white rounded-2xl font-bold items-center justify-center gap-2 hover:bg-[#3A3A42] transition-colors shadow-sm text-sm sm:text-base"
                  >
                    Browse Prompts <ArrowRight className="w-4 h-4" />
                  </Link>
                </Magnetic>
              </motion.div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={item.prompt.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                      className="group bg-white border border-[#E8E9F0] rounded-2xl sm:rounded-[32px] p-4 sm:p-6 card-shadow flex items-start sm:items-center gap-3.5 sm:gap-6 transition-all hover:border-[#8AAAFF]/40 hover:shadow-lg"
                    >
                      <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-[#EEF0F5] shrink-0">
                        <img
                          src={item.prompt.imageUrl}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          alt={item.prompt.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a1a/888?text=Image';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1 sm:mb-2">
                          <Link to={`/prompt/${item.prompt.id}`} className="hover:text-[#8AAAFF] transition-colors">
                            <h3 className="font-display font-bold text-base sm:text-xl truncate">{item.prompt.title}</h3>
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.prompt.id)}
                            className="text-[#1A1A18]/30 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-[#1A1A18]/40 uppercase tracking-widest mb-3 sm:mb-4">
                          <span>{item.prompt.typeLabel || item.prompt.model}</span>
                          <span className="w-1 h-1 rounded-full bg-[#E8E9F0]" />
                          <span className="truncate">
                            @{(item.prompt.creatorHandle || item.prompt.creator.handle).replace(/^@+/, '')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-[#E8E9F0] rounded-xl overflow-hidden bg-[#F7F8FC]">
                            <button
                              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#E8E9F0] transition-colors text-[#1A1A18]/50"
                              onClick={() => removeFromCart(item.prompt.id)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                            <span className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-xs sm:text-[14px]">
                              {item.quantity}
                            </span>
                            <button
                              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-[#E8E9F0] transition-colors text-[#1A1A18]/50"
                              disabled
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-base sm:text-lg font-black text-[#1A1A18]">
                              {typeof item.prompt.price === 'number' ? `$${item.prompt.price.toFixed(2)}` : 'Free'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Feature Guarantees */}
            <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-[#E8E9F0]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="flex items-center gap-3 sm:gap-4 text-[#1A1A18]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F7F8FC] rounded-2xl flex items-center justify-center text-[#8AAAFF] shrink-0">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-[14px]">Instant Access</p>
                    <p className="text-[10px] sm:text-xs font-bold text-[#1A1A18]/30 uppercase tracking-wider">Download immediately</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-[#1A1A18]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F7F8FC] rounded-2xl flex items-center justify-center text-[#8AAAFF] shrink-0">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-[14px]">Verified Quality</p>
                    <p className="text-[10px] sm:text-xs font-bold text-[#1A1A18]/30 uppercase tracking-wider">Every prompt tested</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 text-[#1A1A18]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#F7F8FC] rounded-2xl flex items-center justify-center text-[#8AAAFF] shrink-0">
                    <LifeBuoy className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-xs sm:text-[14px]">Lifetime Support</p>
                    <p className="text-[10px] sm:text-xs font-bold text-[#1A1A18]/30 uppercase tracking-wider">Updates included</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <aside className="w-full lg:w-[400px]">
            <div className="bg-[#F7F8FC] border border-[#E8E9F0] rounded-2xl sm:rounded-[32px] p-5 sm:p-8 sticky top-28 card-shadow">
              <h2 className="font-display text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <div className="flex justify-between items-center text-sm sm:text-[15px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-wider text-xs">Subtotal</span>
                  <span className="text-[#1A1A18]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm sm:text-[15px] font-bold text-[#28C840]">
                    <span className="uppercase tracking-wider text-xs">Discount ({promoCode})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm sm:text-[15px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-wider text-xs">Tax (Est.)</span>
                  <span className="text-[#1A1A18]">$0.00</span>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-[#E8E9F0] flex justify-between items-end">
                  <span className="font-display font-bold text-base sm:text-lg">Total</span>
                  <span className="font-display font-black text-2xl sm:text-3xl text-[#1A1A18]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="mb-6 sm:mb-8">
                <label htmlFor="promo" className="block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] text-[#1A1A18]/30 mb-2 sm:mb-3">
                  Promo Code
                </label>
                <div className="relative flex gap-2">
                  <input
                    type="text"
                    id="promo"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                    placeholder="CODE (e.g. WELCOME10)"
                    className="flex-1 min-w-0 h-11 sm:h-12 px-3 sm:px-4 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] font-bold text-xs sm:text-sm tracking-wider uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 sm:px-5 bg-[#1A1A18] text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-[#3A3A42] transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 font-bold mt-2">{promoError}</p>}
                {promoSuccess && <p className="text-xs text-[#28C840] font-bold mt-2">Promo code applied successfully!</p>}
              </form>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Magnetic intensity={0.15} range={60}>
                  <Link
                    to="/checkout"
                    className="w-full h-14 sm:h-[64px] bg-[#1A1A18] text-white rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-[#3A3A42] transition-colors shadow-xl shadow-[#1A1A18]/10 active:scale-95"
                  >
                    Checkout Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </Magnetic>
                <Magnetic intensity={0.1} range={50}>
                  <Link
                    to="/browse"
                    className="w-full h-12 sm:h-[64px] bg-white border border-[#E8E9F0] text-[#1A1A18] rounded-2xl font-bold text-sm sm:text-lg flex items-center justify-center hover:bg-[#EEF0F5] transition-colors active:scale-95"
                  >
                    Continue Shopping
                  </Link>
                </Magnetic>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Recommended Section */}
      {recommendedPrompts.length > 0 && (
        <section className="py-12 sm:py-24 border-t border-[#E8E9F0] mt-12 sm:mt-24">
          <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
              {recommendedPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
