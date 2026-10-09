import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  FolderHeart,
  Heart,
  LogOut,
  User,
  Copy,
  Check,
  ChevronRight,
  ExternalLink,
  Download,
  Sparkles,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth, useUser, useClerk } from '@clerk/react';
import { motion } from 'motion/react';
import { PromptCard } from '../components/PromptCard';

type TabType = 'orders' | 'collection' | 'favourites' | 'profile';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'orders';
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { orders, deleteOrder, deletePromptFromOrder, clearOrders } = useCart();
  const { favorites } = useFavorites();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut, openSignIn } = useClerk();
  const navigate = useNavigate();

  // Sync tab with URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab') as TabType;
    if (tabFromUrl && ['orders', 'collection', 'favourites', 'profile'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadPrompt = (title: string, text: string) => {
    const element = document.createElement('a');
    const file = new Blob([`Prompt: ${title}\n\n${text}\n\nGenerated via Prompt Studio`], {
      type: 'text/plain',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-prompt.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleLogout = async () => {
    if (isSignedIn) {
      await signOut();
    }
    navigate('/');
  };

  // Extract all unique prompts purchased across orders for "Your Collection"
  const collectionPrompts = React.useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!map.has(item.prompt.id)) {
          map.set(item.prompt.id, item.prompt);
        }
      });
    });
    return Array.from(map.values());
  }, [orders]);

  const userDisplayName = user?.fullName || user?.firstName || (isSignedIn ? 'Creator Member' : 'Guest Creator');
  const userEmail = user?.primaryEmailAddress?.emailAddress || (isSignedIn ? 'user@promptstudio.ai' : 'guest@promptstudio.ai');
  const userAvatar = user?.imageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=promptstudio';

  return (
    <div className="min-h-screen bg-[#FFFEFB] pt-6 sm:pt-8 pb-24 sm:pb-32">
      {/* Top Banner / Account Header */}
      <section className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#1A1A18]/40 mb-4 sm:mb-6">
          <Link to="/" className="hover:text-[#1A1A18] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1A1A18]">My Account</span>
        </nav>

        {/* Profile Card */}
        <div className="bg-white border border-[#E8E9F0] rounded-2xl sm:rounded-[32px] p-5 sm:p-8 md:p-10 card-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#8AAAFF]/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 relative z-10">
            <img
              src={userAvatar}
              alt={userDisplayName}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-[#E8E9F0] shadow-sm bg-[#F7F8FC]"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-[#1A1A18]">
                  {userDisplayName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-200/60">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#6B6D75] mb-2.5 break-all">{userEmail}</p>

              {/* Quick statistics */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-[#1A1A18]/60 font-semibold">
                <span>
                  <strong className="text-[#1A1A18] font-bold text-xs sm:text-sm">{orders.length}</strong> Orders
                </span>
                <span className="w-1 h-1 rounded-full bg-[#CBD0DF]" />
                <span>
                  <strong className="text-[#1A1A18] font-bold text-xs sm:text-sm">{collectionPrompts.length}</strong> in Collection
                </span>
                <span className="w-1 h-1 rounded-full bg-[#CBD0DF]" />
                <span>
                  <strong className="text-[#1A1A18] font-bold text-xs sm:text-sm">{favorites.length}</strong> Favourites
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto">
            {isSignedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/60 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openSignIn()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A18] text-white hover:bg-[#3A3A42] text-xs font-bold transition-all shadow-sm active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Connect</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Tab Container */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E9F0] pb-4 mb-8 sm:mb-10 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            onClick={() => switchTab('orders')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-[#1A1A18] text-white shadow-sm'
                : 'bg-transparent text-[#1A1A18]/60 hover:text-[#1A1A18] hover:bg-[#F7F8FC]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-[#E8E9F0] text-[#1A1A18]/70'
              }`}
            >
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('collection')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'collection'
                ? 'bg-[#1A1A18] text-white shadow-sm'
                : 'bg-transparent text-[#1A1A18]/60 hover:text-[#1A1A18] hover:bg-[#F7F8FC]'
            }`}
          >
            <FolderHeart className="w-4 h-4" />
            <span>Your Collection</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'collection' ? 'bg-white/20 text-white' : 'bg-[#E8E9F0] text-[#1A1A18]/70'
              }`}
            >
              {collectionPrompts.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('favourites')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'favourites'
                ? 'bg-[#1A1A18] text-white shadow-sm'
                : 'bg-transparent text-[#1A1A18]/60 hover:text-[#1A1A18] hover:bg-[#F7F8FC]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Favourites</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'favourites' ? 'bg-white/20 text-white' : 'bg-[#E8E9F0] text-[#1A1A18]/70'
              }`}
            >
              {favorites.length}
            </span>
          </button>

          <button
            onClick={() => switchTab('profile')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-[#1A1A18] text-white shadow-sm'
                : 'bg-transparent text-[#1A1A18]/60 hover:text-[#1A1A18] hover:bg-[#F7F8FC]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account & Security</span>
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-[#1A1A18]">Order History</h2>
                <p className="text-sm text-[#6B6D75] mt-1">Review your receipts and instantly copy prompt templates.</p>
              </div>
              <div className="flex items-center gap-4">
                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={clearOrders}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all active:scale-95 shadow-sm"
                    title="Delete all order records"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Orders</span>
                  </button>
                )}
                <Link
                  to="/browse"
                  className="text-xs font-bold text-[#8AAAFF] hover:underline flex items-center gap-1"
                >
                  <span>Browse more prompts</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white border border-[#E8E9F0] rounded-[28px] p-16 text-center card-shadow">
                <div className="w-16 h-16 rounded-2xl bg-[#F7F8FC] border border-[#E8E9F0] flex items-center justify-center mx-auto mb-4 text-[#8B8E9A]">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-xl text-[#1A1A18] mb-2">No orders found yet</h3>
                <p className="text-sm text-[#6B6D75] mb-6 max-w-md mx-auto">
                  When you acquire prompts or complete checkout, your order records and instant prompt access will appear here.
                </p>
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A18] text-white text-xs font-bold hover:bg-[#3A3A42] transition-colors"
                >
                  Explore Marketplace
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-[#E8E9F0] rounded-[28px] overflow-hidden card-shadow"
                >
                  {/* Order Header */}
                  <div className="bg-[#FAFBFD] px-4 sm:px-8 py-4 sm:py-5 border-b border-[#E8E9F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 sm:gap-6 text-xs">
                      <div>
                        <span className="text-[#8B8E9A] uppercase tracking-wider font-bold block mb-0.5 text-[10px] sm:text-xs">Order ID</span>
                        <span className="font-mono font-bold text-[#1A1A18] text-xs sm:text-sm truncate block max-w-[120px] sm:max-w-none">{order.id}</span>
                      </div>
                      <div>
                        <span className="text-[#8B8E9A] uppercase tracking-wider font-bold block mb-0.5 text-[10px] sm:text-xs">Date Placed</span>
                        <span className="font-bold text-[#1A1A18]">{order.date}</span>
                      </div>
                      <div>
                        <span className="text-[#8B8E9A] uppercase tracking-wider font-bold block mb-0.5 text-[10px] sm:text-xs">Total Paid</span>
                        <span className="font-bold text-[#1A1A18] text-xs sm:text-sm">${order.total.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-[#8B8E9A] uppercase tracking-wider font-bold block mb-0.5 text-[10px] sm:text-xs">Payment</span>
                        <span className="font-semibold text-[#1A1A18]/80">{order.paymentMethod || 'Card'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8E9F0]/60">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {order.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteOrder(order.id)}
                        title="Delete entire order"
                        className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 border border-[#E8E9F0] hover:border-rose-200 rounded-full text-xs font-bold transition-all active:scale-95 shadow-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-8 divide-y divide-[#F0F1F6]">
                    {order.items.map((item) => {
                      const promptText = item.prompt.promptTemplate || item.prompt.promptSnippet || item.prompt.description;
                      const isItemCopied = copiedId === `${order.id}-${item.prompt.id}`;

                      return (
                        <div key={item.prompt.id} className="py-5 sm:py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                          <div className="flex items-start sm:items-center gap-3.5 sm:gap-5">
                            {item.prompt.previewVideo ? (
                              <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl overflow-hidden bg-black/5 relative shrink-0 border border-[#E8E9F0]">
                                <video
                                  src={item.prompt.previewVideo}
                                  muted
                                  loop
                                  autoPlay
                                  playsInline
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : item.prompt.imageUrl ? (
                              <img
                                src={item.prompt.imageUrl}
                                alt={item.prompt.title}
                                className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl object-cover shrink-0 border border-[#E8E9F0]"
                              />
                            ) : (
                              <div className="w-16 h-14 sm:w-20 sm:h-16 rounded-xl bg-[#F7F8FC] border border-[#E8E9F0] flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-[#8AAAFF]" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#8AAAFF] bg-[#8AAAFF]/10 px-2 py-0.5 rounded-full">
                                  {item.prompt.category}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-bold text-[#8B8E9A] truncate">
                                  by @{item.prompt.creator.handle}
                                </span>
                              </div>
                              <h4 className="font-display font-bold text-sm sm:text-base text-[#1A1A18] hover:text-[#8AAAFF] transition-colors truncate">
                                <Link to={`/prompt/${item.prompt.id}`}>{item.prompt.title}</Link>
                              </h4>
                              <p className="text-[11px] sm:text-xs text-[#6B6D75] line-clamp-1 max-w-lg mt-0.5">
                                {item.prompt.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-stretch sm:self-auto justify-between sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0F1F6]">
                            <button
                              type="button"
                              onClick={() => handleCopyPrompt(`${order.id}-${item.prompt.id}`, promptText)}
                              className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                                isItemCopied
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-[#1A1A18] text-white hover:bg-[#3A3A42] active:scale-95'
                              }`}
                            >
                              {isItemCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{isItemCopied ? 'Copied' : 'Copy Prompt'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadPrompt(item.prompt.title, promptText)}
                              title="Download Prompt File"
                              className="p-2 rounded-xl border border-[#E8E9F0] hover:bg-[#F7F8FC] text-[#1A1A18]/70 hover:text-[#1A1A18] transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>

                            <Link
                              to={`/prompt/${item.prompt.id}`}
                              className="p-2 rounded-xl border border-[#E8E9F0] hover:bg-[#F7F8FC] text-[#1A1A18]/70 hover:text-[#1A1A18] transition-colors"
                              title="View Details"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => deletePromptFromOrder(order.id, item.prompt.id)}
                              title="Delete Prompt from this order"
                              className="p-2 rounded-xl border border-[#E8E9F0] hover:border-rose-200 hover:bg-rose-50 text-[#1A1A18]/50 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Tab 2: Your Collection */}
        {activeTab === 'collection' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#1A1A18]">Your Collection</h2>
                <p className="text-xs sm:text-sm text-[#6B6D75] mt-1">
                  All templates and interactive workflows in your private library.
                </p>
              </div>
              <span className="text-xs font-bold text-[#1A1A18]/60 bg-[#F7F8FC] px-3 py-1.5 rounded-xl border border-[#E8E9F0] self-start sm:self-auto">
                {collectionPrompts.length} Prompts Ready
              </span>
            </div>

            {collectionPrompts.length === 0 ? (
              <div className="bg-white border border-[#E8E9F0] rounded-[28px] p-8 sm:p-16 text-center card-shadow">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F7F8FC] border border-[#E8E9F0] flex items-center justify-center mx-auto mb-4 text-[#8B8E9A]">
                  <FolderHeart className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#1A1A18] mb-2">Your collection is empty</h3>
                <p className="text-xs sm:text-sm text-[#6B6D75] mb-6 max-w-md mx-auto">
                  Acquire free and premium prompt workflows to store them in your permanent collection.
                </p>
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A18] text-white text-xs font-bold hover:bg-[#3A3A42] transition-colors"
                >
                  Explore Prompts
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                {collectionPrompts.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 3: Favourites */}
        {activeTab === 'favourites' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#1A1A18]">Favourite Prompts</h2>
                <p className="text-xs sm:text-sm text-[#6B6D75] mt-1">
                  Prompts you bookmarked for quick access and inspiration.
                </p>
              </div>
              <span className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 flex items-center gap-1.5 self-start sm:self-auto">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                {favorites.length} Favourited
              </span>
            </div>

            {favorites.length === 0 ? (
              <div className="bg-white border border-[#E8E9F0] rounded-[28px] p-8 sm:p-16 text-center card-shadow">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-4 text-rose-400">
                  <Heart className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-[#1A1A18] mb-2">No favourites saved yet</h3>
                <p className="text-xs sm:text-sm text-[#6B6D75] mb-6 max-w-md mx-auto">
                  Click the heart icon on any card to save it to your favourites and access it anytime.
                </p>
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A18] text-white text-xs font-bold hover:bg-[#3A3A42] transition-colors"
                >
                  Browse Top Prompts
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                {favorites.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Tab 4: Account & Security / Logout */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl space-y-6 sm:space-y-8"
          >
            <div>
              <h2 className="font-display font-extrabold text-xl sm:text-2xl text-[#1A1A18]">Account & Security</h2>
              <p className="text-xs sm:text-sm text-[#6B6D75] mt-1">Manage your account authentication, sessions, and preferences.</p>
            </div>

            <div className="bg-white border border-[#E8E9F0] rounded-2xl sm:rounded-[28px] p-5 sm:p-8 card-shadow space-y-5 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#F0F1F6]">
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A18]">Active Account</h4>
                  <p className="text-xs text-[#6B6D75] mt-0.5 break-all">{userEmail}</p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200">
                  Active
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#F0F1F6]">
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A18]">Security & Auth Provider</h4>
                  <p className="text-xs text-[#6B6D75] mt-0.5">Clerk Multi-factor Authentication enabled</p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 bg-[#F7F8FC] text-[#1A1A18]/70 rounded-full text-xs font-bold border border-[#E8E9F0]">
                  Connected
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#F0F1F6]">
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A18]">Prompt Studio Membership</h4>
                  <p className="text-xs text-[#6B6D75] mt-0.5">Unlimited Prompt Copying, Interactive Previews & High-Res Demos</p>
                </div>
                <span className="self-start sm:self-auto px-3 py-1 bg-[#8AAAFF]/10 text-[#8AAAFF] rounded-full text-xs font-bold border border-[#8AAAFF]/20">
                  PRO Plan
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-rose-600">End Session</h4>
                  <p className="text-xs text-[#6B6D75] mt-0.5">Safely log out from this device</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 text-xs font-bold transition-all shadow-sm active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Now</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
