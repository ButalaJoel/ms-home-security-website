// Shapes shared with the POS server's public API (server/src/features/public.ts).
// The server only sends safe fields: never cost price, exact quantities or staff data.

/** Stock is sent as a label, not a count. "available_to_order" covers zero stock. */
export type StockStatus = "in_stock" | "low_stock" | "available_to_order";

export interface PublicProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  /** Selling price in UGX. 0 means "Price on request". */
  price: number;
  imageUrl: string;
  stock: StockStatus;
  description?: string;
  featured?: boolean;
  /** Maker's model number, e.g. DS-2CD2143G2-IU. */
  model?: string;
  /** Kind of product inside the category, e.g. "Network cameras", "NVRs". */
  subcategory?: string;
  /** Maker's product line, e.g. "Pro Series". */
  series?: string;
  /** Extra photos after imageUrl. */
  images?: string[];
  /** Short selling points shown as bullets. */
  features?: string[];
  /** Technical details shown as a table. */
  specs?: { label: string; value: string }[];
}

export interface BusinessDetails {
  name: string;
  phones: string[];
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  momo: { network: string; number: string; name: string }[];
  installationTerms: string;
  warranty: string;
}

export interface CartItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  imageUrl: string;
  category: string;
  qty: number;
}
