import type { BusinessDetails } from "../lib/types.ts";

// Used only in sample mode. The live site reads these from POS Settings
// (GET /api/public/business), so staff change them in the POS, not here.
// Copied from the POS Settings defaults; WhatsApp assumed to be the first phone.
export const SAMPLE_BUSINESS: BusinessDetails = {
  name: "MS Home Security Solutions",
  phones: ["+256 759 985 611", "+256 792 977 212", "+256 740 853 303"],
  whatsapp: "256759985611",
  email: "msh0mesecuritysolutionsug01@gmail.com",
  address: "TEC Plaza, Kampala",
  hours: "",
  momo: [{ network: "Airtel Money", number: "+256 759 985 611", name: "Matovu Hussein" }],
  installationTerms: "Installation jobs need a 70% deposit, with the 30% balance paid on handover.",
  warranty: "6 months",
};
