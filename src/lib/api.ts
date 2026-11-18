import type { BusinessDetails, PublicProduct } from "./types.ts";

// Products, prices and business details all come from the POS server's /api/public endpoints.
// In production the calls stay on the website's own address and the host (vercel.json now,
// Render's rewrite rules after the move) passes them to the POS server, so visitors never
// need to reach onrender.com. In development, vite.config.ts does the same.
// VITE_POS_API_URL is only for pointing a local build at another server.
export const API_URL = ((import.meta.env.VITE_POS_API_URL as string | undefined) ?? "").replace(/\/$/, "");

interface ApiEnvelope { success: boolean; message?: string }

async function getJson<T extends ApiEnvelope>(path: string): Promise<T> {
  const res = await fetch(API_URL + path, { headers: { Accept: "application/json" } });
  const body = (await res.json().catch(() => null)) as T | null;
  if (!res.ok || !body || !body.success) {
    throw new Error(body?.message || "The shop could not be reached. Please try again.");
  }
  return body;
}

export async function fetchProducts(): Promise<PublicProduct[]> {
  const body = await getJson<ApiEnvelope & { products: PublicProduct[] }>("/api/public/products");
  return body.products;
}

export async function fetchBusiness(): Promise<BusinessDetails> {
  const body = await getJson<ApiEnvelope & { business: BusinessDetails }>("/api/public/business");
  return body.business;
}
