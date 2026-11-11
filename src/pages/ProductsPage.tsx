import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES, categoryBySlug } from "../config/categories.ts";
import { useShop } from "../context/ShopContext.tsx";
import { ProductCard } from "../components/product/ProductBits.tsx";
import type { PublicProduct, StockStatus } from "../lib/types.ts";
import { STOCK_LABEL } from "../lib/format.ts";
import { NotFoundPage } from "./ComingNextPage.tsx";

const PAGE_SIZE = 24;
type Sort = "featured" | "price-asc" | "price-desc" | "name";
const SORTS: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A to Z" },
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const countBy = (list: PublicProduct[], key: (p: PublicProduct) => string | undefined) => {
  const m = new Map<string, number>();
  list.forEach(p => { const k = key(p); if (k) m.set(k, (m.get(k) ?? 0) + 1); });
  return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
};

// /products and /products/:category. Filters live in the address (?brand=…&type=…&q=…) so a filtered list can be shared.
export default function ProductsPage() {
  const { category: slug } = useParams();
  const category = slug ? categoryBySlug(slug) : undefined;
  const { products, loading, error, reload } = useShop();
  const [params, setParams] = useSearchParams();
  const [shown, setShown] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = params.get("q") ?? "";
  const brands = params.getAll("brand");
  const types = params.getAll("type");
  const stock = params.getAll("stock") as StockStatus[];
  const sort = (params.get("sort") as Sort) || "featured";

  const inCategory = useMemo(() => (category ? products.filter(p => p.category === category.name) : products), [products, category]);

  const results = useMemo(() => {
    const words = norm(q).split(" ").filter(Boolean);
    const list = inCategory.filter(p =>
      (!brands.length || brands.includes(p.brand)) &&
      (!types.length || (p.subcategory && types.includes(p.subcategory))) &&
      (!stock.length || stock.includes(p.stock)) &&
      (!words.length || words.every(w => norm([p.name, p.brand, p.model, p.sku, p.series, p.subcategory].join(" ")).includes(w))),
    );
    // Items priced "on request" (0) go after priced ones when sorting by price.
    const price = (p: PublicProduct, dir: 1 | -1) => (p.price > 0 ? p.price * dir : Number.MAX_SAFE_INTEGER);
    if (sort === "price-asc") list.sort((a, b) => price(a, 1) - price(b, 1));
    else if (sort === "price-desc") list.sort((a, b) => price(a, -1) - price(b, -1));
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else list.sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [inCategory, q, brands, types, stock, sort]);

  if (slug && !category) return <NotFoundPage />;

  const update = (fn: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    fn(next);
    setParams(next, { replace: true });
    setShown(PAGE_SIZE);
  };
  const toggle = (key: string, value: string) => update(p => {
    const all = p.getAll(key);
    p.delete(key);
    (all.includes(value) ? all.filter(v => v !== value) : [...all, value]).forEach(v => p.append(key, v));
  });
  const activeCount = brands.length + types.length + stock.length + (q ? 1 : 0);
  const clearAll = () => update(p => { ["q", "brand", "type", "stock"].forEach(k => p.delete(k)); });

  const filters = (
    <div className="space-y-7">
      <FilterGroup title="Category">
        <ul className="space-y-0.5">
          <li><CategoryLink to="/products" active={!category} label="All products" count={products.length} /></li>
          {CATEGORIES.map(c => (
            <li key={c.slug}><CategoryLink to={"/products/" + c.slug} active={category?.slug === c.slug} label={c.name} count={products.filter(p => p.category === c.name).length} /></li>
          ))}
        </ul>
      </FilterGroup>
      {countBy(inCategory, p => p.subcategory).length > 0 && (
        <FilterGroup title="Type">
          {countBy(inCategory, p => p.subcategory).map(([v, n]) => <Check key={v} label={v} count={n} checked={types.includes(v)} onChange={() => toggle("type", v)} />)}
        </FilterGroup>
      )}
      <FilterGroup title="Brand">
        {countBy(inCategory, p => p.brand).map(([v, n]) => <Check key={v} label={v} count={n} checked={brands.includes(v)} onChange={() => toggle("brand", v)} />)}
      </FilterGroup>
      <FilterGroup title="Availability">
        {(Object.keys(STOCK_LABEL) as StockStatus[]).map(s => {
          const n = inCategory.filter(p => p.stock === s).length;
          return n ? <Check key={s} label={STOCK_LABEL[s]} count={n} checked={stock.includes(s)} onChange={() => toggle("stock", s)} /> : null;
        })}
      </FilterGroup>
    </div>
  );

  return (
    <>
      <section className="relative overflow-hidden bg-night text-white">
        <div className="dot-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-[1320px] px-5 py-10 sm:py-14 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/60">
            <Link to="/" className="hover:text-white">Home</Link><ChevronRight className="h-3.5 w-3.5" />
            {category ? <><Link to="/products" className="hover:text-white">Products</Link><ChevronRight className="h-3.5 w-3.5" /><span className="text-white">{category.name}</span></> : <span className="text-white">Products</span>}
          </nav>
          <h1 className="mt-4 text-[32px] font-bold leading-tight sm:text-[44px]">{category ? category.name : "All products"}</h1>
          <p className="mt-2 max-w-2xl text-[16px] text-white/70">{category ? category.blurb : "Security equipment from the brands we trust, with delivery and installation anywhere in Uganda."}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-10 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="hidden lg:block" aria-label="Filters">{filters}</aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ink-soft" />
              <input
                value={q}
                onChange={e => update(p => (e.target.value ? p.set("q", e.target.value) : p.delete("q")))}
                placeholder="Search by name or model number"
                className="h-11 w-full rounded-full border border-line bg-white pl-10 pr-4 text-[15px] outline-none focus:border-brand"
                aria-label="Search products"
              />
            </label>
            <button type="button" onClick={() => setFiltersOpen(true)} className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[14px] font-semibold lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filters{activeCount > 0 && <span className="rounded-full bg-brand px-1.5 text-[11px] text-white">{activeCount}</span>}
            </button>
            <select
              value={sort}
              onChange={e => update(p => (e.target.value === "featured" ? p.delete("sort") : p.set("sort", e.target.value)))}
              className="h-11 rounded-full border border-line bg-white px-4 text-[14px] outline-none focus:border-brand"
              aria-label="Sort by"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13.5px] text-ink-soft">
            <span>{loading ? "Loading…" : results.length + (results.length === 1 ? " product" : " products")}</span>
            {[...types, ...brands, ...stock.map(s => STOCK_LABEL[s])].map(v => (
              <span key={v} className="inline-flex items-center gap-1 rounded-full bg-paper px-3 py-1 text-ink">{v}</span>
            ))}
            {activeCount > 0 && <button type="button" onClick={clearAll} className="font-semibold text-brand-dark hover:underline">Clear filters</button>}
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl bg-paper p-8 text-center">
              <p className="text-ink-soft">{error}</p>
              <button type="button" onClick={reload} className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
            </div>
          ) : loading ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="h-[330px] animate-pulse rounded-2xl bg-paper" />)}</div>
          ) : results.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-paper p-10 text-center">
              <p className="text-[16px] font-semibold">No products match.</p>
              <p className="mt-1 text-ink-soft">Try fewer filters, or <Link to="/contact" className="font-semibold text-brand-dark underline">ask us</Link>: we can often source it.</p>
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                {results.slice(0, shown).map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {shown < results.length && (
                <div className="mt-10 text-center">
                  <p className="mb-3 text-[13.5px] text-ink-soft">Showing {shown} of {results.length}</p>
                  <button type="button" onClick={() => setShown(s => s + PAGE_SIZE)} className="rounded-full border border-ink px-7 py-3 text-[14.5px] font-semibold hover:bg-ink hover:text-white">Show more</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="anim-fade absolute inset-0 bg-ink/50" onClick={() => setFiltersOpen(false)} />
          <div className="anim-slide absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-[17px] font-bold">Filters</h2>
              <button type="button" onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-paper"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">{filters}</div>
            <div className="flex gap-2 border-t border-line p-4">
              <button type="button" onClick={clearAll} className="flex-1 rounded-full border border-line py-3 text-[14.5px] font-semibold">Clear</button>
              <button type="button" onClick={() => setFiltersOpen(false)} className="flex-1 rounded-full bg-brand py-3 text-[14.5px] font-semibold text-white">Show {results.length}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-soft">{title}</h2>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function CategoryLink({ to, active, label, count }: { to: string; active: boolean; label: string; count: number }) {
  return (
    <Link to={to} className={"flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-[14px] transition " + (active ? "bg-paper font-semibold text-ink" : "text-ink-soft hover:text-ink")}>
      <span>{label}</span><span className="text-[12px] text-ink-soft/70">{count}</span>
    </Link>
  );
}

function Check({ label, count, checked, onChange }: { label: string; count: number; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[14px] text-ink hover:bg-paper">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-[var(--color-brand)]" />
      <span className="flex-1">{label}</span><span className="text-[12px] text-ink-soft/70">{count}</span>
    </label>
  );
}
