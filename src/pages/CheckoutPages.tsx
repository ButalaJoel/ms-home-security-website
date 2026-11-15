import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Copy, MapPin, PackageSearch, ShoppingCart, Store, Truck } from "lucide-react";
import { EmptyState, PageHero, wrap } from "../components/common/PageParts.tsx";
import WhatsAppIcon from "../components/common/WhatsAppIcon.tsx";
import { ProductImage } from "../components/product/ProductBits.tsx";
import { useCart } from "../context/CartContext.tsx";
import { useShop } from "../context/ShopContext.tsx";
import { isUgPhone } from "../lib/forms.ts";
import { telLink, whatsappLink } from "../lib/format.ts";
import { placeOrder, readLastOrder, saveLastOrder, type OrderDetails } from "../lib/orders.ts";

const input = "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none transition placeholder:text-ink-soft/50 focus:border-brand focus:ring-2 focus:ring-brand/20";
const label = "mb-1.5 block text-[14px] font-semibold";

// Payment A: no payment on the website. The customer sends the order, we call to confirm.
export function CheckoutPage() {
  const { items, setQty, remove, clear } = useCart();
  const { business } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState<OrderDetails>({ name: "", phone: "", email: "", delivery: "delivery", location: "", notes: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof OrderDetails, string>>>({});
  const [state, setState] = useState<{ status: "idle" | "sending" | "error" | "whatsapp"; message?: string; url?: string }>({ status: "idle" });
  const [honey, setHoney] = useState("");

  const set = <K extends keyof OrderDetails>(key: K, value: OrderDetails[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (form.name.trim().length < 2) e.name = "Please enter your name.";
    if (!isUgPhone(form.phone)) e.phone = "Use a Ugandan number, e.g. 0772 123 456.";
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "That email doesn't look right.";
    if (form.delivery === "delivery" && form.location.trim().length < 2) e.location = "Tell us the town or area to deliver to.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setState({ status: "sending" });
    const details = { ...form, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), location: form.location.trim(), notes: form.notes.trim() };
    const res = await placeOrder(details, items, business.whatsapp, honey);
    if (!res.ok) return setState({ status: "error", message: res.error });
    if (res.mode === "whatsapp") {
      setState({ status: "whatsapp", url: res.url });
      window.open(res.url, "_blank", "noopener");
      return;
    }
    saveLastOrder({ reference: res.reference, name: details.name, delivery: details.delivery, items: items.map(i => ({ name: i.name, quantity: i.qty })) });
    clear();
    navigate("/order/" + encodeURIComponent(res.reference), { replace: true });
  };

  if (state.status === "whatsapp") {
    return (
      <>
        <PageHero crumbs={[{ label: "Cart" }, { label: "Checkout" }]} title="Almost done" />
        <section className={wrap + " py-16"}>
          <div className="mx-auto max-w-lg rounded-2xl bg-paper p-8 text-center" role="status">
            <WhatsAppIcon className="mx-auto h-10 w-10 text-[#25D366]" />
            <h2 className="mt-3 text-[20px] font-bold">Press send in WhatsApp</h2>
            <p className="mt-1.5 text-ink-soft">We've written your order into a WhatsApp message to our team. Send it and we'll call you to confirm.</p>
            <a href={state.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#1ebe5b]"><WhatsAppIcon className="h-5 w-5" /> Open WhatsApp again</a>
          </div>
        </section>
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <PageHero crumbs={[{ label: "Checkout" }]} title="Checkout" />
        <section className={wrap + " py-16"}>
          <EmptyState icon={ShoppingCart} title="Your cart is empty" text="Add the products you need, then come back here to send your order." action={{ label: "Shop products", to: "/products" }} />
        </section>
      </>
    );
  }

  const fieldError = (key: keyof OrderDetails) => errors[key] && <p id={"co-" + key + "-err"} className="mt-1.5 text-[13px] text-red-600">{errors[key]}</p>;
  const aria = (key: keyof OrderDetails) => ({ "aria-invalid": !!errors[key], "aria-describedby": errors[key] ? "co-" + key + "-err" : undefined });

  return (
    <>
      <PageHero crumbs={[{ label: "Cart" }, { label: "Checkout" }]} title="Send your order" intro="No payment now. We call you to confirm the price and delivery, then you pay by Mobile Money or on delivery." />
      <section className={wrap + " grid items-start gap-8 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16"}>
        <form onSubmit={onSubmit} noValidate className="space-y-6 rounded-2xl border border-line p-5 sm:p-8">
          <input type="text" tabIndex={-1} autoComplete="off" value={honey} onChange={e => setHoney(e.target.value)} className="hidden" aria-hidden="true" />

          <div>
            <h2 className="text-[19px] font-bold">Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="co-name" className={label}>Full name <span className="text-red-600">*</span></label>
                <input id="co-name" autoComplete="name" value={form.name} onChange={e => set("name", e.target.value)} className={input} {...aria("name")} />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor="co-phone" className={label}>Phone number <span className="text-red-600">*</span></label>
                <input id="co-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0772 123 456" value={form.phone} onChange={e => set("phone", e.target.value)} className={input} {...aria("phone")} />
                {fieldError("phone")}
              </div>
              <div>
                <label htmlFor="co-email" className={label}>Email <span className="font-normal text-ink-soft">(optional)</span></label>
                <input id="co-email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={e => set("email", e.target.value)} className={input} {...aria("email")} />
                {fieldError("email")}
              </div>
            </div>
          </div>

          <fieldset>
            <legend className="text-[19px] font-bold">Delivery</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {([["delivery", Truck, "Deliver to me", "Anywhere in Uganda. We'll confirm the cost when we call."], ["pickup", Store, "I'll collect", business.address]] as const).map(([value, Icon, title, text]) => (
                <label key={value} className={"flex cursor-pointer gap-3 rounded-xl border p-4 transition " + (form.delivery === value ? "border-brand bg-brand-soft ring-1 ring-brand" : "border-line hover:border-ink-soft")}>
                  <input type="radio" name="delivery" value={value} checked={form.delivery === value} onChange={() => set("delivery", value)} className="sr-only" />
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark" />
                  <span><span className="block text-[15px] font-semibold">{title}</span><span className="mt-0.5 block text-[13.5px] text-ink-soft">{text}</span></span>
                </label>
              ))}
            </div>
            {form.delivery === "delivery" && (
              <div className="mt-4">
                <label htmlFor="co-location" className={label}>Town or area <span className="text-red-600">*</span></label>
                <input id="co-location" autoComplete="address-level2" placeholder="e.g. Ntinda, Kampala" value={form.location} onChange={e => set("location", e.target.value)} className={input} {...aria("location")} />
                {fieldError("location")}
              </div>
            )}
          </fieldset>

          <div>
            <label htmlFor="co-notes" className={label}>Anything we should know? <span className="font-normal text-ink-soft">(optional)</span></label>
            <textarea id="co-notes" rows={3} placeholder="For example: you also need installation, or the best time to call." value={form.notes} onChange={e => set("notes", e.target.value)} className={input + " resize-y"} />
          </div>

          {state.status === "error" && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700">{state.message}</p>}

          <div>
            <button type="submit" disabled={state.status === "sending"} className="w-full rounded-full bg-brand py-4 text-[16px] font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60 sm:w-auto sm:px-10">
              {state.status === "sending" ? "Sending…" : "Send order"}
            </button>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
              We use your details only to handle this order. See our <Link to="/privacy" className="font-semibold text-brand-dark hover:underline">privacy notice</Link>.
            </p>
          </div>
        </form>

        <aside className="rounded-2xl bg-paper p-5 sm:p-7 lg:sticky lg:top-24">
          <h2 className="text-[19px] font-bold">Your order</h2>
          <ul className="mt-4 divide-y divide-line">
            {items.map(item => (
              <li key={item.productId} className="flex gap-3 py-3">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white"><ProductImage src={item.imageUrl} category={item.category} name={item.name} className="p-1.5" /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-semibold leading-snug">{item.name}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="sr-only" htmlFor={"qty-" + item.productId}>Quantity</label>
                    <input id={"qty-" + item.productId} type="number" min={1} max={999} value={item.qty} onChange={e => setQty(item.productId, Number(e.target.value))} className="w-20 rounded-lg border border-line bg-white px-3 py-1.5 text-[14px]" />
                    <button type="button" onClick={() => remove(item.productId)} className="text-[13px] font-semibold text-ink-soft hover:text-red-600">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-4 text-[13.5px] leading-relaxed text-ink-soft">
            Prices are given on request. We'll call you with the total, including delivery or installation if you need it.
          </p>
        </aside>
      </section>
    </>
  );
}

export function OrderReceivedPage() {
  const { reference = "" } = useParams();
  const { business } = useShop();
  const order = readLastOrder(reference);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(reference); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* the number is on screen anyway */ }
  };

  return (
    <>
      <PageHero crumbs={[{ label: "Order received" }]} title="Thank you, we've got your order" intro={order ? `We'll call ${order.name.split(" ")[0]} shortly to confirm everything.` : "We'll call you shortly to confirm everything."} />
      <section className={wrap + " grid items-start gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16"}>
        <div className="space-y-6">
          <div className="rounded-2xl border border-line p-6 sm:p-8">
            <CheckCircle2 className="h-9 w-9 text-ok" />
            <p className="mt-4 text-[14px] font-semibold uppercase tracking-wider text-ink-soft">Your order number</p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="font-mono text-[26px] font-bold sm:text-[30px]">{reference}</p>
              <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[13px] font-semibold hover:border-ink"><Copy className="h-3.5 w-3.5" />{copied ? "Copied" : "Copy"}</button>
            </div>
            <p className="mt-2 text-[14.5px] text-ink-soft">Keep this number. You'll need it with your phone number to track the order.</p>
          </div>

          <div className="rounded-2xl bg-paper p-6 sm:p-8">
            <h2 className="text-[19px] font-bold">What happens next</h2>
            <ol className="mt-4 space-y-4 text-[14.5px]">
              {[
                ["We call you", "During opening hours we call to confirm the items, the price and " + (order?.delivery === "pickup" ? "when to collect." : "delivery.")],
                ["You pay", "By Mobile Money once we've confirmed, or cash on delivery."],
                [order?.delivery === "pickup" ? "You collect" : "We deliver", order?.delivery === "pickup" ? "Pick up your order at " + business.address + "." : "Anywhere in Uganda. We can install it too."],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold text-white">{i + 1}</span>
                  <span><span className="block font-semibold">{title}</span><span className="text-ink-soft">{text}</span></span>
                </li>
              ))}
            </ol>
            {business.momo.length > 0 && (
              <div className="mt-6 rounded-xl bg-white p-4 text-[14px]">
                <p className="font-semibold">Mobile Money</p>
                <p className="mt-0.5 text-ink-soft">Please pay only after we've confirmed your order and the total by phone.</p>
                <ul className="mt-2 space-y-1">
                  {business.momo.map(m => <li key={m.network}><span className="font-semibold">{m.network}:</span> {m.number}{m.name && <> ({m.name})</>}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          {order && (
            <div className="rounded-2xl border border-line p-6">
              <h2 className="text-[17px] font-bold">Items ordered</h2>
              <ul className="mt-3 space-y-2 text-[14.5px]">
                {order.items.map(i => <li key={i.name} className="flex justify-between gap-4"><span>{i.name}</span><span className="shrink-0 text-ink-soft">× {i.quantity}</span></li>)}
              </ul>
            </div>
          )}
          <div className="rounded-2xl border border-line p-6">
            <h2 className="text-[17px] font-bold">Need us sooner?</h2>
            <div className="mt-4 flex flex-col gap-2.5">
              {business.whatsapp && (
                <a href={whatsappLink(business.whatsapp, `Hello, I just placed order ${reference} on your website.`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white hover:bg-[#1ebe5b]">
                  <WhatsAppIcon className="h-5 w-5" /> WhatsApp your order number
                </a>
              )}
              {business.phones[0] && <a href={telLink(business.phones[0])} className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-5 py-3 font-semibold hover:border-ink">Call {business.phones[0]}</a>}
              <Link to={"/track-order?ref=" + encodeURIComponent(reference)} className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold text-brand-dark hover:underline"><PackageSearch className="h-4 w-4" /> Track this order</Link>
            </div>
          </div>
          <p className="flex items-start gap-2 px-1 text-[13.5px] text-ink-soft"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{business.address}</p>
        </aside>
      </section>
    </>
  );
}
