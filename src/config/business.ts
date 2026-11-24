import type { BusinessDetails } from "../lib/types.ts";

// Shown for the first moment while the POS answers, or if it can't be reached,
// so customers always see a way to call or WhatsApp the shop.
// The live values come from POS Settings (GET /api/public/business); change them there.
export const FALLBACK_BUSINESS: BusinessDetails = {
  name: "MS Security Systems Ltd",
  phones: ["+256 759 985 611", "+256 792 977 212", "+256 740 853 303"],
  whatsapp: "256759985611",
  email: "msh0mesecuritysolutionsug01@gmail.com",
  address: "TEC Plaza, Level 4, Shop L4-21, Kampala",
  hours: "Monday to Saturday, 8am to 6pm",
  momo: [{ network: "Airtel Money", number: "+256 759 985 611", name: "Matovu Hussein" }],
  installationTerms: "Installation jobs need a 70% deposit, with the 30% balance paid on handover.",
  warranty: "6 months",
};
