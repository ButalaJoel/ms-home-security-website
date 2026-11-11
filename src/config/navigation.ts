// Main menu. Each menu opens a full-width panel (hikvision.com style):
// a list on the left, links for the chosen item on the right, an optional feature card,
// and a row of tool links along the bottom. The Products panel lists live products from the POS.
export interface NavLink { label: string; to: string; desc?: string }
export interface NavTab { label: string; links: NavLink[] }
export interface NavFeature { kicker: string; title: string; text: string; cta: string; to: string }
export interface NavMenu {
  id: string;
  label: string;
  /** "products" fills the tabs from the categories and the POS catalogue. */
  kind: "products" | "tabs";
  tabs: NavTab[];
  feature?: NavFeature;
  tools?: NavLink[];
}

export const SOLUTIONS: { slug: string; label: string; desc: string }[] = [
  { slug: "homes", label: "Homes", desc: "Cameras, alarms and smart locks for family homes" },
  { slug: "shops-offices", label: "Shops & Offices", desc: "CCTV, staff attendance and door access" },
  { slug: "schools", label: "Schools", desc: "Gate control, cameras and radios for guards" },
  { slug: "hotels-events", label: "Hotels & Events", desc: "Hotel locks, metal detectors and walk-through gates" },
  { slug: "parking-estates", label: "Parking & Estates", desc: "Boom barriers, turnstiles and parking systems" },
];

export const NAV: NavMenu[] = [
  {
    id: "products", label: "Products", kind: "products", tabs: [],
    tools: [
      { label: "Shop all products", to: "/products" },
      { label: "CCTV planner", to: "/cctv-planner" },
      { label: "Request installation", to: "/installation#request" },
      { label: "Track my order", to: "/track-order" },
    ],
  },
  {
    id: "solutions", label: "Solutions", kind: "tabs",
    tabs: [
      { label: "Solutions by place", links: SOLUTIONS.map(s => ({ label: s.label, to: "/solutions/" + s.slug, desc: s.desc })) },
      { label: "For organisations", links: [
        { label: "For businesses", to: "/for-businesses", desc: "Bulk orders, tenders and company accounts" },
        { label: "Become a distributor", to: "/become-a-distributor", desc: "Resell or install our products in your area" },
      ] },
    ],
    feature: { kicker: "Business quotes", title: "Securing a school, hotel or estate?", text: "Send us the site and we'll plan the full system, with one quotation.", cta: "Get a business quote", to: "/for-businesses" },
  },
  {
    id: "installation", label: "Installation", kind: "tabs",
    tabs: [
      { label: "Installation", links: [
        { label: "How installation works", to: "/installation", desc: "Survey, quotation, installation and handover" },
        { label: "Request a site survey", to: "/installation#request", desc: "Anywhere in Uganda" },
        { label: "Our projects", to: "/projects", desc: "Installations we've completed" },
      ] },
    ],
    feature: { kicker: "Our terms", title: "70% deposit, 30% on handover", text: "Every installation comes with a 6-month warranty.", cta: "How it works", to: "/installation" },
  },
  {
    id: "support", label: "Support", kind: "tabs",
    tabs: [
      { label: "Orders", links: [
        { label: "Track my order", to: "/track-order", desc: "Use your order number and phone" },
        { label: "Contact us", to: "/contact", desc: "Call, WhatsApp, email or visit" },
      ] },
      { label: "Learn & share", links: [
        { label: "News & tips", to: "/news", desc: "Product news and security advice" },
        { label: "Customer reviews", to: "/reviews", desc: "What our customers say" },
        { label: "Give feedback", to: "/feedback", desc: "Tell us how we did" },
      ] },
    ],
  },
  {
    id: "about", label: "About", kind: "tabs",
    tabs: [
      { label: "Company", links: [
        { label: "About us", to: "/about", desc: "Who we are and what we do" },
        { label: "Our projects", to: "/projects", desc: "Work we've delivered" },
        { label: "Become a distributor", to: "/become-a-distributor", desc: "Partner with us" },
        { label: "Privacy notice", to: "/privacy", desc: "How we use your details" },
      ] },
    ],
  },
];

/** Which top menu a path belongs to, so it stays highlighted. */
export function menuForPath(path: string): string | null {
  if (path.startsWith("/product") || path.startsWith("/cctv-planner")) return "products";
  if (path.startsWith("/solutions") || path.startsWith("/for-businesses") || path.startsWith("/become-a-distributor")) return "solutions";
  if (path.startsWith("/installation") || path.startsWith("/projects")) return "installation";
  if (["/track-order", "/news", "/reviews", "/feedback", "/contact"].some(p => path.startsWith(p))) return "support";
  if (path.startsWith("/about") || path.startsWith("/privacy")) return "about";
  return null;
}
