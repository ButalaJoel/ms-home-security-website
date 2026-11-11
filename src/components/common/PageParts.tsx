import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";

export const wrap = "mx-auto max-w-[1320px] px-5 lg:px-8";

/** Dark band at the top of inner pages: breadcrumb, title, short intro, optional buttons. */
export function PageHero({ crumbs, title, intro, children }: { crumbs: { label: string; to?: string }[]; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-night text-white">
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-brand/15 blur-[100px]" />
      <div className={wrap + " relative py-10 sm:py-14"}>
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/60">
          <Link to="/" className="hover:text-white">Home</Link>
          {crumbs.map(c => (
            <span key={c.label} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="mt-4 max-w-3xl text-[32px] font-bold leading-tight sm:text-[46px]">{title}</h1>
        {intro && <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-white/70 sm:text-[17px]">{intro}</p>}
        {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}

export function HeroButton({ to, children, ghost = false }: { to: string; children: React.ReactNode; ghost?: boolean }) {
  const cls = ghost
    ? "border border-white/40 text-white hover:border-white hover:bg-white/10"
    : "bg-brand text-white hover:bg-brand-dark";
  const inner = <>{children} {!ghost && <ArrowRight className="h-4 w-4" />}</>;
  return to.startsWith("#")
    ? <a href={to} className={"inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition " + cls}>{inner}</a>
    : <Link to={to} className={"inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold transition " + cls}>{inner}</Link>;
}

export function SectionTitle({ kicker, title, text, center = false }: { kicker?: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={"mb-8 max-w-2xl " + (center ? "mx-auto text-center" : "")}>
      {kicker && <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-brand-dark">{kicker}</p>}
      <h2 className="text-[26px] font-bold leading-tight sm:text-[34px]">{title}</h2>
      {text && <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">{text}</p>}
    </div>
  );
}

/** Simple "nothing here yet" panel for pages that staff will fill from the POS. */
export function EmptyState({ icon: Icon, title, text, action }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; title: string; text: string; action?: { label: string; to: string } }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-paper px-6 py-14 text-center">
      <Icon className="mx-auto h-10 w-10 text-brand" strokeWidth={1.5} />
      <h3 className="mt-4 text-[19px] font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-[15px] text-ink-soft">{text}</p>
      {action && <Link to={action.to} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14.5px] font-semibold text-white hover:bg-brand-dark">{action.label} <ArrowRight className="h-4 w-4" /></Link>}
    </div>
  );
}

/** Light FAQ list using native <details>, so it works without JavaScript and with the keyboard. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line">
      {items.map(i => (
        <details key={i.q} className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-semibold">
            {i.q}
            <ChevronRight className="h-5 w-5 shrink-0 text-brand transition group-open:rotate-90" />
          </summary>
          <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{i.a}</p>
        </details>
      ))}
    </div>
  );
}
