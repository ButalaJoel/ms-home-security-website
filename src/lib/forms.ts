import { usingSampleData } from "./api.ts";
import { whatsappLink } from "./format.ts";

// Every website form (installation, business quote, distributor, contact, feedback) goes through here.
// Live: POST to the POS server, which saves it in the POS "Website inbox".
// Preview (no POS address yet): the same details open in WhatsApp, so nothing is lost.

export type RequestKind = "installation" | "business" | "distributor" | "contact" | "feedback";

export const KIND_LABEL: Record<RequestKind, string> = {
  installation: "Installation / site survey request",
  business: "Business quote request",
  distributor: "Distributor application",
  contact: "Message",
  feedback: "Feedback",
};

export type SubmitResult = { ok: true; mode: "saved"; reference?: string } | { ok: true; mode: "whatsapp"; url: string } | { ok: false; error: string };

const API_URL = (import.meta.env.VITE_POS_API_URL as string | undefined)?.replace(/\/$/, "") ?? "";

export async function submitRequest(kind: RequestKind, fields: Record<string, string>, labels: Record<string, string>, whatsapp: string): Promise<SubmitResult> {
  if (usingSampleData) {
    const lines = Object.entries(fields).filter(([, v]) => v.trim()).map(([k, v]) => `${labels[k] ?? k}: ${v.trim()}`);
    return { ok: true, mode: "whatsapp", url: whatsappLink(whatsapp, `${KIND_LABEL[kind]}\n\n${lines.join("\n")}`) };
  }
  try {
    const res = await fetch(API_URL + "/api/public/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ kind, fields }),
    });
    const body = (await res.json().catch(() => null)) as { success?: boolean; message?: string; reference?: string } | null;
    if (!res.ok || !body?.success) return { ok: false, error: body?.message || "We couldn't send that. Please try again or WhatsApp us." };
    return { ok: true, mode: "saved", reference: body.reference };
  } catch {
    return { ok: false, error: "No connection. Please check your internet and try again, or WhatsApp us." };
  }
}

/** Ugandan phone numbers: 07XX XXX XXX or +256 7XX XXX XXX. */
export const isUgPhone = (v: string) => /^(\+?256|0)\s*[37]\d{2}\s*\d{3}\s*\d{3}$/.test(v.replace(/[-.]/g, " ").trim());
