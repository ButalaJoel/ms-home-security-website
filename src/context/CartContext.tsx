import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem, PublicProduct } from "../lib/types.ts";

interface CartState {
  items: CartItem[];
  count: number;
  /** Total of priced items only. Items with "Price on request" are confirmed by staff. */
  subtotal: number;
  hasPriceOnRequest: boolean;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (product: PublicProduct, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "msh-cart-v1";
const MAX_QTY = 999;

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]).filter(i => i && typeof i.productId === "string" && i.qty > 0) : [];
  } catch {
    return [];
  }
}

// The cart is kept in this browser only. Prices are checked again by the POS when the order is sent.
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* private window: cart lasts this visit */ }
  }, [items]);

  const value = useMemo<CartState>(() => {
    const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.floor(n) || 1));
    return {
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.price * i.qty, 0),
      hasPriceOnRequest: items.some(i => i.price <= 0),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add: (p, qty = 1) => {
        setItems(prev => {
          const found = prev.find(i => i.productId === p.id);
          if (found) return prev.map(i => (i.productId === p.id ? { ...i, qty: clamp(i.qty + qty) } : i));
          return [...prev, { productId: p.id, name: p.name, sku: p.sku, price: p.price, imageUrl: p.imageUrl, category: p.category, qty: clamp(qty) }];
        });
        setIsOpen(true);
      },
      setQty: (id, qty) => setItems(prev => prev.map(i => (i.productId === id ? { ...i, qty: clamp(qty) } : i))),
      remove: id => setItems(prev => prev.filter(i => i.productId !== id)),
      clear: () => setItems([]),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
