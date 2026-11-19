import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, ShieldCheck, Truck } from "lucide-react";

// Product slider in the style of the Peacock site's hero: words on the left, a real product
// from our catalogue on the right, and prev / dots / next underneath. One slide per category,
// 4 seconds each. Photos are our own product photos (Cloudinary from the POS, or /public).
// To change a slide's product, paste its photo link from the POS into `photo`.

interface Slide { kicker: string; title: string; text: string; to: string; cta: string; photo: string; product: string }

const C = "https://res.cloudinary.com/kwgvxjnb/image/upload/";

const SLIDES: Slide[] = [
  { kicker: "CCTV cameras", title: "Watch every floor, from your phone.", text: "Hikvision cameras for homes, shops and storeyed buildings, with recording and phone viewing set up before we leave.", to: "/products/cctv-cameras", cta: "Shop CCTV cameras", photo: C + "v1794754368/ms-home-security-pos/products/hvljx3rj4prcyqzalhw4.jpg", product: "Hikvision 12MP AcuSense Bullet Camera" },
  { kicker: "Access control & attendance", title: "Only the right people get in.", text: "Fingerprint, card and face terminals from ZKTeco for doors and staff time, with reports your HR can use.", to: "/products/access-control", cta: "Access control", photo: C + "v1794757708/ms-home-security-pos/products/dspgrzddday3vrwulu7m.png", product: "ZKTeco F22 Biometric Access Control" },
  { kicker: "Smart locks", title: "No more lost keys.", text: "Keyless locks for homes, hotels and aluminium doors. Open with a fingerprint, a code, a card or your phone.", to: "/products/smart-locks", cta: "Smart locks", photo: C + "v1794779615/ms-home-security-pos/products/ovonkndgszgqazzxhooq.png", product: "Home Smart Lock" },
  { kicker: "Metal & gold detectors", title: "From security checks to gold.", text: "Garrett walk-through gates and wands for entrances, and Minelab, Fisher and Gold Hunter detectors for prospecting.", to: "/products/metal-detectors", cta: "Metal detectors", photo: "/product-photos/minelab-gpx-6000.jpg", product: "Minelab GPX 6000 Gold Detector" },
  { kicker: "Walkie-talkies & radios", title: "Keep your team talking.", text: "Motorola and Baofeng radios for guards, building sites and events, programmed and ready to use.", to: "/products/walkie-talkies", cta: "Walkie-talkies", photo: C + "v1794757715/ms-home-security-pos/products/emp1shci5hgehp02rn31.jpg", product: "Motorola XiR P8600i Walkie-Talkie" },
  { kicker: "Alarms & sensors", title: "Know the moment someone breaks in.", text: "Intruder alarms and beam sensors for doors, walls and perimeters, loud on site and on your phone.", to: "/products/alarms-sensors", cta: "Alarms & sensors", photo: C + "v1794774258/ms-home-security-pos/products/wmsftlmuzdqrbz3nqx98.jpg", product: "Hikvision AX PRO Alarm Kit" },
  { kicker: "Parking, traffic & queues", title: "Move every car in order.", text: "Boom barriers, turnstiles, parking and queue systems for estates, hospitals and offices.", to: "/products/parking-traffic", cta: "Parking & traffic", photo: C + "v1794779621/ms-home-security-pos/products/bgfw78kic2jxieon82dp.jpg", product: "Boom Barrier" },
  { kicker: "Safety & guard equipment", title: "Equip your guards properly.", text: "Fire extinguishers, batons and everyday gear for guards and premises.", to: "/products/safety-guard", cta: "Safety & guard", photo: C + "v1794854162/ms-home-security-pos/products/ugkvkmzzxmzvcuhl5a9t.jpg", product: "GLORIA 6L Foam Fire Extinguisher" },
  { kicker: "Convex mirrors", title: "See around every corner.", text: "Safety mirrors for blind corners, driveways, shops and parking.", to: "/products/convex-mirrors", cta: "Convex mirrors", photo: C + "v1794854090/ms-home-security-pos/products/oylep29cbpokiif7mmlq.jpg", product: "Convex Mirror 60cm" },
];

const SLIDE_MS = 4000;

/** Cloudinary photos are resized on the fly; local ones are already 1200 px squares. */
const photoUrl = (src: string, w: number) => (src.startsWith(C) ? src.replace("/upload/", `/upload/w_${w},h_${w},c_pad,b_white,f_auto,q_auto/`) : src);

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
          <div className="relative order-1 aspect-[25/18] overflow-hidden rounded-[24px] bg-white ring-1 ring-white/10 lg:order-2 lg:rounded-[32px]">
            {SLIDES.map((s, i) =>
              loaded.has(i) ? (
                <img
                  key={s.photo}
                  src={photoUrl(s.photo, 900)}
                  srcSet={s.photo.startsWith(C) ? `${photoUrl(s.photo, 500)} 500w, ${photoUrl(s.photo, 900)} 900w` : undefined}
                  sizes="(min-width: 1024px) 460px, 70vw"
                  alt={i === index ? s.product : ""}
                  aria-hidden={i !== index}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  decoding="async"
                  className={"absolute inset-0 h-full w-full object-contain p-6 pb-12 text-transparent sm:p-10 sm:pb-14 " + (reducedMotion ? "" : "transition-opacity duration-700 ") + (i === index ? "opacity-100" : "opacity-0")}
                />
              ) : null,
            )}
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 text-[12.5px] font-semibold">
              <span className="shrink-0 rounded-full bg-ink px-3 py-1 text-white">{index + 1} / {SLIDES.length}</span>
              <span className="truncate text-ink-soft">{slide.product}</span>
            </div>
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
