import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, Building2, ChevronLeft, ChevronRight, Home, Hotel, ParkingSquare, School,
  Smartphone, Truck, Wrench, type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "../../config/categories.ts";
import { SOLUTIONS } from "../../config/navigation.ts";
import { useShop } from "../../context/ShopContext.tsx";
import { ProductCard } from "../product/ProductBits.tsx";

const wrap = "mx-auto max-w-[1320px] px-5 lg:px-8";

export function SectionTitle({ title, link, dark = false }: { title: string; link?: { label: string; to: string }; dark?: boolean }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <h2 className={"text-[28px] font-bold leading-tight sm:text-[38px] " + (dark ? "text-white" : "text-ink")}>{title}</h2>
      {link && (
        <Link to={link.to} className={"inline-flex items-center gap-1.5 text-[15px] font-semibold transition-all hover:gap-2.5 " + (dark ? "text-white" : "text-ink hover:text-brand-dark")}>
          {link.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

// Tall rounded cards with the title on the picture, scrolling sideways (hikvision.com's product spotlight row).
// Until there are real photos, each card shows the category's icon on a tinted night background.
const TINTS = ["#0b4a6f", "#3a2d6e", "#0f5a57", "#123a6b", "#4a3b12", "#16405a", "#2c3f62", "#5a2a2a"];

export function SpotlightRow() {
  const row = useRef<HTMLDivElement>(null);
  const { products } = useShop();
  const scroll = (dir: 1 | -1) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <section className="pt-16 sm:pt-20">
      <div className={wrap + " flex items-end justify-between gap-4"}>
        <h2 className="text-[28px] font-bold leading-tight sm:text-[38px]">Explore our range</h2>
        <div className="flex gap-2">
          <ArrowButton label="Previous" onClick={() => scroll(-1)}><ChevronLeft className="h-5 w-5" /></ArrowButton>
          <ArrowButton label="Next" onClick={() => scroll(1)}><ChevronRight className="h-5 w-5" /></ArrowButton>
        </div>
      </div>
      <div ref={row} className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 lg:scroll-px-8 lg:px-[max(2rem,calc((100vw-1320px)/2+2rem))]">
        {CATEGORIES.map(({ slug, name, blurb, icon: Icon }, i) => {
          const n = products.filter(p => p.category === name).length;
          return (
            <Link
              key={slug}
              to={"/products/" + slug}
              className="group relative aspect-[3/4] w-[72vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl text-white sm:w-[300px]"
              style={{ background: `radial-gradient(120% 90% at 70% 20%, ${TINTS[i % TINTS.length]} 0%, #05121d 70%)` }}
            >
              <div className="dot-grid absolute inset-0 opacity-70" />
              <Icon className="absolute left-1/2 top-[38%] h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 text-white/85 transition duration-500 group-hover:scale-110" strokeWidth={0.9} />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 pt-16">
                <h3 className="text-[21px] font-bold leading-tight">{name}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/75">{blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand">
                  {n > 0 ? n + " products" : "View range"} <ArrowRight className="h-3.5 w-3.5 transition-all group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function ArrowButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition hover:border-ink hover:bg-ink hover:text-white">
      {children}
    </button>
  );
}

export function FeaturedProducts() {
  const { products, loading, error, reload } = useShop();
  const featured = products.filter(p => p.featured);
  const list = (featured.length >= 4 ? featured : products).slice(0, 8);
  return (
    <section className="mt-16 bg-paper py-16 sm:mt-20 sm:py-20">
      <div className={wrap}>
        <SectionTitle title="Popular products" link={{ label: "Shop all products", to: "/products" }} />
        {error ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            <p className="text-ink-soft">{error}</p>
            <button type="button" onClick={reload} className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white">Try again</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }, (_, i) => <div key={i} className="h-[330px] animate-pulse rounded-2xl bg-white" />)
              : list.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}

// Black section with a list on the left that switches the big panel on the right
// (hikvision.com's "Core Technologies" block).
interface Reason { title: string; text: string; points: string[]; icon: LucideIcon; stat: string; statLabel: string }

export function WhyUs() {
  const { business } = useShop();
  const reasons: Reason[] = [
    { title: "Supply", icon: Truck, stat: "8", statLabel: "product ranges in one shop", text: "Cameras, access control, locks, alarms, radios, detectors and parking systems from one supplier.", points: ["Hikvision, ZKTeco, Motorola, Garrett and Baofeng", "Delivery anywhere in Uganda", "Pay by Mobile Money or on delivery"] },
    { title: "Installation", icon: Wrench, stat: "4", statLabel: "clear steps, start to finish", text: "Our own technicians survey the site, quote, install and test, anywhere in Uganda.", points: ["Site survey and written quotation", business.installationTerms, "Tidy cabling and labelled equipment"] },
    { title: "Phone viewing", icon: Smartphone, stat: "24/7", statLabel: "view your cameras from your phone", text: "Before we leave, your cameras are set up on your phone and you know how to use them.", points: ["App installed and tested with you", "Playback and alerts explained", "Extra users added for family or managers"] },
    { title: "Warranty & support", icon: BadgeCheck, stat: business.warranty.replace(/\s*months?/i, " mo"), statLabel: "warranty on installations", text: "If something stops working, call or WhatsApp us and we'll sort it out.", points: [business.warranty + " installation warranty", "Support by phone, WhatsApp or site visit", "Spare parts and upgrades available"] },
  ];
  const [i, setI] = useState(0);
  const r = reasons[i];
  return (
    <section className="bg-black py-16 text-white sm:py-24">
      <div className={wrap}>
        <SectionTitle title="Why MS Home Security" link={{ label: "About us", to: "/about" }} dark />
        <div className="grid gap-8 lg:grid-cols-[320px_1fr] lg:gap-14">
          <ul className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col lg:gap-0">
            {reasons.map((x, k) => (
              <li key={x.title} className="shrink-0">
                <button
                  type="button"
                  onMouseEnter={() => setI(k)}
                  onClick={() => setI(k)}
                  aria-pressed={k === i}
                  className={
                    "w-full whitespace-nowrap rounded-full border px-4 py-2 text-left text-[15px] font-semibold transition lg:whitespace-normal lg:rounded-none lg:border-0 lg:border-l-2 lg:px-6 lg:py-5 lg:text-[22px] " +
                    (k === i ? "border-brand bg-brand text-white lg:bg-transparent lg:text-white" : "border-white/20 text-white/45 hover:text-white/80 lg:border-white/10")
                  }
                >
                  {x.title}
                </button>
              </li>
            ))}
          </ul>
          <div key={r.title} className="anim-fade relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d2a40] to-[#05121d] p-7 sm:p-10">
            <div className="dot-grid absolute inset-0 opacity-60" />
            <r.icon className="absolute -right-8 -top-8 h-64 w-64 text-brand/10" strokeWidth={0.8} />
            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <h3 className="text-[26px] font-bold sm:text-[32px]">{r.title}</h3>
                <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-white/70">{r.text}</p>
                <ul className="mt-6 space-y-3">
                  {r.points.map(p => (
                    <li key={p} className="flex items-start gap-3 text-[15px] text-white/85"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />{p}</li>
                  ))}
                </ul>
              </div>
              <div className="md:text-right">
                <p className="font-display text-[56px] font-extrabold leading-none text-brand sm:text-[72px]">{r.stat}</p>
                <p className="mt-2 text-[13.5px] text-white/60">{r.statLabel}</p>
              </div>
            </div>
            <Link to="/installation#request" className="relative mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14.5px] font-semibold text-ink transition hover:bg-brand hover:text-white">
              Request a site survey <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Solution tiles by place (hikvision.com "Solutions by Industry" tiles).
const SOLUTION_ICONS: Record<string, LucideIcon> = { homes: Home, "shops-offices": Building2, schools: School, "hotels-events": Hotel, "parking-estates": ParkingSquare };

export function SolutionTiles() {
  return (
    <section className={wrap + " pt-16 sm:pt-24"}>
      <SectionTitle title="Solutions for every place" link={{ label: "Business quotes", to: "/for-businesses" }} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {SOLUTIONS.map((s, i) => {
          const Icon = SOLUTION_ICONS[s.slug];
          const big = i < 2;
          return (
            <Link
              key={s.slug}
              to={"/solutions/" + s.slug}
              className={"group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl bg-ink p-6 text-white " + (big ? "lg:col-span-3 lg:min-h-[300px]" : "lg:col-span-2")}
            >
              <div className="dot-grid absolute inset-0 opacity-50" />
              <Icon className="absolute right-6 top-6 h-24 w-24 text-brand/25 transition duration-500 group-hover:scale-110 group-hover:text-brand/40" strokeWidth={0.9} />
              <div className="relative">
                <h3 className="text-[22px] font-bold">{s.label}</h3>
                <p className="mt-1 max-w-sm text-[14px] text-white/70">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-brand">Learn more <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const BRANDS = ["Hikvision", "ZKTeco", "Motorola", "Garrett", "Baofeng"];

export function BrandStrip() {
  return (
    <section className={wrap + " py-16 sm:py-20"}>
      <p className="text-center text-[13px] font-semibold uppercase tracking-[0.16em] text-ink-soft">Brands we supply and install</p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
        {BRANDS.map(b => <li key={b} className="font-display text-[22px] font-extrabold tracking-tight text-ink/30">{b}</li>)}
      </ul>
    </section>
  );
}

// Thin dark banner across the page (hikvision.com "Find a Distributor").
export function DistributorBanner() {
  return (
    <section className="relative overflow-hidden bg-night text-white">
      <div className="dot-grid absolute inset-0" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/15 blur-[100px]" />
      <div className="relative mx-auto max-w-2xl px-5 py-16 text-center sm:py-20">
        <h2 className="text-[28px] font-bold sm:text-[36px]">Become a distributor</h2>
        <p className="mt-3 text-[16px] leading-relaxed text-white/70">Sell and install MS Home Security products in your town. Get trade prices, stock support and training from our team.</p>
        <Link to="/become-a-distributor" className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-brand-dark">
          Apply now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
