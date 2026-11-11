import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { categoryByName } from "../../config/categories.ts";
import { formatUGX, STOCK_LABEL } from "../../lib/format.ts";
import type { PublicProduct, StockStatus } from "../../lib/types.ts";
import { useCart } from "../../context/CartContext.tsx";

/** Product photo from the POS (Cloudinary), or the category icon on a soft panel when there is none yet. */
export function ProductImage({ src, category, name, className = "" }: { src: string; category: string; name: string; className?: string }) {
  const Icon = categoryByName(category)?.icon;
  if (src) return <img src={src} alt={name} loading="lazy" className={"h-full w-full object-contain " + className} />;
  return (
    <div className={"flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-soft to-white " + className} aria-hidden="true">
      {Icon && <Icon className="h-1/3 w-1/3 text-brand/70" strokeWidth={1.25} />}
    </div>
  );
}

const STOCK_STYLE: Record<StockStatus, string> = {
  in_stock: "bg-ok/10 text-ok",
  low_stock: "bg-warn/10 text-warn",
  available_to_order: "bg-ink/5 text-ink-soft",
};

export function StockBadge({ stock }: { stock: StockStatus }) {
  return (
    <span className={"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold " + STOCK_STYLE[stock]}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STOCK_LABEL[stock]}
    </span>
  );
}

export function ProductCard({ product }: { product: PublicProduct }) {
  const { add } = useCart();
  const href = "/product/" + product.id;
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(11,38,59,0.10)]">
      <Link to={href} className="relative block aspect-[4/3] bg-paper">
        <ProductImage src={product.imageUrl} category={product.category} name={product.name} className="p-4" />
        <span className="absolute left-2 top-2 sm:left-3 sm:top-3"><StockBadge stock={product.stock} /></span>
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <p className="text-[11.5px] font-semibold uppercase tracking-wider text-brand-dark">{product.brand || categoryByName(product.category)?.short}</p>
        <h3 className="font-sans text-[14px] font-semibold sm:text-[15px] leading-snug text-ink">
          <Link to={href} className="hover:text-brand-dark">{product.name}</Link>
        </h3>
        {product.model && <p className="truncate font-mono text-[12px] text-ink-soft">{product.model}</p>}
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className={product.price > 0 ? "font-display text-[15px] font-bold text-ink sm:text-[17px]" : "text-sm font-semibold text-ink-soft"}>{formatUGX(product.price)}</p>
          <button
            type="button"
            onClick={() => add(product)}
            aria-label={"Add " + product.name + " to cart"}
            className="inline-flex h-9 w-9 shrink-0 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-ink text-white transition hover:bg-brand-dark"
          >
            <ShoppingCart className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </article>
  );
}
