import { API_URL } from "./api.ts";
import { whatsappLink } from "./format.ts";
import type { CartItem } from "./types.ts";

// Website orders (Payment A): the customer sends the order, staff call to confirm
// price and delivery, then the customer pays by Mobile Money or on delivery.
// POST to the POS. If the POS is an older version without orders (404), it opens in WhatsApp instead.

export interface OrderDetails {
  name: string;
  phone: string;
  email: string;
  delivery: "delivery" | "pickup";
  location: string;
  notes: string;
}

export type PlaceResult = { ok: true; mode: "saved"; reference: string } | { ok: true; mode: "whatsapp"; url: string } | { ok: false; error: string };

export type OrderStatus = "received" | "confirmed" | "paid" | "delivered" | "cancelled";

export interface TrackedOrder {
  reference: string;
  status: OrderStatus;
  delivery: "delivery" | "pickup";
  createdAt: string;
  items: { name: string; quantity: number }[];
  history: { status: OrderStatus; at: string }[];
}

/** What the "Order received" page shows; kept for this browser tab only. */
export interface LastOrder {
  reference: string;
  name: string;
  delivery: "delivery" | "pickup";
  items: { name: string; quantity: number }[];
}

const LAST_ORDER_KEY = "msh-last-order";

export function saveLastOrder(order: LastOrder) {
  try { sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order)); } catch { /* private window: page still shows the number */ }
}

export function readLastOrder(reference: string): LastOrder | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    const order = raw ? (JSON.parse(raw) as LastOrder) : null;
    return order && order.reference === reference ? order : null;
  } catch {
    return null;
  }
}

function orderText(details: OrderDetails, items: CartItem[]): string {
  const lines = items.map(i => `• ${i.qty} × ${i.name}${i.sku ? ` (${i.sku})` : ""}`);
  return [
    "New order from the website",
    "",
    ...lines,
    "",
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    details.email && `Email: ${details.email}`,
    details.delivery === "pickup" ? "Collect from the shop" : `Deliver to: ${details.location}`,
    details.notes && `Notes: ${details.notes}`,
  ].filter(Boolean).join("\n");
}

export async function placeOrder(details: OrderDetails, items: CartItem[], whatsapp: string, honeypot: string): Promise<PlaceResult> {
  try {
    const res = await fetch(API_URL + "/api/public/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        customer: { name: details.name, phone: details.phone, email: details.email, location: details.location },
        delivery: details.delivery,
        notes: details.notes,
        items: items.map(i => ({ productId: i.productId, quantity: i.qty })),
        website: honeypot,
      }),
    });
    // POS not updated yet: send the same order by WhatsApp so nothing is lost.
    if (res.status === 404) return { ok: true, mode: "whatsapp", url: whatsappLink(whatsapp, orderText(details, items)) };
    const body = (await res.json().catch(() => null)) as { success?: boolean; message?: string; reference?: string } | null;
    if (!res.ok || !body?.success || !body.reference) return { ok: false, error: body?.message || "We couldn't send your order. Please try again or WhatsApp us." };
    return { ok: true, mode: "saved", reference: body.reference };
  } catch {
    return { ok: false, error: "No connection. Check your internet and try again, or WhatsApp us your order." };
  }
}

export type TrackResult = { ok: true; order: TrackedOrder } | { ok: false; error: string; notLive?: boolean };

export async function trackOrder(reference: string, phone: string): Promise<TrackResult> {
  try {
    const query = new URLSearchParams({ reference: reference.trim().toUpperCase(), phone: phone.trim() });
    const res = await fetch(API_URL + "/api/public/orders/track?" + query.toString(), { headers: { Accept: "application/json" } });
    const body = (await res.json().catch(() => null)) as { success?: boolean; message?: string; order?: TrackedOrder } | null;
    if (res.status === 404 && !body?.message) return { ok: false, notLive: true, error: "Online tracking is coming soon. WhatsApp us your order number and we'll update you." };
    if (!res.ok || !body?.success || !body.order) return { ok: false, error: body?.message || "We couldn't look up that order. Please try again." };
    return { ok: true, order: body.order };
  } catch {
    return { ok: false, error: "No connection. Check your internet and try again." };
  }
}

export const STATUS_STEPS: { status: Exclude<OrderStatus, "cancelled">; label: string; text: string }[] = [
  { status: "received", label: "Received", text: "We have your order and will call to confirm it." },
  { status: "confirmed", label: "Confirmed", text: "We've agreed the items, price and delivery with you." },
  { status: "paid", label: "Paid", text: "Payment received by Mobile Money, bank or cash." },
  { status: "delivered", label: "Delivered", text: "Your order has been delivered or collected." },
];
