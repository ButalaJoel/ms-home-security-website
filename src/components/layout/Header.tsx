import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, ChevronRight, Menu, Search, ShoppingCart } from "lucide-react";
import { NAV, menuForPath, type NavMenu, type NavTab } from "../../config/navigation.ts";
import { CATEGORIES } from "../../config/categories.ts";
import { useCart } from "../../context/CartContext.tsx";
import { useShop } from "../../context/ShopContext.tsx";

interface Props { onSearch: () => void; onMenu: () => void }

// Solid white bar with a plain text menu; each item opens a full-width panel (hikvision.com style).
export default function Header({ onSearch, onMenu }: Props) {
  const { count, open: openCart } = useCart();
  const { pathname } = useLocation();
  const [active, setActive] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setActive(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { setActive(null); }, [pathname]);

  const openSoon = (i: number) => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setActive(i), 90); };
  const closeSoon = () => { window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setActive(null), 160); };
  const keep = () => window.clearTimeout(timer.current);
  const current = menuForPath(pathname);

  return (
    <header className={"sticky top-0 z-40 bg-white transition-shadow " + (scrolled || active !== null ? "shadow-[0_1px_0_var(--color-line),0_6px_20px_rgba(11,38,59,0.06)]" : "shadow-[0_1px_0_var(--color-line)]")} onMouseLeave={closeSoon}>
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center gap-6 px-5 lg:px-8">
        <Link to="/" className="shrink-0" aria-label="MS Home Security Solutions, home">
          <img src="/logo.png" alt="MS Home Security Solutions" width={96} height={48} className="h-11 w-auto lg:h-12" />
        </Link>

        <nav className="hidden h-full flex-1 items-stretch justify-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onMouseEnter={() => openSoon(i)}
              onClick={() => setActive(active === i ? null : i)}
              aria-expanded={active === i}
              className={
                "relative px-5 text-[15px] font-medium transition-colors after:absolute after:inset-x-5 after:bottom-0 after:h-[3px] after:rounded-t after:transition-opacity " +
                (active === i || current === m.id ? "text-brand-dark after:bg-brand after:opacity-100" : "text-ink after:opacity-0 hover:text-brand-dark")
              }
            >
              {m.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <IconButton label="Search products" onClick={onSearch}><Search className="h-[21px] w-[21px]" /></IconButton>
          <IconButton label={"Cart, " + count + " items"} onClick={openCart}>
            <ShoppingCart className="h-[21px] w-[21px]" />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">{count > 99 ? "99+" : count}</span>
            )}
          </IconButton>
          <Link to="/installation#request" className="ml-2 hidden rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-brand-dark lg:inline-block">
            Get a quote
          </Link>
          <span className="lg:hidden"><IconButton label="Open menu" onClick={onMenu}><Menu className="h-6 w-6" /></IconButton></span>
        </div>
      </div>

      {active !== null && (
        <div className="anim-drop absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_24px_40px_rgba(11,38,59,0.12)] lg:block" onMouseEnter={keep}>
          <MegaPanel key={NAV[active].id} menu={NAV[active]} />
        </div>
      )}
    </header>
  );
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-paper hover:text-brand-dark">
      {children}
    </button>
  );
}

function MegaPanel({ menu }: { menu: NavMenu }) {
  const { products } = useShop();
  const [tabIndex, setTabIndex] = useState(0);

  // Products: one tab per category, filled with the live catalogue.
  const tabs: (NavTab & { to?: string; icon?: (typeof CATEGORIES)[number]["icon"] })[] = useMemo(() => {
    if (menu.kind !== "products") return menu.tabs;
    return CATEGORIES.map(c => ({
      label: c.name,
      to: "/products/" + c.slug,
      icon: c.icon,
      links: products.filter(p => p.category === c.name).map(p => ({ label: p.name, to: "/product/" + p.id, desc: p.brand })),
    }));
  }, [menu, products]);

  const tab = tabs[Math.min(tabIndex, tabs.length - 1)];
  const isProducts = menu.kind === "products";
  const TabIcon = tab.icon;

  return (
    <div className="mx-auto max-w-[1320px] px-8">
      <div className="grid min-h-[300px] grid-cols-[260px_1fr] gap-10 py-7" style={menu.feature ? { gridTemplateColumns: "260px 1fr 300px" } : undefined}>
        <ul className="border-r border-line pr-6">
          {tabs.map((t, i) => (
            <li key={t.label}>
              <button
                type="button"
                onMouseEnter={() => setTabIndex(i)}
                onFocus={() => setTabIndex(i)}
                className={"flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-[14px] transition " + (i === tabIndex ? "bg-paper font-semibold text-ink" : "text-ink-soft hover:text-ink")}
              >
                {t.label}
                <ChevronRight className={"h-4 w-4 transition " + (i === tabIndex ? "text-brand" : "text-transparent")} />
              </button>
            </li>
          ))}
        </ul>

        <div className="anim-fade" key={tab.label}>
          {isProducts && (
            <div className="mb-4 flex items-center gap-3">
              {TabIcon && <TabIcon className="h-6 w-6 text-brand" strokeWidth={1.6} />}
              <h3 className="text-[16px] font-bold">{tab.label}</h3>
              {tab.to && <Link to={tab.to} className="ml-auto inline-flex items-center gap-1 text-[13.5px] font-semibold text-brand-dark hover:underline">View all <ChevronRight className="h-4 w-4" /></Link>}
            </div>
          )}
          {tab.links.length === 0 ? (
            <p className="text-[14px] text-ink-soft">Products in this category are coming soon. <Link to="/contact" className="font-semibold text-brand-dark underline">Ask us</Link> for availability.</p>
          ) : (
            <ul className={"grid gap-x-8 " + (isProducts ? "grid-cols-3 gap-y-1" : "grid-cols-2 gap-y-2")}>
              {tab.links.map(l => (
                <li key={l.to + l.label}>
                  <Link to={l.to} className="group block rounded-md px-2 py-2 -mx-2 transition hover:bg-paper">
                    <span className="block text-[14px] font-medium text-ink group-hover:text-brand-dark">{l.label}</span>
                    {l.desc && <span className="block text-[12.5px] text-ink-soft">{l.desc}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {menu.feature && (
          <Link to={menu.feature.to} className="group flex flex-col justify-between rounded-xl bg-ink p-6 text-white">
            <div>
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-brand">{menu.feature.kicker}</p>
              <h4 className="mt-2 text-[18px] font-bold leading-snug">{menu.feature.title}</h4>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/70">{menu.feature.text}</p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand transition-all group-hover:gap-2.5">{menu.feature.cta} <ArrowRight className="h-4 w-4" /></span>
          </Link>
        )}
      </div>

      {menu.tools && (
        <div className="flex flex-wrap gap-x-10 gap-y-2 border-t border-line py-4">
          {menu.tools.map(t => (
            <Link key={t.to} to={t.to} className="inline-flex items-center gap-1 text-[14px] font-medium text-ink hover:text-brand-dark">
              {t.label} <ChevronRight className="h-4 w-4 text-brand" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
