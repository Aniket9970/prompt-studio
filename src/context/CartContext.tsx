import React, { createContext, useContext, useState, useEffect } from 'react';
import { PromptItem, CartItem, OrderRecord } from '../types';
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
  orders: OrderRecord[];
  addOrder: (items: CartItem[], total: number, paymentMethod?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialSampleOrders: OrderRecord[] = [
  {
    id: 'PS-884210',
    date: 'Oct 8, 2026',
    items: [
      { prompt: promptItems[0], quantity: 1 },
      { prompt: promptItems[1], quantity: 1 },
    ],
    subtotal: 12.00,
    discount: 1.20,
    total: 10.80,
    status: 'Completed',
    paymentMethod: 'Credit Card',
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart is empty by default so no unwanted prompts appear in cart on load/login
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ps_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [lastOrderItems, setLastOrderItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState('PS-884210');

  // Orders stored in state and localStorage
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ps_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return initialSampleOrders;
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ps_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ps_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

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

  const addOrder = (items: CartItem[], orderTotal: number, paymentMethod = 'Credit Card') => {
    const newOrderId = `PS-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      id: newOrderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...items],
      subtotal,
      discount,
      total: orderTotal,
      status: 'Completed',
      paymentMethod,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOrderId(newOrderId);
    setLastOrderItems([...items]);
    return newOrderId;
  };

  const clearCart = () => {
    if (cart.length > 0) {
      setLastOrderItems([...cart]);
    }
    setCart([]);
    try {
      localStorage.removeItem('ps_cart');
    } catch {
      // ignore
    }
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
        orders,
        addOrder,
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
