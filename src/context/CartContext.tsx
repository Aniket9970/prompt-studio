import React, { createContext, useContext, useState } from 'react';
import { PromptItem, CartItem } from '../types';
import { promptItems } from '../data/prompts';

interface CartContextType {
  cart: CartItem[];
  addToCart: (prompt: PromptItem) => void;
  removeFromCart: (promptId: string) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  promoCode: string;
  applyPromo: (code: string) => boolean;
  promoError: string | null;
  lastOrderItems: CartItem[];
  orderId: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Pre-populate with default items from reference design 4-cart
  const [cart, setCart] = useState<CartItem[]>([
    { prompt: promptItems[0], quantity: 1 }, // Cinematic Neo-Tokyo Portraits ($12.00)
    { prompt: promptItems[2], quantity: 1 }, // Minimalist Logo Generator ($8.50)
  ]);
  const [promoCode, setPromoCode] = useState('WELCOME10');
  const [discountRate, setDiscountRate] = useState(0.1); // 10% off default or custom
  const [promoError, setPromoError] = useState<string | null>(null);
  const [lastOrderItems, setLastOrderItems] = useState<CartItem[]>([
    { prompt: promptItems[0], quantity: 1 }
  ]);
  const [orderId] = useState('PS-884210');

  const addToCart = (prompt: PromptItem) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.prompt.id === prompt.id);
      if (exists) {
        return prev;
      }
      return [...prev, { prompt, quantity: 1 }];
    });
  };

  const removeFromCart = (promptId: string) => {
    setCart((prev) => prev.filter((item) => item.prompt.id !== promptId));
  };

  const clearCart = () => {
    if (cart.length > 0) {
      setLastOrderItems([...cart]);
    }
    setCart([]);
  };

  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'WELCOME10') {
      setPromoCode('WELCOME10');
      setDiscountRate(0.1);
      setPromoError(null);
      return true;
    } else if (clean === 'PROMPT20' || clean === 'STUDIO20') {
      setPromoCode(clean);
      setDiscountRate(0.2);
      setPromoError(null);
      return true;
    } else if (clean === 'DISCOUNT2') {
      setPromoCode(clean);
      setDiscountRate(0.1);
      setPromoError(null);
      return true;
    } else {
      setPromoError('Invalid coupon code');
      return false;
    }
  };

  const subtotal = cart.reduce((acc, item) => {
    const price = typeof item.prompt.price === 'number' ? item.prompt.price : 0;
    return acc + price * item.quantity;
  }, 0);

  const discount = Number((subtotal * discountRate).toFixed(2));
  const tax = 0.00;
  const total = Math.max(0, Number((subtotal - discount + tax).toFixed(2)));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        subtotal,
        discount,
        tax,
        total,
        promoCode,
        applyPromo,
        promoError,
        lastOrderItems,
        orderId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
