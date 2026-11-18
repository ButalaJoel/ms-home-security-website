import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, ShieldCheck, Truck } from "lucide-react";

// Photo slider in the style of the Peacock site's hero: words on the left, a photo on the
// right, and prev / dots / next underneath. One slide per product category, 4 seconds each.
// Photos are free-licence Unsplash images served from Unsplash's image server
// (images.unsplash.com is allowed in the CSP in vercel.json). Swap any of them for photos
// of our own installations by changing `photo` to a path in /public, e.g. "/hero/cctv.jpg".

interface Slide { kicker: string; title: string; text: string; to: string; cta: string; photo: string; alt: string }

const SLIDES: Slide[] = [
  { kicker: "CCTV cameras", title: "Watch every floor, from your phone.", text: "Hikvision cameras for homes, shops and storeyed buildings, with recording and phone viewing set up before we leave.", to: "/products/cctv-cameras", cta: "Shop CCTV cameras", photo: "photo-1767059439535-10d3f5e6ad35", alt: "Security camera on a pole in front of an office building" },
  { kicker: "Access control & attendance", title: "Only the right people get in.", text: "Fingerprint, card and face terminals from ZKTeco for doors and staff time, with reports your HR can use.", to: "/products/access-control", cta: "Access control", photo: "photo-1654781393914-108d9a93e0a5", alt: "Hand reaching for an access reader beside a door" },
  { kicker: "Smart locks", title: "No more lost keys.", text: "Keyless locks for homes, hotels and aluminium doors. Open with a fingerprint, a code, a card or your phone.", to: "/products/smart-locks", cta: "Smart locks", photo: "photo-1558002038-1055907df827", alt: "Smart lock on a door opened from a phone" },
  { kicker: "Security screening", title: "Screen every entrance.", text: "Garrett walk-through gates and handheld wands for offices, schools, hotels and events.", to: "/products/metal-detectors", cta: "Metal detectors", photo: "photo-1485230405346-71acb9518d9c", alt: "Security guard at a building entrance with access gates" },
  { kicker: "Walkie-talkies & radios", title: "Keep your team talking.", text: "Motorola and Baofeng radios for guards, building sites and events, programmed and ready to use.", to: "/products/walkie-talkies", cta: "Walkie-talkies", photo: "photo-1583790206831-0e6515d14133", alt: "Two-way radio on a dark background" },
  { kicker: "Alarms & sensors", title: "Know the moment someone breaks in.", text: "Intruder alarms and beam sensors for doors, walls and perimeters, loud on site and on your phone.", to: "/products/alarms-sensors", cta: "Alarms & sensors", photo: "photo-1767741683084-08ac01518c8c", alt: "Red alarm bell on a brick wall" },
  { kicker: "Parking, traffic & queues", title: "Move every car in order.", text: "Boom barriers, turnstiles, parking and queue systems for estates, hospitals and offices.", to: "/products/parking-traffic", cta: "Parking & traffic", photo: "photo-1761707054382-6956707c3747", alt: "Boom barrier at a parking entrance" },
  { kicker: "Safety & guard equipment", title: "Equip your guards properly.", text: "Fire extinguishers, batons and everyday gear for guards and premises.", to: "/products/safety-guard", cta: "Safety & guard", photo: "photo-1652739758426-56a564265f9e", alt: "Security guard in a high-visibility vest" },
  { kicker: "Convex mirrors", title: "See around every corner.", text: "Safety mirrors for blind corners, driveways, shops and parking.", to: "/products/convex-mirrors", cta: "Convex mirrors", photo: "photo-1781177257765-e19b3e7ef1b7", alt: "Round convex road mirror against a blue sky" },
];

const SLIDE_MS = 4000;

const photoUrl = (id: string, w: number) =>
  id.startsWith("/") ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w * 0.72)}&q=70`;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Only load photos for slides that have been shown, plus the next one.
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1]));
  const reducedMotion = usePrefersReducedMotion();
  const touchX = useRef<number | null>(null);

  const go = useCallback((i: number) => setIndex((i + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    setLoaded(prev => (prev.has(index) && prev.has((index + 1) % SLIDES.length) ? prev : new Set([...prev, index, (index + 1) % SLIDES.length])));
  }, [index]);

  useEffect(() => {
    const on = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);

  const playing = !hovered && !focused && !hidden && !reducedMotion;
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(index + 1), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [playing, index, go]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative overflow-hidden bg-night text-white"
      aria-roledescription="carousel"
      aria-label="What we supply and install"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false); }}
      onKeyDown={e => { if (e.key === "ArrowLeft") go(index - 1); if (e.key === "ArrowRight") go(index + 1); }}
      onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="pointer-events-none absolute -right-48 top-1/2 h-[720px] w-[720px] -translate-y-1/2 rounded-full bg-brand/20 blur-[120px]" />
      <div className="relative mx-auto max-w-[1320px]">
        <div className="grid items-center gap-8 px-5 py-10 lg:min-h-[min(600px,calc(100svh-140px))] lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-8 lg:py-16">
          {/* Words */}
          <div key={index} className={"order-2 lg:order-1 " + (reducedMotion ? "" : "anim-rise")} aria-live={playing ? "off" : "polite"}>
            <p className="mb-4 inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand">
              <span className="h-px w-8 bg-brand" />{slide.kicker}
            </p>
            <h1 className="min-h-[2.15em] text-[34px] font-extrabold leading-[1.07] sm:text-5xl lg:min-h-0 lg:text-[56px]">{slide.title}</h1>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/70 sm:min-h-[3.4em] sm:text-[18px]">{slide.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={slide.to} className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-brand-dark">
                {slide.cta} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/installation#request" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-[15px] font-semibold text-white transition hover:border-white hover:bg-white/10">
                Request a site survey
              </Link>
            </div>
          </div>

          {/* Photo */}
          <div className="relative order-1 aspect-[25/18] overflow-hidden rounded-[24px] bg-ink-soft ring-1 ring-white/10 lg:order-2 lg:rounded-[32px]">
            {SLIDES.map((s, i) =>
              loaded.has(i) ? (
                <img
                  key={s.photo}
                  src={photoUrl(s.photo, 1100)}
                  srcSet={s.photo.startsWith("/") ? undefined : `${photoUrl(s.photo, 640)} 640w, ${photoUrl(s.photo, 1100)} 1100w`}
                  sizes="(min-width: 1024px) 640px, 100vw"
                  alt={i === index ? s.alt : ""}
                  aria-hidden={i !== index}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  className={"absolute inset-0 h-full w-full object-cover text-transparent " + (reducedMotion ? "" : "transition-opacity duration-700 ") + (i === index ? "opacity-100" : "opacity-0")}
                />
              ) : null,
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
            <span className="absolute bottom-3 left-4 rounded-full bg-black/45 px-3 py-1 text-[12px] font-semibold backdrop-blur-sm">
              {index + 1} / {SLIDES.length}
            </span>
          </div>
        </div>

        <div className="relative flex flex-col gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:pr-24 lg:pl-8 lg:pr-28">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-white/75">
            <li className="inline-flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-brand" />6-month installation warranty</li>
            <li className="inline-flex items-center gap-2"><Truck className="h-4 w-4 text-brand" />Delivery across Uganda</li>
            <li className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand" />Pay by MoMo or on delivery</li>
          </ul>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:border-white hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5 px-1">
              {SLIDES.map((s, i) => (
                <button
                  key={s.kicker}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Slide ${i + 1}: ${s.kicker}`}
                  aria-current={i === index}
                  className={"relative h-2 overflow-hidden rounded-full transition-all " + (i === index ? "w-9 bg-white/25" : "w-2 bg-white/30 hover:bg-white/60")}
                >
                  {i === index && (
                    <span
                      key={index + (playing ? "-play" : "-pause")}
                      className={"absolute inset-y-0 left-0 rounded-full bg-brand " + (playing ? "hero-progress" : "w-full")}
                      style={playing ? { animationDuration: SLIDE_MS + "ms" } : undefined}
                    />
                  )}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition hover:border-white hover:bg-white/10">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
