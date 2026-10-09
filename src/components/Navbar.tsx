import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, ShoppingBag } from 'lucide-react';
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/react';
import { useCart } from '../context/CartContext';
import { Magnetic } from './motion-primitives/magnetic';
import { AnimatedBackground } from './motion-primitives/animated-background';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { cart } = useCart();
  const activePath = location.pathname;

  const navLinks = [
    { label: 'Browse', path: '/browse' },
    { label: 'Categories', path: '/browse#categories' },
    { label: 'Pricing', path: '#pricing' },
    { label: 'About', path: '#about' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#FFFEFB]/90 backdrop-blur-md border-b border-[#E8E9F0] transition-colors transform-gpu">
      <div className="max-w-[1240px] mx-auto px-8 h-[80px] flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Link to="/" id="nav-logo" className="flex items-center gap-2.5 group text-xl">
            <Magnetic intensity={0.2} range={60}>
              <span className="w-9 h-9 bg-[#1A1A18] rounded-xl flex items-center justify-center text-white transition-standard group-hover:scale-105 shadow-sm">
                <Zap className="w-4 h-4 fill-white" />
              </span>
            </Magnetic>
            <span className="font-display font-bold text-2xl tracking-tighter text-[#1A1A18]">
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

        <div className="flex items-center gap-5">
          {/* Cart Icon with Magnetic */}
          <Magnetic intensity={0.2} range={50}>
            <Link
              to="/cart"
              id="nav-cart"
              className="relative p-2.5 rounded-xl border border-[#E8E9F0] hover:border-[#8AAAFF] hover:bg-[#F7F8FC] transition-colors flex items-center justify-center text-[#1A1A18]"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1A1A18] text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[#FFFEFB]">
                  {cart.length}
                </span>
              )}
            </Link>
          </Magnetic>

          {/* Auth Controls */}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="text-[15px] font-semibold text-[#1A1A18]/60 hover:text-[#1A1A18] transition-colors px-2 cursor-pointer"
              >
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <div>
                <Magnetic intensity={0.15} range={60}>
                  <button
                    type="button"
                    className="text-[14px] font-bold bg-[#1A1A18] text-white px-6 py-3 rounded-xl hover:bg-[#3A3A42] transition-colors shadow-sm active:scale-95 cursor-pointer"
                  >
                    Get Started
                  </button>
                </Magnetic>
              </div>
            </SignUpButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3 pl-2">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: 'w-10 h-10 border border-[#E8E9F0]',
                  },
                }}
              />
            </div>
          </Show>
        </div>
      </div>
    </nav>
  );
};

