import { create } from 'zustand';
import { User, UserRole, Product, OrderItem } from './types';

// --- AUTH STORE ---
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// --- POS STORE ---
interface POSState {
  cart: OrderItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  orderType: 'dine-in' | 'takeaway';
  setOrderType: (type: 'dine-in' | 'takeaway') => void;
}

export const usePOSStore = create<POSState>((set) => ({
  cart: [],
  orderType: 'dine-in',
  setOrderType: (type) => set({ orderType: type }),
  addToCart: (product) => set((state) => {
    const existing = state.cart.find(item => item.product.id === product.id);
    if (existing) {
      return {
        cart: state.cart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      };
    }
    return { cart: [...state.cart, { product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({
    cart: state.cart.filter(item => item.product.id !== productId)
  })),
  updateQuantity: (productId, delta) => set((state) => ({
    cart: state.cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    })
  })),
  clearCart: () => set({ cart: [] }),
}));

// --- UI STORE (Toasts) ---
export interface Toast {
  id: string;
  type: 'success' | 'danger' | 'info' | 'warning';
  message: string;
}

interface UIState {
  toasts: Toast[];
  addToast: (type: Toast['type'], message: string) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  toasts: [],
  addToast: (type, message) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, type, message }] }));
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));