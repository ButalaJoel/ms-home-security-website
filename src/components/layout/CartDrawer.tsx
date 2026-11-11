import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { useCart } from "../../context/CartContext.tsx";
import { formatUGX } from "../../lib/format.ts";
import { ProductImage } from "../product/ProductBits.tsx";

export default function CartDrawer() {
  const { items, count, subtotal, hasPriceOnRequest, isOpen, close, setQty, remove } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [isOpen, close]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
      <div className="anim-fade absolute inset-0 bg-ink/50" onClick={close} />
      <aside className="anim-slide absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-bold">Your cart ({count})</h2>
          <button type="button" onClick={close} className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-paper" aria-label="Close cart"><X className="h-5 w-5" /></button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingCart className="h-12 w-12 text-line" strokeWidth={1.5} />
            <p className="text-ink-soft">Your cart is empty.</p>
            <Link to="/products" onClick={close} className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">Browse products</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {items.map(item => (
                <li key={item.productId} className="flex gap-4 border-b border-line/70 py-4">
                  <Link to={"/product/" + item.productId} onClick={close} className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-paper">
                    <ProductImage src={item.imageUrl} category={item.category} name={item.name} className="p-1.5" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold leading-snug text-ink">{item.name}</p>
                    <p className="mt-0.5 text-[13px] text-ink-soft">{formatUGX(item.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-line">
                        <button type="button" onClick={() => setQty(item.productId, item.qty - 1)} disabled={item.qty <= 1} className="flex h-8 w-8 items-center justify-center rounded-full disabled:opacity-30" aria-label="One less"><Minus className="h-3.5 w-3.5" /></button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                        <button type="button" onClick={() => setQty(item.productId, item.qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-full" aria-label="One more"><Plus className="h-3.5 w-3.5" /></button>
                      </div>
                      <button type="button" onClick={() => remove(item.productId)} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition hover:bg-paper hover:text-ink" aria-label={"Remove " + item.name}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line bg-paper px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-ink-soft">Subtotal</span>
                <span className="font-display text-xl font-bold">{subtotal > 0 ? formatUGX(subtotal) : "—"}</span>
              </div>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                {hasPriceOnRequest ? "Some items are priced on request; we'll confirm the total when we call you. " : ""}
                No payment now. We call to confirm, then you pay by Mobile Money or on delivery.
              </p>
              <Link to="/checkout" onClick={close} className="mt-4 block rounded-full bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark">
                Checkout
              </Link>
              <button type="button" onClick={close} className="mt-2 w-full py-2 text-sm font-semibold text-ink-soft hover:text-ink">Continue shopping</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
