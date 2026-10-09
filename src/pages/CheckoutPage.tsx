import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { Magnetic } from '../components/motion-primitives/magnetic';
import { AnimatedBackground } from '../components/motion-primitives/animated-background';

export const CheckoutPage: React.FC = () => {
  const { cart, removeFromCart, subtotal, discount, total, promoCode, applyPromo, clearCart, addOrder } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple'>('card');
  const [email, setEmail] = useState('alex@example.com');
  const [fullName, setFullName] = useState('Alex Johnson');
  const [streetAddress, setStreetAddress] = useState('123 Creative Lane');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('94103');
  const [sameBilling, setSameBilling] = useState(true);
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [promoInput, setPromoInput] = useState('');

  const tax = 0.00; // Tax is estimated at $0.00 in the design

  const handleCompletePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length > 0) {
      await addOrder(cart, total, paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Apple Pay');
      clearCart();
    }
    navigate('/confirmation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFEFB]">
      <main className="flex-1 max-w-[1240px] mx-auto w-full px-8 py-12 md:py-20">
        {/* Step Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center mb-16"
        >
          <nav className="flex items-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <Link
                to="/cart"
                className="w-8 h-8 rounded-full border border-[#E8E9F0] flex items-center justify-center text-xs font-bold text-[#1A1A18]/40 hover:border-[#1A1A18] transition-all"
              >
                1
              </Link>
              <span className="text-sm font-bold text-[#1A1A18]/40">Cart</span>
            </div>
            <div className="w-8 h-px bg-[#E8E9F0]" />
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#1A1A18] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                2
              </span>
              <span className="text-sm font-bold text-[#1A1A18]">Checkout</span>
            </div>
            <div className="w-8 h-px bg-[#E8E9F0]" />
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border border-[#E8E9F0] flex items-center justify-center text-xs font-bold text-[#1A1A18]/40">
                3
              </span>
              <span className="text-sm font-bold text-[#1A1A18]/40">Confirmation</span>
            </div>
          </nav>
        </motion.div>

        <form onSubmit={handleCompletePurchase} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Form: Contact & Shipping & Payment */}
          <div className="lg:col-span-7 space-y-12">
            {/* Contact Information */}
            <div>
              <h2 className="font-display text-3xl font-bold mb-8">Contact Information</h2>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]/40 mb-2 block">
                    Email Address
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full h-14 px-5 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] focus:ring-4 focus:ring-[#8AAAFF]/5 transition-all font-medium"
                  />
                </label>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h2 className="font-display text-3xl font-bold mb-8">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]/40 mb-2 block">
                      Full Name
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Johnson"
                      className="w-full h-14 px-5 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] focus:ring-4 focus:ring-[#8AAAFF]/5 transition-all font-medium"
                    />
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]/40 mb-2 block">
                      Street Address
                    </span>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="123 Creative Lane"
                      className="w-full h-14 px-5 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] focus:ring-4 focus:ring-[#8AAAFF]/5 transition-all font-medium"
                    />
                  </label>
                </div>
                <div>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]/40 mb-2 block">
                      City
                    </span>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="San Francisco"
                      className="w-full h-14 px-5 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] focus:ring-4 focus:ring-[#8AAAFF]/5 transition-all font-medium"
                    />
                  </label>
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]/40 mb-2 block">
                          State
                        </span>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="CA"
                          className="w-full h-14 px-5 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] focus:ring-4 focus:ring-[#8AAAFF]/5 transition-all font-medium"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]/40 mb-2 block">
                          ZIP
                        </span>
                        <input
                          type="text"
                          required
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          placeholder="94103"
                          className="w-full h-14 px-5 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] focus:ring-4 focus:ring-[#8AAAFF]/5 transition-all font-medium"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="same-billing"
                  checked={sameBilling}
                  onChange={(e) => setSameBilling(e.target.checked)}
                  className="w-5 h-5 rounded border-[#E8E9F0] text-[#1A1A18] focus:ring-[#8AAAFF]"
                />
                <label htmlFor="same-billing" className="text-sm font-medium text-[#1A1A18]/60 cursor-pointer">
                  Billing address is same as shipping
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="font-display text-3xl font-bold mb-8">Payment Method</h2>
              <div className="flex gap-3 mb-8 bg-[#F7F8FC] p-1.5 rounded-2xl border border-[#E8E9F0]">
                <AnimatedBackground
                  defaultValue="card"
                  className="bg-white rounded-xl card-shadow border border-[#8AAAFF]/40"
                  transition={{
                    type: 'spring',
                    bounce: 0.15,
                    duration: 0.35,
                  }}
                  onValueChange={(val) => {
                    if (val) setPaymentMethod(val as 'card' | 'paypal' | 'apple');
                  }}
                >
                  <button
                    type="button"
                    data-id="card"
                    className={`flex-1 py-4 px-6 flex flex-col items-center justify-center rounded-xl transition-colors z-10 ${
                      paymentMethod === 'card' ? 'text-[#1A1A18]' : 'text-[#1A1A18]/50 hover:text-[#1A1A18]'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'card' ? 'text-[#8AAAFF]' : 'currentColor'}`} />
                    <span className="text-xs font-bold uppercase tracking-widest">Card</span>
                  </button>

                  <button
                    type="button"
                    data-id="paypal"
                    className={`flex-1 py-4 px-6 flex flex-col items-center justify-center rounded-xl transition-colors z-10 ${
                      paymentMethod === 'paypal' ? 'text-[#1A1A18]' : 'text-[#1A1A18]/50 hover:text-[#1A1A18]'
                    }`}
                  >
                    <span className="font-display font-black text-xl italic text-[#003087] mb-2 leading-none">P</span>
                    <span className="text-xs font-bold uppercase tracking-widest">PayPal</span>
                  </button>

                  <button
                    type="button"
                    data-id="apple"
                    className={`flex-1 py-4 px-6 flex flex-col items-center justify-center rounded-xl transition-colors z-10 ${
                      paymentMethod === 'apple' ? 'text-[#1A1A18]' : 'text-[#1A1A18]/50 hover:text-[#1A1A18]'
                    }`}
                  >
                    <span className="font-black text-base mb-2"> Pay</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Apple Pay</span>
                  </button>
                </AnimatedBackground>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-6 bg-[#F7F8FC] p-8 rounded-[24px] border border-[#E8E9F0]">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]/40 mb-2 block">
                      Card Number
                    </span>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className="w-full h-14 px-5 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] transition-all font-medium"
                      />
                      <span className="absolute right-5 font-black text-xs uppercase tracking-wider text-[#1A1A18]/40">
                        VISA
                      </span>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]/40 mb-2 block">
                          Expiry Date
                        </span>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full h-14 px-5 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] transition-all font-medium"
                        />
                      </label>
                    </div>
                    <div>
                      <label className="block">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A18]/40 mb-2 block">
                          CVV
                        </span>
                        <input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          placeholder="123"
                          className="w-full h-14 px-5 bg-white border border-[#E8E9F0] rounded-xl focus:outline-none focus:border-[#8AAAFF] transition-all font-medium"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 bg-[#F7F8FC] border border-[#E8E9F0] rounded-[32px] p-8 card-shadow">
              <h3 className="font-display text-2xl font-bold mb-8">Order Summary</h3>

              {/* Items List */}
              <div className="space-y-6 mb-8">
                {cart.map((item) => (
                  <div key={item.prompt.id} className="flex gap-4 items-center">
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
                    <div className="flex-1">
                      <h4 className="font-bold text-sm leading-tight">{item.prompt.title}</h4>
                      <p className="text-xs text-[#1A1A18]/40 font-bold uppercase mt-1">{item.prompt.typeLabel || item.prompt.model}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm">
                        {typeof item.prompt.price === 'number' ? `$${item.prompt.price.toFixed(2)}` : 'Free'}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.prompt.id)}
                        className="text-[#1A1A18]/30 hover:text-red-500 transition-colors mt-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="pt-8 border-t border-[#E8E9F0] space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                  <span className="font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#1A1A18]/40 uppercase tracking-widest text-[10px] font-bold">Tax</span>
                  <span className="font-bold">${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-[#28C840]">
                    <span className="uppercase tracking-widest text-[10px] font-bold">
                      Discount ({promoCode})
                    </span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-[#E8E9F0]">
                  <span className="font-display font-bold text-lg">Total</span>
                  <span className="font-display font-black text-3xl">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo input */}
              <div className="space-y-4">
                <div className="relative flex items-center mb-6">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="PROMO CODE"
                    className="w-full h-12 px-4 bg-white border border-[#E8E9F0] rounded-xl text-xs font-bold focus:outline-none focus:border-[#8AAAFF] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (promoInput.trim()) applyPromo(promoInput);
                    }}
                    className="absolute right-2 px-4 py-1.5 bg-[#1A1A18] text-white text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-[#3A3A42] transition-all"
                  >
                    Apply
                  </button>
                </div>

                <Magnetic intensity={0.15} range={60}>
                  <button
                    type="submit"
                    className="w-full h-[64px] bg-[#1A1A18] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-[#3A3A42] transition-colors shadow-xl shadow-[#1A1A18]/10 active:scale-95"
                  >
                    Complete Purchase <Lock className="w-5 h-5" />
                  </button>
                </Magnetic>

                <Link
                  to="/browse"
                  className="block text-center text-[13px] font-bold text-[#1A1A18]/40 hover:text-[#1A1A18] transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Payment badges */}
              <div className="mt-8 flex items-center justify-center gap-6 opacity-30 text-xs font-bold uppercase tracking-widest">
                <span>Stripe</span>
                <span>•</span>
                <span>Mastercard</span>
                <span>•</span>
                <span>Visa</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
