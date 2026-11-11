import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Cctv, DoorOpen, Fingerprint, LockKeyhole, Radio, ScanLine, ShieldCheck, Siren, TrafficCone, Truck, type LucideIcon } from "lucide-react";

interface Feed { label: string; icon: LucideIcon }
interface Slide { kicker: string; title: string; text: string; cta: { label: string; to: string }; feeds: Feed[] }

// Three slides like the Peacock hero; the right side is a "monitor wall" of camera feeds.
const SLIDES: Slide[] = [
  {
    kicker: "Home security",
    title: "See your home from anywhere, day and night.",
    text: "CCTV, alarms and smart locks supplied and installed by our own team, with phone viewing set up before we leave.",
    cta: { label: "Shop CCTV cameras", to: "/products/cctv-cameras" },
    feeds: [{ label: "Front gate", icon: Cctv }, { label: "Main door", icon: LockKeyhole }, { label: "Compound", icon: Siren }, { label: "Back yard", icon: ShieldCheck }],
  },
  {
    kicker: "Business & offices",
    title: "Control who comes in, and when.",
    text: "Fingerprint and face terminals for doors and staff attendance, from ZKTeco, with reports your HR can use.",
    cta: { label: "Access control", to: "/products/access-control" },
    feeds: [{ label: "Reception", icon: Fingerprint }, { label: "Server room", icon: DoorOpen }, { label: "Shop floor", icon: Cctv }, { label: "Stores", icon: LockKeyhole }],
  },
  {
    kicker: "Events, estates & parking",
    title: "Screen every entrance. Move every car.",
    text: "Walk-through metal detectors, radios for your guards, boom barriers and full parking systems.",
    cta: { label: "Parking & traffic", to: "/products/parking-traffic" },
    feeds: [{ label: "Entrance A", icon: ScanLine }, { label: "Parking", icon: TrafficCone }, { label: "Guard post", icon: Radio }, { label: "Exit gate", icon: Cctv }],
  },
];

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(t); }, []);
  return now.toLocaleTimeString("en-GB", { timeZone: "Africa/Kampala", hour12: false });
}

function MonitorWall({ feeds }: { feeds: Feed[] }) {
  const time = useClock();
  return (
    <div className="grid grid-cols-2 gap-2.5 rounded-[28px] bg-ink-soft/60 p-2.5 ring-1 ring-white/10" aria-hidden="true">
      {feeds.map(({ label, icon: Icon }, i) => (
        <div key={label} className="scanline relative aspect-[4/3] overflow-hidden rounded-[20px] bg-gradient-to-br from-[#123650] to-[#0a2234]">
          <Icon className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 text-brand/40" strokeWidth={1} />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-3 py-2 font-mono text-[10.5px] text-white/70">
            <span>CAM {String(i + 1).padStart(2, "0")}</span>
            {i === 0 && <span className="flex items-center gap-1 text-red-400"><span className="rec-dot h-1.5 w-1.5 rounded-full bg-red-500" />REC</span>}
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/50 to-transparent px-3 py-2 font-mono text-[10.5px] text-white/80">
            <span className="truncate">{label}</span><span>{time}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setIndex(i => (i + 1) % SLIDES.length), 7000);
    return () => window.clearInterval(t);
  }, [paused]);
  const slide = SLIDES[index];

  return (
    <section className="relative overflow-hidden bg-night text-white" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -right-48 top-1/2 h-[720px] w-[720px] -translate-y-1/2 rounded-full bg-brand/20 blur-[120px]" />
      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid min-h-[min(640px,calc(100svh-120px))] items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_1fr] lg:px-8 lg:py-20">
          <div key={index} className="anim-rise">
            <p className="mb-5 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
              <span className="h-px w-8 bg-brand" />{slide.kicker}
            </p>
            <h1 className="text-[36px] font-extrabold leading-[1.06] sm:text-5xl lg:text-[60px]">{slide.title}</h1>
            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/70 sm:text-[18px]">{slide.text}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to={slide.cta.to} className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-brand-dark">
                {slide.cta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/installation#request" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white transition hover:border-white hover:bg-white/10">
                Request a site survey
              </Link>
            </div>
          </div>
          <MonitorWall key={"wall" + index} feeds={slide.feeds} />
        </div>
        <div className="relative flex flex-col gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/75">
            <li className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-brand" />6-month installation warranty</li>
            <li className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-brand" />Delivery across Uganda</li>
            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" />Pay by MoMo or on delivery</li>
          </ul>
          <div className="flex gap-2" role="tablist" aria-label="Slides">
            {SLIDES.map((s, i) => (
              <button
                key={s.kicker}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={s.kicker}
                onClick={() => setIndex(i)}
                className={"h-2 rounded-full transition-all " + (i === index ? "w-8 bg-brand" : "w-2 bg-white/30 hover:bg-white/60")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
