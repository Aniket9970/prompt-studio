import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@clerk/react';
import { PromptItem, CartItem, OrderRecord } from '../types';
import { supabase } from '../lib/supabase';

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
  isLoadingOrders: boolean;
  addOrder: (items: CartItem[], total: number, paymentMethod?: string) => Promise<string>;
  deleteOrder: (orderId: string) => Promise<void>;
  deletePromptFromOrder: (orderId: string, promptId: string) => Promise<void>;
  clearOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId, isSignedIn } = useAuth();

  const cartStorageKey = userId ? `ps_cart_${userId}` : 'ps_cart_guest';
  const ordersStorageKey = userId ? `ps_orders_${userId}` : 'ps_orders_guest';

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(userId ? `ps_cart_${userId}` : 'ps_cart_guest');
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
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);

  // When user signs in or switches account, fetch their specific orders from Supabase
  useEffect(() => {
    let isCancelled = false;

    if (!isSignedIn || !userId) {
      // Clear personal orders when logged out
      setOrders([]);
      return;
    }

    const fetchUserOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data && !isCancelled) {
          const mappedOrders: OrderRecord[] = data.map((row) => ({
            id: row.id,
            date: new Date(row.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
            items: (row.items as CartItem[]) || [],
            subtotal: Number(row.subtotal) || 0,
            discount: Number(row.discount) || 0,
            total: Number(row.total) || 0,
            status: (row.status as 'Completed' | 'Processing') || 'Completed',
            paymentMethod: row.payment_method || 'Credit Card',
          }));

          setOrders(mappedOrders);
          try {
            localStorage.setItem(ordersStorageKey, JSON.stringify(mappedOrders));
          } catch {
            // ignore
          }
        }
      } catch (err) {
        console.error('Error fetching orders from Supabase:', err);
      } finally {
        if (!isCancelled) {
          setIsLoadingOrders(false);
        }
      }
    };

    fetchUserOrders();

    return () => {
      isCancelled = true;
    };
  }, [userId, isSignedIn, ordersStorageKey]);

  // Sync cart scoped per user
  useEffect(() => {
    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, cartStorageKey]);

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

  const addOrder = async (items: CartItem[], orderTotal: number, paymentMethod = 'Credit Card'): Promise<string> => {
    const fallbackId = `PS-${Math.floor(100000 + Math.random() * 900000)}`;
    const effectiveUserId = userId || 'guest';

    const newOrder: OrderRecord = {
      id: fallbackId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      items: [...items],
      subtotal,
      discount,
      total: orderTotal,
      status: 'Completed',
      paymentMethod,
    };

    // Optimistically update local state
    setOrders((prev) => [newOrder, ...prev]);
    setOrderId(fallbackId);
    setLastOrderItems([...items]);

    // Save to Supabase tied to this specific Clerk user
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            user_id: effectiveUserId,
            subtotal,
            discount,
            total: orderTotal,
            status: 'Completed',
            payment_method: paymentMethod,
            items: items,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        const persistedId = data.id;
        setOrderId(persistedId);
        setOrders((prev) => prev.map((o) => (o.id === fallbackId ? { ...o, id: persistedId } : o)));
        return persistedId;
      }
    } catch (err) {
      console.warn('Could not persist order to Supabase:', err);
    }

    return fallbackId;
  };

  const deleteOrder = async (orderIdToDelete: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderIdToDelete));
    if (userId) {
      try {
        await supabase.from('orders').delete().eq('id', orderIdToDelete).eq('user_id', userId);
      } catch (err) {
        console.warn('Could not delete order from Supabase:', err);
      }
    }
  };

  const deletePromptFromOrder = async (orderIdTarget: string, promptIdToDelete: string) => {
    const targetOrder = orders.find((o) => o.id === orderIdTarget);
    if (!targetOrder) return;

    const updatedItems = targetOrder.items.filter((item) => item.prompt.id !== promptIdToDelete);
    if (updatedItems.length === 0) {
      await deleteOrder(orderIdTarget);
      return;
    }

    const newSubtotal = updatedItems.reduce((acc, item) => {
      const price = typeof item.prompt.price === 'number' ? item.prompt.price : 0;
      return acc + price * item.quantity;
    }, 0);
    const newTotal = Math.max(0, newSubtotal - targetOrder.discount);

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderIdTarget
          ? {
              ...order,
              items: updatedItems,
              subtotal: newSubtotal,
              total: newTotal,
            }
          : order
      )
    );

    if (userId) {
      try {
        await supabase
          .from('orders')
          .update({
            items: updatedItems,
            subtotal: newSubtotal,
            total: newTotal,
          })
          .eq('id', orderIdTarget)
          .eq('user_id', userId);
      } catch (err) {
        console.warn('Could not update order in Supabase:', err);
      }
    }
  };

  const clearOrders = async () => {
    setOrders([]);
    try {
      localStorage.removeItem(ordersStorageKey);
    } catch {
      // ignore
    }
    if (userId) {
      try {
        await supabase.from('orders').delete().eq('user_id', userId);
      } catch (err) {
        console.warn('Could not clear orders in Supabase:', err);
      }
    }
  };

  const clearCart = () => {
    if (cart.length > 0) {
      setLastOrderItems([...cart]);
    }
    setCart([]);
    try {
      localStorage.removeItem(cartStorageKey);
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
  const tax = 0.0;
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
        isLoadingOrders,
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
