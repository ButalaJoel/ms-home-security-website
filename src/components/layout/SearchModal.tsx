import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { useShop } from "../../context/ShopContext.tsx";
import { CATEGORIES } from "../../config/categories.ts";
import { formatUGX } from "../../lib/format.ts";
import { ProductImage } from "../product/ProductBits.tsx";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Searches the POS catalogue by name, brand, category and SKU. Every word must match.
export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { products } = useShop();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    setQ("");
    const t = window.setTimeout(() => input.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => { window.clearTimeout(t); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  const results = useMemo(() => {
    const words = norm(q).split(" ").filter(Boolean);
    if (!words.length) return [];
    return products
      .filter(p => { const hay = norm([p.name, p.brand, p.category, p.sku].join(" ")); return words.every(w => hay.includes(w)); })
      .slice(0, 8);
  }, [q, products]);

  if (!open) return null;
  const go = (to: string) => { onClose(); navigate(to); };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]" role="dialog" aria-modal="true" aria-label="Search products">
      <div className="anim-fade absolute inset-0 bg-ink/55" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <form
          className="flex items-center gap-3 border-b border-line px-5"
          onSubmit={e => { e.preventDefault(); if (results[0]) go("/product/" + results[0].id); }}
        >
          <Search className="h-5 w-5 shrink-0 text-ink-soft" />
          <input
            ref={input}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search cameras, locks, radios, brands…"
            className="h-16 w-full bg-transparent text-[16px] outline-none placeholder:text-ink-soft/60"
            aria-label="Search"
          />
          <button type="button" onClick={onClose} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-paper" aria-label="Close search"><X className="h-5 w-5" /></button>
        </form>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {q.trim() === "" ? (
            <div className="p-3">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-soft">Browse categories</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(c => (
                  <button key={c.slug} type="button" onClick={() => go("/products/" + c.slug)} className="rounded-full border border-line px-3.5 py-1.5 text-[13px] text-ink-soft hover:border-brand hover:text-brand-dark">
                    {c.short}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-soft">
              Nothing matches “{q.trim()}”. <Link to="/contact" onClick={onClose} className="font-semibold text-brand-dark underline">Ask us</Link>, we may still supply it.
            </p>
          ) : (
            results.map(p => (
              <button key={p.id} type="button" onClick={() => go("/product/" + p.id)} className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-paper">
                <span className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-paper"><ProductImage src={p.imageUrl} category={p.category} name={p.name} className="p-1" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14.5px] font-semibold text-ink">{p.name}</span>
                  <span className="block text-[12.5px] text-ink-soft">{p.category}</span>
                </span>
                <span className="shrink-0 text-[13px] font-semibold text-ink">{formatUGX(p.price)}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
