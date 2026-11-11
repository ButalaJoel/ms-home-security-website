import type { BusinessDetails, PublicProduct } from "./types.ts";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts.ts";
import { SAMPLE_BUSINESS } from "../data/sampleBusiness.ts";
import { SAMPLE_HIKVISION } from "../data/sampleHikvision.ts";

// Where the data comes from:
// - VITE_DATA_SOURCE=pos  → the POS server's /api/public endpoints.
//   On Vercel the calls stay on the website's own address and vercel.json passes
//   them to the POS server, so visitors never need to reach onrender.com.
//   VITE_POS_API_URL is only for local testing (e.g. http://localhost:5000).
// - anything else         → the built-in sample data in src/data.
export const API_URL = ((import.meta.env.VITE_POS_API_URL as string | undefined) ?? "").replace(/\/$/, "");
export const usingSampleData = import.meta.env.VITE_DATA_SOURCE !== "pos";

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
  if (usingSampleData) return [...SAMPLE_HIKVISION, ...SAMPLE_PRODUCTS];
  const body = await getJson<ApiEnvelope & { products: PublicProduct[] }>("/api/public/products");
  return body.products;
}

export async function fetchBusiness(): Promise<BusinessDetails> {
  if (usingSampleData) return SAMPLE_BUSINESS;
  const body = await getJson<ApiEnvelope & { business: BusinessDetails }>("/api/public/business");
  return body.business;
}
