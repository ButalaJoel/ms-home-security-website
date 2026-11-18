import { Link } from "react-router-dom";
import {
  ArrowRight, BadgeCheck, Cctv, ClipboardCheck, Clock, DoorOpen, Eye, Fingerprint, HeartHandshake, LockKeyhole,
  MapPin, Radio, ScanLine, Siren, Target, TrafficCone, Truck, Wrench,
} from "lucide-react";
import { HeroButton, PageHero, SectionTitle, wrap } from "../components/common/PageParts.tsx";
import { useShop } from "../context/ShopContext.tsx";

// Company profile, kept short on purpose: one line per idea, details live on the product pages.
const SERVICES = [
  { icon: Cctv, name: "CCTV surveillance", to: "/products/cctv-cameras" },
  { icon: Fingerprint, name: "Access control", to: "/products/access-control" },
  { icon: LockKeyhole, name: "Smart locks", to: "/products/smart-locks" },
  { icon: DoorOpen, name: "Automatic gate systems", to: "/installation" },
  { icon: Siren, name: "Intruder alarm systems", to: "/products/alarms-sensors" },
  { icon: ScanLine, name: "Security screening equipment", to: "/products/metal-detectors" },
  { icon: Radio, name: "Communication equipment", to: "/products/walkie-talkies" },
  { icon: Clock, name: "Time attendance", to: "/products/access-control" },
  { icon: TrafficCone, name: "Traffic and parking", to: "/products/parking-traffic" },
];

const CORE_VALUES = ["Integrity", "Quality", "Professionalism", "Innovation", "Customer satisfaction", "Reliability", "Continuous growth"];

const BRANDS = ["Hikvision", "ZKTeco", "Motorola", "Garrett", "Baofeng"];

export function AboutPage() {
  const { business } = useShop();
  const why = [
    { icon: BadgeCheck, title: "Trusted brands", text: "Hikvision, ZKTeco, Garrett, Motorola and more, the equipment we would fit in our own homes." },
    { icon: Wrench, title: "Our own installers", text: "Neat work, tested before handover, and explained to you in plain words." },
    { icon: ClipboardCheck, title: "Clear written quotes", text: "We survey the site and put every item and cost in writing before work starts." },
    { icon: HeartHandshake, title: "Support after the sale", text: "Warranty on every installation" + (business.warranty ? " (" + business.warranty + ")" : "") + ", plus help and upgrades when you need them." },
    { icon: Truck, title: "Anywhere in Uganda", text: "Delivery and installation in any district, from Kampala to the regions." },
    { icon: MapPin, title: "A shop you can visit", text: "See and test equipment at our shop" + (business.address ? " in " + business.address.replace(/,?\s*Uganda$/i, "") : "") + " before you buy." },
  ];

  return (
    <>
      <PageHero crumbs={[{ label: "About us" }]} metaTitle="About us" title={"About " + business.name} intro="Your Security, Our Priority. We supply, install and support security systems for homes, businesses and organisations across Uganda.">
        <HeroButton to="/products">Browse products</HeroButton>
        <HeroButton to="/contact" ghost>Contact us</HeroButton>
      </PageHero>

      {/* Who we are */}
      <section className={wrap + " grid gap-10 py-16 lg:grid-cols-2"}>
        <SectionTitle kicker="Who we are" title="One team for the whole system" />
        <div className="space-y-4 text-[16px] leading-relaxed text-ink-soft">
          <p>We help people protect what matters: their families, homes, shops, schools and workplaces. We supply the equipment, install it ourselves and stay available when you need help.</p>
          <p>From a single camera at the gate to a full system for a school, hotel or estate, we plan it with you, quote it in writing and hand it over working.</p>
        </div>
      </section>

      {/* Why choose us */}
      <section className="bg-paper py-16">
        <div className={wrap}>
          <SectionTitle kicker="Why choose us" title={"Why choose " + business.name} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {why.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-white p-6">
                <Icon className="h-7 w-7 text-brand" />
                <h3 className="mt-4 text-[17px] font-bold">{title}</h3>
                <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="py-16">
        <div className={wrap}>
          <SectionTitle kicker="What we do" title="Security systems we supply and install" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, name, to }) => (
              <Link key={name} to={to} className="group flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-line transition hover:shadow-[0_10px_30px_rgba(11,38,59,0.08)] sm:p-5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-dark"><Icon className="h-5 w-5" /></span>
                <span className="text-[14.5px] font-semibold leading-snug">{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, vision and values */}
      <section className={wrap + " py-16"}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line p-7">
            <Target className="h-7 w-7 text-brand" />
            <h2 className="mt-4 text-[20px] font-bold">Our mission</h2>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">To keep homes, businesses and institutions in Uganda safe with reliable security equipment, installed properly and supported after the sale.</p>
          </div>
          <div className="rounded-2xl border border-line p-7">
            <Eye className="h-7 w-7 text-brand" />
            <h2 className="mt-4 text-[20px] font-bold">Our vision</h2>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-soft">To be the security partner people across Uganda trust first, for every camera, door, gate and guard post.</p>
          </div>
        </div>
        <div className="mt-8 rounded-2xl bg-paper p-6 sm:p-7">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-brand-dark">Our core values</p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {CORE_VALUES.map(v => <li key={v} className="rounded-full bg-white px-4 py-2 text-[14.5px] font-semibold ring-1 ring-line">{v}</li>)}
          </ul>
        </div>
      </section>

      {/* Commitment and promise */}
      <section className="bg-ink py-16 text-white">
        <div className={wrap + " flex flex-col items-center gap-5 text-center"}>
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-brand">Our promise</p>
          <h2 className="max-w-3xl text-[30px] font-extrabold leading-tight sm:text-[40px]">Protecting What Matters. Securing Your Future.</h2>
          <p className="max-w-2xl text-[16px] leading-relaxed text-white/70">We are committed to honest advice, quality equipment and work done right the first time, and to being there long after the installation.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link to="/installation#request" className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-brand-dark">Request a site survey <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white transition hover:border-white hover:bg-white/10">Talk to us</Link>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 border-t border-white/10 pt-8">
            {BRANDS.map(b => <li key={b} className="text-[20px] font-extrabold tracking-tight text-white/35">{b}</li>)}
          </ul>
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
