import React, { createContext, useContext, useState, useEffect } from 'react';
import { PromptItem, CartItem, OrderRecord } from '../types';

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
  deleteOrder: (orderId: string) => void;
  deletePromptFromOrder: (orderId: string, promptId: string) => void;
  clearOrders: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

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
  const [orderId, setOrderId] = useState<string>('');

  // Orders stored in state and localStorage - NO dummy data
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ps_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out any legacy dummy order PS-884210
          return parsed.filter((order) => order.id !== 'PS-884210');
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ps_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync orders to localStorage (and cleanse any dummy PS-884210)
  useEffect(() => {
    try {
      const cleaned = orders.filter((o) => o.id !== 'PS-884210');
      localStorage.setItem('ps_orders', JSON.stringify(cleaned));
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
    setOrders((prev) => [newOrder, ...prev.filter((o) => o.id !== 'PS-884210')]);
    setOrderId(newOrderId);
    setLastOrderItems([...items]);
    return newOrderId;
  };

  const deleteOrder = (orderIdToDelete: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderIdToDelete));
  };

  const deletePromptFromOrder = (orderIdTarget: string, promptIdToDelete: string) => {
    setOrders((prev) =>
      prev
        .map((order) => {
          if (order.id !== orderIdTarget) return order;
          const updatedItems = order.items.filter((item) => item.prompt.id !== promptIdToDelete);
          const newSubtotal = updatedItems.reduce((acc, item) => {
            const price = typeof item.prompt.price === 'number' ? item.prompt.price : 0;
            return acc + price * item.quantity;
          }, 0);
          return {
            ...order,
            items: updatedItems,
            subtotal: newSubtotal,
            total: Math.max(0, newSubtotal - order.discount),
          };
        })
        .filter((order) => order.items.length > 0)
    );
  };

  const clearOrders = () => {
    setOrders([]);
    try {
      localStorage.removeItem('ps_orders');
    } catch {
      // ignore
    }
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
        deleteOrder,
        deletePromptFromOrder,
        clearOrders,
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
