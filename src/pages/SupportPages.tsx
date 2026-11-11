import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, MessageCircle, Newspaper, PackageSearch, Phone, Star } from "lucide-react";
import { EmptyState, PageHero, SectionTitle, wrap } from "../components/common/PageParts.tsx";
import RequestForm, { CONTACT_FIELDS } from "../components/common/RequestForm.tsx";
import { useShop } from "../context/ShopContext.tsx";
import { usingSampleData } from "../lib/api.ts";
import { isUgPhone } from "../lib/forms.ts";
import { telLink, whatsappLink } from "../lib/format.ts";

const input = "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function TrackOrderPage() {
  const { business } = useShop();
  const [ref, setRef] = useState("");
  const [phone, setPhone] = useState("");
  const [msg, setMsg] = useState<{ tone: "info" | "error"; text: string } | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^WEB-\d{4}-\d{4,}$/i.test(ref.trim())) return setMsg({ tone: "error", text: "Order numbers look like WEB-2026-0001. You'll find it on your order confirmation." });
    if (!isUgPhone(phone)) return setMsg({ tone: "error", text: "Enter the phone number you used when ordering." });
    // Order tracking reads from the POS once the website is connected to it.
    setMsg({ tone: "info", text: usingSampleData ? "Order tracking switches on when the website is connected to our shop system. For now, WhatsApp us your order number." : "Checking…" });
  };

  return (
    <>
      <PageHero crumbs={[{ label: "Support" }, { label: "Track my order" }]} title="Track your order" intro="Enter your order number and the phone number you used." />
      <section className={wrap + " grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]"}>
        <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-2xl border border-line p-6 sm:p-8">
          <PackageSearch className="h-8 w-8 text-brand" />
          <div>
            <label htmlFor="ref" className="mb-1.5 block text-[14px] font-semibold">Order number</label>
            <input id="ref" value={ref} onChange={e => setRef(e.target.value.toUpperCase())} placeholder="WEB-2026-0001" className={input + " font-mono"} />
          </div>
          <div>
            <label htmlFor="tphone" className="mb-1.5 block text-[14px] font-semibold">Phone number</label>
            <input id="tphone" type="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="0772 123 456" className={input} />
          </div>
          {msg && <p role="status" className={"rounded-xl px-4 py-3 text-[14px] " + (msg.tone === "error" ? "bg-red-50 text-red-700" : "bg-brand-soft text-ink")}>{msg.text}</p>}
          <button type="submit" className="rounded-full bg-brand px-7 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark">Track order</button>
        </form>
        <div className="rounded-2xl bg-paper p-6 sm:p-8">
          <h2 className="text-[19px] font-bold">What the statuses mean</h2>
          <dl className="mt-4 space-y-3 text-[14.5px]">
            {[["Received", "We have your order and will call to confirm it."], ["Confirmed", "We've agreed the items, price and delivery with you."], ["Paid", "Payment received by MoMo, bank or cash."], ["Delivered", "Your order has been delivered or collected."]].map(([t, d]) => (
              <div key={t}><dt className="font-semibold">{t}</dt><dd className="text-ink-soft">{d}</dd></div>
            ))}
          </dl>
          {business.whatsapp && (
            <a href={whatsappLink(business.whatsapp, "Hello, I'd like to check my order: ")} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-dark hover:underline"><MessageCircle className="h-4 w-4" /> Ask on WhatsApp instead</a>
          )}
        </div>
      </section>
    </>
  );
}

// Posts are written by staff in the POS (Website content); empty until the first post.
export function NewsPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Support" }, { label: "News & tips" }]} title="News & tips" intro="New products, offers and practical security advice from our team." />
      <section className={wrap + " py-16"}>
        <EmptyState icon={Newspaper} title="First posts coming soon" text="We'll share new arrivals, offers and tips here. Meanwhile, browse what's in stock." action={{ label: "Shop products", to: "/products" }} />
      </section>
    </>
  );
}

// Approved feedback is published here from the POS.
export function ReviewsPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Support" }, { label: "Customer reviews" }]} title="What our customers say" intro="Reviews from customers who bought from us or had a system installed." />
      <section className={wrap + " py-16"}>
        <EmptyState icon={Star} title="Be the first to leave a review" text="Bought from us or had an installation done? Tell us how it went." action={{ label: "Give feedback", to: "/feedback" }} />
      </section>
    </>
  );
}

export function FeedbackPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Support" }, { label: "Feedback" }]} title="Tell us how we did" intro="Praise, problems or ideas: everything is read by our team." />
      <section className={wrap + " grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]"}>
        <SectionTitle kicker="Feedback" title="Your feedback helps us improve" text="If something isn't working, include your order number or where we installed, and we'll follow up." />
        <div className="rounded-2xl border border-line p-6 sm:p-8">
          <RequestForm kind="feedback" submitLabel="Send feedback" fields={[
            { name: "rating", label: "How would you rate us?", type: "rating", required: true },
            ...CONTACT_FIELDS.map(f => ({ ...f, required: f.name === "name" })),
            { name: "about", label: "This is about", type: "select", half: true, options: ["A product I bought", "An installation", "Our service", "The website", "Something else"] },
            { name: "reference", label: "Order number (if any)", half: true, placeholder: "WEB-2026-0001" },
            { name: "message", label: "Your feedback", type: "textarea", required: true },
            { name: "publish", label: "You may publish my feedback on the website with my first name", type: "checkbox" },
          ]} />
        </div>
      </section>
    </>
  );
}

export function ContactPage() {
  const { business } = useShop();
  const mapQuery = encodeURIComponent(business.name + ", " + business.address);
  const cards: { icon: typeof Phone; label: string; value: string; href?: string }[] = [
    ...business.phones.map(p => ({ icon: Phone, label: "Call", value: p, href: telLink(p) })),
    ...(business.whatsapp ? [{ icon: MessageCircle, label: "WhatsApp", value: "Chat with us", href: whatsappLink(business.whatsapp, "Hello MS Home Security, ") }] : []),
    ...(business.email ? [{ icon: Mail, label: "Email", value: business.email, href: "mailto:" + business.email }] : []),
    { icon: MapPin, label: "Visit", value: business.address, href: "#map" },
    { icon: Clock, label: "Opening hours", value: business.hours },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: "Contact us" }]} title="Contact us" intro="Call, WhatsApp, email or visit the shop. We reply to messages during opening hours." />
      <section className={wrap + " py-16"}>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(({ icon: Icon, label, value, href }) => {
            const body = <><Icon className="h-6 w-6 text-brand" /><p className="mt-3 text-[13px] font-semibold uppercase tracking-wider text-ink-soft">{label}</p><p className="mt-1 text-[14.5px] font-semibold [overflow-wrap:anywhere]">{value}</p></>;
            return href
              ? <a key={label + value} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="rounded-2xl border border-line p-5 transition hover:border-brand">{body}</a>
              : <div key={label + value} className="rounded-2xl border border-line p-5">{body}</div>;
          })}
        </div>
      </section>
      <section className="bg-paper py-16">
        <div className={wrap + " grid gap-8 lg:grid-cols-2"}>
          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <h2 className="mb-5 text-[22px] font-bold">Send us a message</h2>
            <RequestForm kind="contact" fields={[
              ...CONTACT_FIELDS,
              { name: "email", label: "Email", type: "email" },
              { name: "message", label: "Message", type: "textarea", required: true },
            ]} />
          </div>
          <div id="map" className="min-h-[360px] scroll-mt-24 overflow-hidden rounded-2xl bg-white">
            <iframe title="Map to MS Home Security" src={"https://www.google.com/maps?q=" + mapQuery + "&output=embed"} className="h-full min-h-[360px] w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </section>
      <section className={wrap + " py-12 text-center text-[15px] text-ink-soft"}>
        Looking for an order? <Link to="/track-order" className="font-semibold text-brand-dark hover:underline">Track it here</Link>.
      </section>
    </>
  );
}
