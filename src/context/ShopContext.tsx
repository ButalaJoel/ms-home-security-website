import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchBusiness, fetchProducts } from "../lib/api.ts";
import type { BusinessDetails, PublicProduct } from "../lib/types.ts";
import { SAMPLE_BUSINESS } from "../data/sampleBusiness.ts";

interface ShopState {
  products: PublicProduct[];
  business: BusinessDetails;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

const ShopContext = createContext<ShopState | null>(null);

// Loads the catalogue and business details once, for every page.
export function ShopProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [business, setBusiness] = useState<BusinessDetails>(SAMPLE_BUSINESS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchProducts(), fetchBusiness()])
      .then(([p, b]) => {
        if (cancelled) return;
        setProducts(p);
        setBusiness(b);
        setError(null);
      })
      .catch((e: unknown) => { if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt]);

  const reload = () => { setLoading(true); setAttempt(a => a + 1); };

  return (
    <ShopContext.Provider value={{ products, business, loading, error, reload }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
