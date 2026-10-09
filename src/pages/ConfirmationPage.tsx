import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, FileText, Printer, Download, ExternalLink, ChevronRight, Copy, CheckCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PromptCard } from '../components/PromptCard';
import { promptItems } from '../data/prompts';
import { motion } from 'motion/react';
import { Magnetic } from '../components/motion-primitives/magnetic';
import { BorderTrail } from '../components/motion-primitives/border-trail';
import { TextShimmer } from '../components/motion-primitives/text-shimmer';
import { useAuth, useClerk } from '@clerk/react';

export const ConfirmationPage: React.FC = () => {
  const { lastOrderItems, orderId } = useCart();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fallback to primary prompt if order was empty
  const items = lastOrderItems.length > 0 ? lastOrderItems : [{ prompt: promptItems[0], quantity: 1 }];

  const subtotal = items.reduce((acc, item) => {
    const price = typeof item.prompt.price === 'number' ? item.prompt.price : 0;
    return acc + price * item.quantity;
  }, 0);

  const handleCopyPrompt = (id: string, text: string) => {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadFile = (title: string, promptText: string) => {
    const element = document.createElement('a');
    const file = new Blob([`Prompt: ${title}\n\n${promptText}\n\nGenerated via Prompt Studio`], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-prompt.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Recommended for you
  const recommendedItems = promptItems.slice(1, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFB]">
      <main className="flex-1">
        {/* Confirmation Hero */}
        <section className="relative hero-gradient pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
          <div className="max-w-[1240px] mx-auto px-8 text-center relative">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-[#8AAAFF]/10 rounded-full mb-8 border border-[#8AAAFF]/20 text-[#8AAAFF] shadow-sm"
            >
              <Check className="w-10 h-10" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
                Order Confirmed!
              </h1>
              <p className="text-xl text-[#1A1A18]/60 font-medium">
                {orderId ? `Order #${orderId} • ` : ''}<TextShimmer duration={2} className="text-[#1A1A18] font-bold">Your prompts are ready to download</TextShimmer>
              </p>
            </motion.div>
          </div>
        </section>

        {/* Order Summary & Downloads */}
        <section className="py-20">
          <div className="max-w-[1240px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Summary Column */}
              <div className="lg:col-span-4">
                <div className="bg-white border border-[#E8E9F0] rounded-[32px] p-8 card-shadow sticky top-28">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="font-display font-bold text-xl tracking-tight">Order Summary</h2>
                    <span className="px-3 py-1 bg-[#28C840]/10 text-[#28C840] text-[10px] font-black tracking-widest uppercase rounded-lg">
                      Completed
                    </span>
                  </div>

                  <div className="space-y-6 mb-8">
                    {items.map((item) => (
                      <div key={item.prompt.id} className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-[#F7F8FC] rounded-xl flex items-center justify-center flex-shrink-0 text-[#1A1A18]/30">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{item.prompt.title}</p>
                          <p className="text-xs font-bold text-[#1A1A18]/30">@{item.prompt.creator?.handle || 'creator'}</p>
                        </div>
                        <span className="ml-auto font-black text-sm">
                          {typeof item.prompt.price === 'number' ? `$${item.prompt.price.toFixed(2)}` : 'Free'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-[#E8E9F0] space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-[#1A1A18]/40">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-[#1A1A18]/40">Tax</span>
                      <span>$0.00</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-[#E8E9F0] font-black text-lg">
                      <span>Total</span>
                      <span className="text-[#8AAAFF]">${subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-3">
                    <button
                      onClick={() => window.print()}
                      className="w-full h-14 bg-[#F7F8FC] text-[#1A1A18] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#E8E9F0] transition-all text-sm"
                    >
                      <Printer className="w-4 h-4" />
                      View Receipt
                    </button>
                  </div>
                </div>
              </div>

              {/* Download Column */}
              <div className="lg:col-span-8">
                <div className="mb-12">
                  <h2 className="font-display font-bold text-3xl tracking-tight mb-8">Download Your Prompts</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) => (
                      <div
                        key={item.prompt.id}
                        className="bg-white border border-[#E8E9F0] rounded-[24px] p-6 flex flex-col hover:border-[#8AAAFF]/30 transition-all card-shadow"
                      >
                        <div className="flex gap-5 mb-6">
                          <div className="w-20 h-20 bg-[#EEF0F5] rounded-2xl overflow-hidden flex-shrink-0">
                            <img
                              src={item.prompt.imageUrl}
                              className="w-full h-full object-cover"
                              alt={item.prompt.title}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/1a1a1a/888?text=Image';
                              }}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-lg leading-tight mb-1">{item.prompt.title}</p>
                            <p className="text-sm font-bold text-[#1A1A18]/30 mb-2 uppercase tracking-widest text-[10px]">
                              {item.prompt.typeLabel || item.prompt.model}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-full bg-[#E8E9F0] overflow-hidden">
                                {item.prompt.creator?.avatarUrl && (
                                  <img
                                    src={item.prompt.creator.avatarUrl}
                                    alt={item.prompt.creator.handle}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <span className="text-xs font-bold text-[#1A1A18]/40">
                                @{item.prompt.creator?.handle || 'creator'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Prompt text snippet display */}
                        <div className="bg-[#F7F8FC] border border-[#E8E9F0] rounded-xl p-3 mb-4 font-mono text-xs text-[#1A1A18]/80 line-clamp-3">
                          {item.prompt.promptTemplate || item.prompt.description}
                        </div>

                        <div className="flex gap-3 mt-auto">
                          <button
                            onClick={() =>
                              handleDownloadFile(
                                item.prompt.title,
                                item.prompt.promptTemplate || item.prompt.description
                              )
                            }
                            className="flex-1 h-12 bg-[#1A1A18] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#3A3A42] transition-all text-sm"
                          >
                            <Download className="w-4 h-4" />
                            Download TXT
                          </button>
                          <button
                            onClick={() =>
                              handleCopyPrompt(
                                item.prompt.id,
                                item.prompt.promptTemplate || item.prompt.description
                              )
                            }
                            className="px-4 h-12 bg-[#F7F8FC] border border-[#E8E9F0] rounded-xl flex items-center justify-center hover:bg-white transition-all text-[#1A1A18]"
                            title="Copy prompt"
                          >
                            {copiedId === item.prompt.id ? (
                              <CheckCheck className="w-4 h-4 text-[#28C840]" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                          <Link
                            to={`/prompt/${item.prompt.id}`}
                            className="px-4 h-12 bg-[#F7F8FC] border border-[#E8E9F0] rounded-xl flex items-center justify-center hover:bg-white transition-all text-[#1A1A18]"
                            title="View prompt details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Library Access CTA */}
                <div className="bg-[#1A1A18] rounded-[32px] p-12 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-[#8AAAFF]/10 blur-[80px]" />
                  <BorderTrail
                    size={100}
                    className="bg-gradient-to-r from-transparent via-[#8AAAFF] to-transparent opacity-40"
                    transition={{ repeat: Infinity, duration: 7, ease: 'linear' }}
                  />
                  <div className="relative">
                    <h3 className="font-display text-4xl font-extrabold tracking-tighter mb-4">
                      Your Library is Ready
                    </h3>
                    <p className="text-white/50 font-medium mb-10 max-w-md">
                      Browse and organize all your past purchases in your personal prompt collection.
                    </p>
                    <Magnetic intensity={0.2} range={60}>
                      <Link
                        to="/browse"
                        className="inline-flex h-14 px-8 bg-[#8AAAFF] text-[#1A1A18] rounded-2xl font-black text-sm items-center justify-center hover:bg-[#B8C9FF] transition-colors shadow-lg shadow-[#8AAAFF]/5 active:scale-95"
                      >
                        Access Prompt Library
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommended Prompts */}
        <section className="py-24 bg-[#F7F8FC] border-y border-[#E8E9F0]">
          <div className="max-w-[1240px] mx-auto px-8">
            <div className="flex items-center justify-between mb-16">
              <h2 className="font-display text-4xl font-extrabold tracking-tighter">Recommended for You</h2>
              <Link
                to="/browse"
                className="h-12 px-6 bg-white border border-[#E8E9F0] text-[#1A1A18] rounded-xl font-bold text-sm flex items-center hover:bg-[#F7F8FC] transition-all"
              >
                Continue Shopping
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedItems.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
