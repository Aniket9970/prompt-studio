import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, ShoppingBag, Heart, FolderHeart, LogOut, User, ChevronDown, Lock, Menu, X } from 'lucide-react';
import { SignInButton, SignUpButton, Show, UserButton, useAuth, useClerk, useUser } from '@clerk/react';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { Magnetic } from './motion-primitives/magnetic';
import { AnimatedBackground } from './motion-primitives/animated-background';
import { AnimatePresence, motion } from 'motion/react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, orders } = useCart();
  const { favorites } = useFavorites();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut, openSignIn } = useClerk();
  const activePath = location.pathname;

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click and route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Browse', path: '/browse' },
    { label: 'Categories', path: '/browse#categories' },
    { label: 'Pricing', path: '#pricing' },
    { label: 'About', path: '#about' },
  ];

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    setMobileMenuOpen(false);
    if (isSignedIn) {
      await signOut();
    }
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFEFB]/90 backdrop-blur-md border-b border-[#E8E9F0] transition-colors transform-gpu">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-6 sm:gap-12 lg:gap-16">
          <Link to="/" id="nav-logo" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <Magnetic intensity={0.2} range={60}>
              <span className="w-8 h-8 sm:w-9 sm:h-9 bg-[#1A1A18] rounded-xl flex items-center justify-center text-white transition-standard group-hover:scale-105 shadow-sm shrink-0">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
              </span>
            </Magnetic>
            <span className="font-display font-bold text-base sm:text-2xl tracking-tighter text-[#1A1A18] whitespace-nowrap">
              PROMPT STUDIO
            </span>
          </Link>
          <div className="hidden lg:flex items-center">
            <AnimatedBackground
              defaultValue={activePath === '/browse' ? '/browse' : undefined}
              className="bg-[#F7F8FC] rounded-lg"
              transition={{
                type: 'spring',
                bounce: 0.15,
                duration: 0.3,
              }}
              enableHover
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  data-id={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-[15px] rounded-lg transition-colors z-10 ${
                    activePath === link.path
                      ? 'text-[#1A1A18] font-bold'
                      : 'text-[#1A1A18]/60 hover:text-[#1A1A18] font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </AnimatedBackground>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Account Dropdown Menu (Hidden on extra small screens, accessible via mobile menu) */}
          <div className="relative hidden sm:block" ref={accountMenuRef}>
            <button
              type="button"
              id="nav-account-button"
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold transition-all ${
                accountMenuOpen || activePath.startsWith('/account')
                  ? 'bg-[#1A1A18] text-white border-[#1A1A18]'
                  : 'bg-white border-[#E8E9F0] text-[#1A1A18] hover:border-[#8AAAFF] hover:bg-[#F7F8FC]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Account</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${accountMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Popover */}
            <AnimatePresence>
              {accountMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#E8E9F0] shadow-xl p-2 z-50 overflow-hidden"
                >
                  <div className="px-3 py-2.5 border-b border-[#F0F1F6] mb-1">
                    <p className="text-xs font-bold text-[#1A1A18] truncate">
                      {user?.fullName || (isSignedIn ? 'Creator Member' : 'Guest Account')}
                    </p>
                    <p className="text-[11px] text-[#6B6D75] truncate">
                      {user?.primaryEmailAddress?.emailAddress || (isSignedIn ? 'Connected' : 'Local Workspace')}
                    </p>
                  </div>

                  {/* Menu Options: Orders, Your Collection, Favourites, Logout */}
                  <div className="space-y-0.5">
                    <Link
                      to="/account?tab=orders"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#1A1A18] hover:bg-[#F7F8FC] hover:text-[#8AAAFF] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-[#8B8E9A]" />
                        <span>Orders</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#F0F1F6] text-[#1A1A18]/70 rounded-full font-bold">
                        {orders.length}
                      </span>
                    </Link>

                    <Link
                      to="/account?tab=collection"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#1A1A18] hover:bg-[#F7F8FC] hover:text-[#8AAAFF] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <FolderHeart className="w-4 h-4 text-[#8B8E9A]" />
                        <span>Your Collection</span>
                      </div>
                    </Link>

                    <Link
                      to="/account?tab=favourites"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#1A1A18] hover:bg-[#F7F8FC] hover:text-rose-500 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart className="w-4 h-4 text-[#8B8E9A]" />
                        <span>Favourites</span>
                      </div>
                      {favorites.length > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded-full font-bold">
                          {favorites.length}
                        </span>
                      )}
                    </Link>

                    {/* Creator Studio - Exclusively for aniketkhatkhede123@gmail.com */}
                    {isSignedIn &&
                      (user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() === 'aniketkhatkhede123@gmail.com' ||
                        user?.emailAddresses?.some(
                          (e) => e.emailAddress.toLowerCase().trim() === 'aniketkhatkhede123@gmail.com'
                        )) && (
                        <Link
                          to="/creator"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#1A1A18] hover:bg-[#F7F8FC] hover:text-[#8AAAFF] transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <Lock className="w-4 h-4 text-emerald-600" />
                            <span>Creator Studio</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono font-bold">
                            ADMIN
                          </span>
                        </Link>
                      )}
                  </div>

                  <div className="border-t border-[#F0F1F6] mt-1 pt-1">
                    {isSignedIn ? (
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAccountMenuOpen(false);
                          openSignIn();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#1A1A18] hover:bg-[#F7F8FC] transition-colors text-left"
                      >
                        <User className="w-4 h-4" />
                        <span>Log in / Sign up</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Icon with Magnetic */}
          <Magnetic intensity={0.2} range={50}>
            <Link
              to="/cart"
              id="nav-cart"
              className="relative p-2 sm:p-2.5 rounded-xl border border-[#E8E9F0] hover:border-[#8AAAFF] hover:bg-[#F7F8FC] transition-colors flex items-center justify-center text-[#1A1A18]"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-[#1A1A18] text-white text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#FFFEFB]">
                  {cart.length}
                </span>
              )}
            </Link>
          </Magnetic>

          {/* Mobile Direct Log In Button (Visible directly on mobile phone navbar when signed out) */}
          <div className="sm:hidden flex items-center">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  id="mobile-nav-login-button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1A1A18] text-white hover:bg-[#3A3A42] transition-colors shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                  aria-label="Log in to Prompt Studio"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Log in</span>
                </button>
              </SignInButton>
            </Show>
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden sm:flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-sm font-semibold text-[#1A1A18]/60 hover:text-[#1A1A18] transition-colors px-2 cursor-pointer"
                >
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <div>
                  <Magnetic intensity={0.15} range={60}>
                    <button
                      type="button"
                      className="text-xs sm:text-sm font-bold bg-[#1A1A18] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-[#3A3A42] transition-colors shadow-sm active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      Get Started
                    </button>
                  </Magnetic>
                </div>
              </SignUpButton>
            </Show>
          </div>

          <Show when="signed-in">
            <div className="flex items-center gap-2 pl-1">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-8 h-8 sm:w-10 sm:h-10 border border-[#E8E9F0]',
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action
                    label="Orders"
                    labelIcon={<ShoppingBag className="w-4 h-4" />}
                    onClick={() => navigate('/account?tab=orders')}
                  />
                  <UserButton.Action
                    label="Your Collection"
                    labelIcon={<FolderHeart className="w-4 h-4" />}
                    onClick={() => navigate('/account?tab=collection')}
                  />
                  <UserButton.Action
                    label="Favourites"
                    labelIcon={<Heart className="w-4 h-4" />}
                    onClick={() => navigate('/account?tab=favourites')}
                  />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </Show>

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-[#E8E9F0] hover:bg-[#F7F8FC] text-[#1A1A18] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden bg-[#FFFEFB] border-b border-[#E8E9F0] overflow-hidden shadow-xl"
          >
            <div className="px-5 py-6 space-y-5 max-h-[calc(100vh-80px)] overflow-y-auto">
              {/* Account Quick Banner at Top of Mobile Menu */}
              <Show when="signed-out">
                <div className="p-3.5 bg-[#F7F8FC] border border-[#E8E9F0] rounded-2xl flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#1A1A18]">Welcome to Prompt Studio</p>
                    <p className="text-[11px] text-[#6B6D75] truncate">Log in to unlock prompts & downloads</p>
                  </div>
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3.5 py-1.5 bg-[#1A1A18] text-white text-xs font-bold rounded-xl hover:bg-[#3A3A42] transition-colors shrink-0 shadow-sm cursor-pointer whitespace-nowrap"
                    >
                      Log in
                    </button>
                  </SignInButton>
                </div>
              </Show>

              <Show when="signed-in">
                <div className="p-3 bg-[#F7F8FC] border border-[#E8E9F0] rounded-2xl flex items-center gap-3">
                  <img
                    src={user?.imageUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=promptstudio'}
                    alt={user?.fullName || 'User'}
                    className="w-9 h-9 rounded-xl object-cover border border-[#E8E9F0] bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#1A1A18] truncate">
                      {user?.fullName || user?.firstName || 'Creator Member'}
                    </p>
                    <p className="text-[11px] text-[#6B6D75] truncate">
                      {user?.primaryEmailAddress?.emailAddress || 'Connected'}
                    </p>
                  </div>
                </div>
              </Show>

              {/* Main Nav Links */}
              <div className="space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A18]/40 px-3 pb-1">
                  Navigation
                </p>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-xl text-base font-bold transition-colors ${
                      activePath === link.path
                        ? 'bg-[#1A1A18] text-white'
                        : 'text-[#1A1A18]/80 hover:bg-[#F7F8FC]'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Account Quick Links */}
              <div className="pt-3 border-t border-[#E8E9F0] space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A18]/40 px-3 pb-1">
                  My Library & Account
                </p>
                <Link
                  to="/account?tab=orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[#1A1A18] hover:bg-[#F7F8FC] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-[#8AAAFF]" />
                    <span>Orders</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-[#F0F1F6] text-[#1A1A18]/70 rounded-full font-bold">
                    {orders.length}
                  </span>
                </Link>

                <Link
                  to="/account?tab=collection"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[#1A1A18] hover:bg-[#F7F8FC] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FolderHeart className="w-4 h-4 text-[#8AAAFF]" />
                    <span>Your Collection</span>
                  </div>
                </Link>

                <Link
                  to="/account?tab=favourites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[#1A1A18] hover:bg-[#F7F8FC] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Favourites</span>
                  </div>
                  {favorites.length > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full font-bold">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                {isSignedIn &&
                  (user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim() === 'aniketkhatkhede123@gmail.com' ||
                    user?.emailAddresses?.some(
                      (e) => e.emailAddress.toLowerCase().trim() === 'aniketkhatkhede123@gmail.com'
                    )) && (
                    <Link
                      to="/creator"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-[#1A1A18] hover:bg-emerald-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Lock className="w-4 h-4 text-emerald-600" />
                        <span>Creator Studio</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono font-bold">
                        ADMIN
                      </span>
                    </Link>
                  )}
              </div>

              {/* Mobile Auth Button */}
              <div className="pt-3 border-t border-[#E8E9F0]">
                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-3 px-4 rounded-xl text-sm font-bold border border-[#E8E9F0] text-[#1A1A18] hover:bg-[#F7F8FC] transition-colors"
                      >
                        Log in
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#1A1A18] text-white hover:bg-[#3A3A42] transition-colors shadow-sm"
                      >
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
