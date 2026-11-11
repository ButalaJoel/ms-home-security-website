import type { StockStatus } from "./types.ts";

/** UGX 1,250,000 — the same format the POS prints. 0 means the price is given on request. */
export const formatUGX = (amount: number) =>
  amount > 0 ? "UGX " + Math.round(amount).toLocaleString("en-US") : "Price on request";

export const STOCK_LABEL: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  available_to_order: "Available to order",
};

export const whatsappLink = (number: string, text: string) =>
  "https://wa.me/" + number.replace(/\D/g, "") + "?text=" + encodeURIComponent(text);

export const telLink = (phone: string) => "tel:" + phone.replace(/[^\d+]/g, "");
