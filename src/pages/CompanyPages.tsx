import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { HeroButton, PageHero, SectionTitle, wrap } from "../components/common/PageParts.tsx";
import { CATEGORIES } from "../config/categories.ts";
import { useShop } from "../context/ShopContext.tsx";

const VALUES = [
  { icon: ShieldCheck, title: "Equipment that lasts", text: "We sell brands we trust and would install in our own homes." },
  { icon: Wrench, title: "Done properly", text: "Neat installation, tested before handover, and explained to you in plain words." },
  { icon: HeartHandshake, title: "Here after the sale", text: "Warranty, support and upgrades when you need them." },
  { icon: MapPin, title: "Across Uganda", text: "Delivery and installation in any district, from Kampala to the regions." },
];

const BRANDS = ["Hikvision", "ZKTeco", "Motorola", "Garrett", "Baofeng"];

export function AboutPage() {
  const { business } = useShop();
  return (
    <>
      <PageHero crumbs={[{ label: "About us" }]} title={"About " + business.name} intro="A Kampala security company that supplies, installs and supports security equipment for homes, businesses and organisations across Uganda.">
        <HeroButton to="/products">Browse products</HeroButton>
        <HeroButton to="/contact" ghost>Contact us</HeroButton>
      </PageHero>

      <section className={wrap + " grid gap-10 py-16 lg:grid-cols-2"}>
        <SectionTitle kicker="Who we are" title="One team for the whole system" />
        <div className="space-y-4 text-[16px] leading-relaxed text-ink-soft">
          <p>We help people protect what matters: their families, homes, shops, schools and workplaces. We supply the equipment, install it ourselves and stay available when you need help.</p>
          <p>From a single camera at the gate to a full system for a school, hotel or estate, we plan it with you, quote it in writing and hand it over working.</p>
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className={wrap}>
          <SectionTitle kicker="What we do" title="Our product ranges" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {CATEGORIES.map(({ slug, name, icon: Icon }) => (
              <Link key={slug} to={"/products/" + slug} className="group flex items-center gap-3 rounded-2xl bg-white p-4 transition hover:shadow-[0_10px_30px_rgba(11,38,59,0.08)] sm:p-5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><Icon className="h-5 w-5" /></span>
                <span className="text-[14.5px] font-semibold leading-snug">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={wrap + " py-16"}>
        <SectionTitle kicker="How we work" title="What you can expect from us" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-line p-6">
              <Icon className="h-7 w-7 text-brand" />
              <h3 className="mt-4 text-[17px] font-bold">{title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className={wrap + " flex flex-col items-center gap-6 text-center"}>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-brand">Brands we supply and install</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
            {BRANDS.map(b => <li key={b} className="text-[22px] font-extrabold tracking-tight text-white/40">{b}</li>)}
          </ul>
          <Link to="/become-a-distributor" className="mt-4 inline-flex items-center gap-2 font-semibold text-brand hover:gap-3 transition-all">Become a distributor <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  const { business } = useShop();
  const sections: { title: string; body: string[] }[] = [
    { title: "What we collect", body: ["When you order, request a survey, apply as a distributor or send a message, we collect the details you type: your name, phone number, email if given, location and what you need.", "We don't use advertising trackers on this website. Your cart is kept only in your own browser."] },
    { title: "Why we use it", body: ["To reply to you, confirm and deliver orders, plan installations, and give support after the sale. We don't sell or share your details for marketing."] },
    { title: "Who can see it", body: ["Only our staff who handle orders and requests. Payment providers or delivery partners see only what they need to complete your order."] },
    { title: "How long we keep it", body: ["Order and installation records are kept for as long as we need them for warranty, support and the law. Messages that don't lead to an order are deleted when no longer needed."] },
    { title: "Your rights", body: ["Under Uganda's Data Protection and Privacy Act, 2019, you can ask to see the details we hold about you, correct them, or ask us to delete them where the law allows."] },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: "Privacy notice" }]} title="Privacy notice" intro={"How " + business.name + " uses the details you give us on this website."} />
      <section className={wrap + " max-w-3xl py-16"}>
        <div className="space-y-10">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="text-[22px] font-bold">{s.title}</h2>
              <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-ink-soft">{s.body.map(p => <p key={p}>{p}</p>)}</div>
            </div>
          ))}
          <div className="rounded-2xl bg-paper p-6 text-[15px]">
            <h2 className="text-[18px] font-bold">Contact about your details</h2>
            <p className="mt-2 text-ink-soft">Email <a href={"mailto:" + business.email} className="font-semibold text-brand-dark">{business.email}</a> or call {business.phones[0]}.</p>
          </div>
        </div>
      </section>
    </>
  );
}
