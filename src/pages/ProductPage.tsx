import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BadgeCheck, ChevronRight, MessageCircle, Minus, Plus, ShoppingCart, Truck, Wrench } from "lucide-react";
import { useShop } from "../context/ShopContext.tsx";
import { useCart } from "../context/CartContext.tsx";
import { categoryByName } from "../config/categories.ts";
import { formatUGX, whatsappLink } from "../lib/format.ts";
import { ProductCard, ProductImage, StockBadge } from "../components/product/ProductBits.tsx";
import { NotFoundPage } from "./ComingNextPage.tsx";

export default function ProductPage() {
  const { id } = useParams();
  const { products, business, loading } = useShop();
  const { add } = useCart();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const [photo, setPhoto] = useState(0);
  const [tab, setTab] = useState<"specs" | "overview">("specs");

  const related = useMemo(() => {
    if (!product) return [];
    const same = products.filter(p => p.id !== product.id && p.category === product.category);
    same.sort((a, b) => Number(b.subcategory === product.subcategory) - Number(a.subcategory === product.subcategory));
    return same.slice(0, 4);
  }, [products, product]);

  if (loading) return <div className="mx-auto h-[60vh] max-w-[1320px] animate-pulse px-5 py-10 lg:px-8"><div className="h-full rounded-2xl bg-paper" /></div>;
  if (!product) return <NotFoundPage />;

  const category = categoryByName(product.category);
  const photos = [product.imageUrl, ...(product.images ?? [])].filter(Boolean);
  const specs = product.specs?.length ? product.specs : [
    ...(product.model ? [{ label: "Model", value: product.model }] : []),
    { label: "Brand", value: product.brand || "—" },
    { label: "Category", value: product.category },
  ];
  const hasOverview = !!(product.description || product.features?.length);
  const waText = `Hello MS Home Security, I'd like to order ${qty} × ${product.name}${product.model ? " (" + product.model + ")" : ""}.`;

  return (
    <>
      <div className="mx-auto max-w-[1320px] px-5 pt-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-soft">
          <Link to="/" className="hover:text-ink">Home</Link><ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="hover:text-ink">Products</Link><ChevronRight className="h-3.5 w-3.5" />
          {category && <><Link to={"/products/" + category.slug} className="hover:text-ink">{category.name}</Link><ChevronRight className="h-3.5 w-3.5" /></>}
          <span className="text-ink">{product.model || product.name}</span>
        </nav>
      </div>

      <section className="mx-auto grid max-w-[1320px] gap-8 px-5 py-8 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-paper">
            <ProductImage src={photos[photo] ?? ""} category={product.category} name={product.name} className="p-8" />
          </div>
          {photos.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
              {photos.map((src, i) => (
                <button key={src} type="button" onClick={() => setPhoto(i)} aria-label={"Photo " + (i + 1)} className={"h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-paper " + (i === photo ? "border-brand" : "border-transparent")}>
                  <img src={src} alt="" className="h-full w-full object-contain p-1.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-dark">{[product.brand, product.series].filter(Boolean).join(" · ")}</p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[34px]">{product.name}</h1>
          {product.model && <p className="mt-2 font-mono text-[14px] text-ink-soft">Model {product.model}</p>}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className={product.price > 0 ? "text-[28px] font-bold" : "text-[20px] font-semibold text-ink-soft"}>{formatUGX(product.price)}</p>
            <StockBadge stock={product.stock} />
          </div>
          {product.price <= 0 && <p className="mt-1 text-[14px] text-ink-soft">Add it to your cart or ask on WhatsApp; we'll confirm the price when we call.</p>}

          {product.features && product.features.length > 0 && (
            <ul className="mt-6 space-y-2">
              {product.features.map(f => <li key={f} className="flex items-start gap-2.5 text-[15px]"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />{f}</li>)}
            </ul>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="inline-flex h-12 items-center rounded-full border border-line">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1} className="flex h-12 w-12 items-center justify-center disabled:opacity-30" aria-label="One less"><Minus className="h-4 w-4" /></button>
              <span className="w-10 text-center font-semibold tabular-nums" aria-live="polite">{qty}</span>
              <button type="button" onClick={() => setQty(q => Math.min(999, q + 1))} className="flex h-12 w-12 items-center justify-center" aria-label="One more"><Plus className="h-4 w-4" /></button>
            </div>
            <button type="button" onClick={() => add(product, qty)} className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand px-7 text-[15px] font-semibold text-white transition hover:bg-brand-dark sm:flex-none">
              <ShoppingCart className="h-5 w-5" /> Add to cart
            </button>
            {business.whatsapp && (
              <a href={whatsappLink(business.whatsapp, waText)} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-6 text-[15px] font-semibold transition hover:border-[#1fa855] hover:text-[#1fa855]">
                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
              </a>
            )}
          </div>

          <ul className="mt-8 divide-y divide-line rounded-2xl border border-line">
            <li className="flex items-start gap-3 p-4 text-[14px]"><Truck className="mt-0.5 h-5 w-5 shrink-0 text-brand" /><span><strong className="font-semibold">Delivery anywhere in Uganda</strong> or pick up at the shop. No payment now: we call to confirm, then you pay by MoMo or on delivery.</span></li>
            <li className="flex items-start gap-3 p-4 text-[14px]"><Wrench className="mt-0.5 h-5 w-5 shrink-0 text-brand" /><span><strong className="font-semibold">Need it installed?</strong> {business.installationTerms} <Link to="/installation#request" className="font-semibold text-brand-dark hover:underline">Request a site survey</Link></span></li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 lg:px-8">
        <div className="flex gap-6 border-b border-line" role="tablist">
          <TabButton active={tab === "specs"} onClick={() => setTab("specs")}>Specifications</TabButton>
          {hasOverview && <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>Overview</TabButton>}
        </div>
        <div className="py-8">
          {tab === "specs" || !hasOverview ? (
            <dl className="max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {specs.map(s => (
                <div key={s.label} className="grid grid-cols-[minmax(120px,0.4fr)_1fr] text-[14.5px]">
                  <dt className="bg-paper px-4 py-3 font-medium text-ink-soft">{s.label}</dt>
                  <dd className="px-4 py-3">{s.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="max-w-3xl space-y-4 text-[15.5px] leading-relaxed">
              {product.description && <p>{product.description}</p>}
              {product.features && <ul className="list-disc space-y-1.5 pl-5">{product.features.map(f => <li key={f}>{f}</li>)}</ul>}
            </div>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-paper py-14">
          <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2 className="text-[26px] font-bold">You may also need</h2>
              {category && <Link to={"/products/" + category.slug} className="text-[14.5px] font-semibold text-brand-dark hover:underline">All {category.short}</Link>}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
          </div>
        </section>
      )}
    </>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" role="tab" aria-selected={active} onClick={onClick} className={"-mb-px border-b-2 py-3 text-[15px] font-semibold transition " + (active ? "border-brand text-ink" : "border-transparent text-ink-soft hover:text-ink")}>
      {children}
    </button>
  );
}
