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
    <main className="min-h-screen pt-12 pb-32 relative overflow-hidden bg-[#FFFEFB]">
      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-8 relative">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-3 text-sm font-bold tracking-tight uppercase text-[#1A1A18]/30 mb-8" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#1A1A18] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/browse" className="hover:text-[#1A1A18] transition-colors">
            Browse
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#1A1A18]">Shopping Cart</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Cart Items */}
          <div className="flex-1">
            <h1 className="font-display text-5xl font-extrabold tracking-tighter mb-12">
              Your Cart <span className="text-[#1A1A18]/20">({cart.length})</span>
            </h1>

            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-[#E8E9F0] rounded-[32px] p-12 text-center card-shadow mb-12"
              >
                <p className="text-xl font-bold text-[#1A1A18]/60 mb-6">Your shopping cart is empty.</p>
                <Magnetic intensity={0.15} range={60}>
                  <Link
                    to="/browse"
                    className="inline-flex h-14 px-8 bg-[#1A1A18] text-white rounded-2xl font-bold items-center justify-center gap-2 hover:bg-[#3A3A42] transition-colors shadow-sm"
                  >
                    Browse Prompts <ArrowRight className="w-4 h-4" />
                  </Link>
                </Magnetic>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div
                      key={item.prompt.id}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -30, transition: { duration: 0.25 } }}
                      className="group bg-white border border-[#E8E9F0] rounded-[32px] p-6 card-shadow flex items-center gap-8 transition-all hover:border-[#8AAAFF]/40 hover:shadow-lg"
                    >
                      <div className="w-32 h-32 rounded-2xl overflow-hidden bg-[#EEF0F5] shrink-0">
                        <img
                          src={item.prompt.imageUrl}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          alt={item.prompt.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a1a/888?text=Image';
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <Link to={`/prompt/${item.prompt.id}`} className="hover:text-[#8AAAFF] transition-colors">
                            <h3 className="font-display font-bold text-xl">{item.prompt.title}</h3>
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.prompt.id)}
                            className="text-[#1A1A18]/30 hover:text-red-500 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-[#1A1A18]/40 uppercase tracking-widest mb-4">
                          <span>{item.prompt.typeLabel || item.prompt.model}</span>
                          <span className="w-1 h-1 rounded-full bg-[#E8E9F0]" />
                          <span>By @{item.prompt.creatorHandle || item.prompt.creator.handle}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-[#E8E9F0] rounded-xl overflow-hidden bg-[#F7F8FC]">
                            <button
                              className="w-10 h-10 flex items-center justify-center hover:bg-[#E8E9F0] transition-colors text-[#1A1A18]/50"
                              onClick={() => removeFromCart(item.prompt.id)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 h-10 flex items-center justify-center font-bold text-[14px]">
                              {item.quantity}
                            </span>
                            <button
                              className="w-10 h-10 flex items-center justify-center hover:bg-[#E8E9F0] transition-colors text-[#1A1A18]/50"
                              disabled
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            {typeof item.prompt.price === 'number' && item.prompt.price === 12 && (
                              <p className="text-[14px] font-bold text-[#1A1A18]/30 line-through">$15.00</p>
                            )}
                            <p className="text-lg font-black text-[#1A1A18]">
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
            <div className="mt-12 pt-12 border-t border-[#E8E9F0]">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 text-[#1A1A18]">
                  <div className="w-12 h-12 bg-[#F7F8FC] rounded-2xl flex items-center justify-center text-[#8AAAFF]">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[14px]">Instant Access</p>
                    <p className="text-xs font-bold text-[#1A1A18]/30 uppercase tracking-wider">Download immediately</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#1A1A18]">
                  <div className="w-12 h-12 bg-[#F7F8FC] rounded-2xl flex items-center justify-center text-[#8AAAFF]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[14px]">Verified Quality</p>
                    <p className="text-xs font-bold text-[#1A1A18]/30 uppercase tracking-wider">Every prompt tested</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[#1A1A18]">
                  <div className="w-12 h-12 bg-[#F7F8FC] rounded-2xl flex items-center justify-center text-[#8AAAFF]">
                    <LifeBuoy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-[14px]">Lifetime Support</p>
                    <p className="text-xs font-bold text-[#1A1A18]/30 uppercase tracking-wider">Updates included</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <aside className="w-full lg:w-[400px]">
            <div className="bg-[#F7F8FC] border border-[#E8E9F0] rounded-[32px] p-8 sticky top-32 card-shadow">
              <h2 className="font-display text-2xl font-bold mb-8">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-[15px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-wider text-xs">Subtotal</span>
                  <span className="text-[#1A1A18]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-[15px] font-bold text-[#28C840]">
                    <span className="uppercase tracking-wider text-xs">Discount ({promoCode})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[15px] font-bold">
                  <span className="text-[#1A1A18]/40 uppercase tracking-wider text-xs">Tax (Est.)</span>
                  <span className="text-[#1A1A18]">$0.00</span>
                </div>
                <div className="pt-4 border-t border-[#E8E9F0] flex justify-between items-end">
                  <span className="font-display font-bold text-lg">Total</span>
                  <span className="font-display font-black text-3xl text-[#1A1A18]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="mb-8">
                <label htmlFor="promo" className="block text-[11px] font-black uppercase tracking-[0.15em] text-[#1A1A18]/30 mb-3">
                  Promo Code
                </label>
                <div className="relative flex gap-2">
                  <input
                    type="text"
                    id="promo"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value)}
                    placeholder="ENTER CODE (e.g. WELCOME10)"
                    className="flex-1 h-12 px-4 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] font-bold text-sm tracking-widest uppercase"
                  />
                  <button
                    type="submit"
                    className="px-5 bg-[#1A1A18] text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-[#3A3A42] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 font-bold mt-2">{promoError}</p>}
                {promoSuccess && <p className="text-xs text-[#28C840] font-bold mt-2">Promo code applied successfully!</p>}
              </form>

              {/* Action Buttons */}
              <Magnetic intensity={0.15} range={60}>
                <Link
                  to="/checkout"
                  className="w-full h-[64px] bg-[#1A1A18] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#3A3A42] transition-colors mb-4 shadow-xl shadow-[#1A1A18]/10 active:scale-95"
                >
                  Checkout Now <ArrowRight className="w-5 h-5" />
                </Link>
              </Magnetic>
              <Magnetic intensity={0.1} range={50}>
                <Link
                  to="/browse"
                  className="w-full h-[64px] bg-white border border-[#E8E9F0] text-[#1A1A18] rounded-2xl font-bold text-lg flex items-center justify-center hover:bg-[#EEF0F5] transition-colors active:scale-95"
                >
                  Continue Shopping
                </Link>
              </Magnetic>
            </div>
          </aside>
        </div>
      </div>

      {/* Recommended Section */}
      {recommendedPrompts.length > 0 && (
        <section className="py-24 border-t border-[#E8E9F0] mt-24">
          <div className="max-w-[1240px] mx-auto px-8">
            <h2 className="font-display text-3xl font-bold tracking-tight mb-12">Recommended for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
