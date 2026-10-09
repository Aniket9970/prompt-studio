import React, { useState } from 'react';
import { Zap, Twitter, Instagram, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="pt-20 pb-12 border-t border-[#E8E9F0] bg-[#FFFEFB]">
      <div className="max-w-[1152px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 text-xl mb-6">
              <span className="w-8 h-8 bg-[#1A1A18] rounded-lg flex items-center justify-center text-white">
                <Zap className="w-4 h-4 fill-white" />
              </span>
              <span className="clash-display font-semibold tracking-tight text-[#1A1A18]">
                PROMPT STUDIO
              </span>
            </a>
            <p className="text-[#8B8E9A] text-sm leading-relaxed mb-8">
              The world's largest marketplace for high-performance AI prompts. Empowering creators since 2023.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Twitter"
                className="w-8 h-8 rounded-lg bg-[#F7F8FC] border border-[#E8E9F0] flex items-center justify-center text-[#8B8E9A] hover:text-[#1A1A18] hover:border-[#1A1A18] transition-standard"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-[#F7F8FC] border border-[#E8E9F0] flex items-center justify-center text-[#8B8E9A] hover:text-[#1A1A18] hover:border-[#1A1A18] transition-standard"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-lg bg-[#F7F8FC] border border-[#E8E9F0] flex items-center justify-center text-[#8B8E9A] hover:text-[#1A1A18] hover:border-[#1A1A18] transition-standard"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Marketplace & Account Column */}
          <div>
            <h4 className="font-bold mb-6 text-[#1A1A18] text-sm tracking-wide">Account & Library</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="/browse" className="text-[#8B8E9A] hover:text-[#1A1A18] transition-colors">
                  Browse All Prompts
                </a>
              </li>
              <li>
                <a href="/account?tab=orders" className="text-[#8B8E9A] hover:text-[#1A1A18] transition-colors">
                  Order History
                </a>
              </li>
              <li>
                <a href="/account?tab=collection" className="text-[#8B8E9A] hover:text-[#1A1A18] transition-colors">
                  Your Collection
                </a>
              </li>
              <li>
                <a href="/account?tab=favourites" className="text-[#8B8E9A] hover:text-[#1A1A18] transition-colors">
                  Favourites
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-bold mb-6 text-[#1A1A18] text-sm tracking-wide">Company</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#about" className="text-[#8B8E9A] hover:text-[#1A1A18] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#careers" className="text-[#8B8E9A] hover:text-[#1A1A18] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-[#8B8E9A] hover:text-[#1A1A18] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-[#8B8E9A] hover:text-[#1A1A18] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold mb-6 text-[#1A1A18] text-sm tracking-wide">Newsletter</h4>
            <p className="text-sm text-[#8B8E9A] mb-4">
              Get the best prompts delivered to your inbox.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-xs font-semibold text-[#16A34A]">
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full h-12 px-4 bg-[#F7F8FC] border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] transition-standard text-sm text-[#1A1A18]"
                />
                <button
                  type="submit"
                  className="h-12 bg-[#1A1A18] text-white rounded-xl font-semibold hover:bg-[#3A3A42] transition-standard text-sm"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E8E9F0] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-[#8B8E9A]">
          <p>© 2026 Prompt Studio Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#status" className="hover:text-[#1A1A18] transition-colors">
              Status
            </a>
            <a href="#security" className="hover:text-[#1A1A18] transition-colors">
              Security
            </a>
            <a href="#support" className="hover:text-[#1A1A18] transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
