import type { BusinessDetails } from "../lib/types.ts";

// SAMPLE DATA ONLY. The live site reads these from POS Settings (GET /api/public/business),
// so staff change phone numbers and MoMo details in the POS, not here.
// The numbers below are placeholders and must not go live.
export const SAMPLE_BUSINESS: BusinessDetails = {
  name: "MS Home Security Solutions",
  phones: ["+256 700 000 000"],
  whatsapp: "256700000000",
  email: "info@mshomesecurity.com",
  address: "Kampala, Uganda",
  hours: "Mon to Sat, 8:00am to 6:00pm",
  momo: [
    { network: "MTN MoMo", number: "0770 000 000", name: "MS Home Security" },
    { network: "Airtel Money", number: "0750 000 000", name: "MS Home Security" },
  ],
  installationTerms: "Installation jobs need a 70% deposit, with the 30% balance paid on handover.",
  warranty: "6 months",
};
