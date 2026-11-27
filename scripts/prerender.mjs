// Runs after `vite build` (and after sitemap.mjs). Writes a real HTML file for every public page into dist/,
// with that page's title, description, canonical address and share picture already in the <head>, plus a short
// plain-text version of the page inside #root. WhatsApp, Facebook and AI crawlers don't run JavaScript, so without
// this every shared link previews as the home page. The app itself is unchanged: when the JavaScript loads,
// React replaces the plain text with the normal page. No headless browser and no server rendering.
//
// Page titles and descriptions mirror what each page sets with usePageMeta (src/lib/seo.ts); keep them in step.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const DIST = "dist";
const SITE = (process.env.SITE_URL || "https://mssecuritysystemsltd.com").replace(/\/$/, "");
const POS = (process.env.POS_URL || "https://ms-home-security-pos.onrender.com").replace(/\/$/, "");
const NAME = "MS Security Systems Ltd";
const HOME_TITLE = `${NAME} | Security equipment and installation, Kampala`;
const DEFAULT_DESC =
  "CCTV cameras, access control, smart locks, metal detectors, walkie-talkies, alarms and parking systems in Kampala, with installation anywhere in Uganda.";
const DEFAULT_IMAGE = SITE + "/og-image.jpg";

// ---------- Content from the source files and the POS ----------
const src = (f) => readFileSync(new URL("../src/config/" + f, import.meta.url), "utf8");
const str = (block, key) => block.match(new RegExp(key + ':\\s*"((?:[^"\\\\]|\\\\.)*)"'))?.[1]?.replace(/\\"/g, '"');

const categories = src("categories.ts")
  .split("\n")
  .filter((l) => /^\s*\{ name: "/.test(l))
  .map((l) => ({ name: str(l, "name"), slug: str(l, "slug"), blurb: str(l, "blurb") }));
const solutions = src("solutions.ts")
  .split(/\n\s*\{\s*\n\s*slug:/)
  .slice(1)
  .map((b) => "slug:" + b)
  .map((b) => ({ slug: str(b, "slug"), title: str(b, "title"), intro: str(b, "intro") }));
const installationTerms = str(src("business.ts"), "installationTerms") || "";

if (categories.length !== 9 || solutions.length < 1 || categories.some((c) => !c.slug || !c.blurb) || solutions.some((s) => !s.title)) {
  throw new Error(`prerender: could not read the categories (${categories.length}) or solutions (${solutions.length}) from src/config`);
}

let products = [];
try {
  // The POS on a free plan can take up to a minute to wake up (sitemap.mjs has usually woken it already).
  const res = await fetch(POS + "/api/public/products", { signal: AbortSignal.timeout(60_000) });
  const body = await res.json();
  if (body?.success) products = body.products;
} catch (error) {
  console.warn("prerender: POS not reachable, product pages left to the app (" + (error?.message ?? error) + ")");
}

// ---------- HTML helpers ----------
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const short = (text, max = 155) => {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max - 1)).replace(/[,.;:]$/, "") + "…";
};
// WhatsApp needs an absolute JPG or PNG. Cloudinary photos are converted to a 1200×630 JPG on the fly.
function shareImage(url) {
  if (!url) return DEFAULT_IMAGE;
  if (/^https:\/\/res\.cloudinary\.com\/.+\/image\/upload\//.test(url)) {
    return url.replace("/image/upload/", "/image/upload/f_jpg,q_auto,w_1200,h_630,c_pad,b_white/");
  }
  if (/^https?:\/\//.test(url) && /\.(jpe?g|png)(\?|$)/i.test(url)) return url;
  if (url.startsWith("/")) return SITE + url;
  return DEFAULT_IMAGE;
}
const ugx = (n) => "UGX " + Math.round(n).toLocaleString("en-US");

const template = readFileSync(path.join(DIST, "index.html"), "utf8");
function setTag(html, re, tag) {
  if (!re.test(html)) throw new Error("prerender: index.html is missing a tag it expects: " + re);
  return html.replace(re, tag);
}
function page({ path: p, title, description, image, body, jsonLd }) {
  const url = SITE + p;
  const fullTitle = title ? `${title} | ${NAME}` : HOME_TITLE;
  const desc = short(description) || DEFAULT_DESC;
  let html = template;
  html = setTag(html, /<title>[\s\S]*?<\/title>/, `<title>${esc(fullTitle)}</title>`);
  html = setTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(desc)}" />`);
  html = setTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(fullTitle)}" />`);
  html = setTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(desc)}" />`);
  html = setTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${esc(shareImage(image))}" />`);
  if (image) html = html.replace(/\s*<meta property="og:image:(width|height)" content="\d+" \/>/g, ""); // product photos have other sizes
  html = html.replace(/"image": "\/og-image.jpg"/, `"image": "${DEFAULT_IMAGE}"`).replace(/"logo": "\/logo.png"/, `"logo": "${SITE}/logo.png"`);
  const extra = [
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<style>.prerender{max-width:1320px;margin:0 auto;padding:32px 20px;font:16px/1.6 system-ui,sans-serif;color:#1f2933}.prerender a{color:#0B263B;text-decoration:underline}.prerender h1{font-size:28px;font-weight:700;margin:16px 0 8px}.prerender h2{font-size:20px;font-weight:700;margin:20px 0 6px}.prerender p{margin:6px 0}.prerender ul{list-style:disc;padding-left:22px;margin:8px 0}</style>`,
    ...(jsonLd ? [`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`] : []),
  ];
  html = html.replace("</head>", "  " + extra.join("\n    ") + "\n  </head>");
  if (!html.includes('<div id="root"></div>')) throw new Error('prerender: index.html is missing <div id="root"></div>');
  const nav = `<p><a href="/">Home</a> · <a href="/products">Products</a> · <a href="/installation">Installation</a> · <a href="/contact">Contact us</a></p>`;
  return html.replace('<div id="root"></div>', `<div id="root"><div class="prerender">${nav}${body}</div></div>`);
}
function write(p, html) {
  const file = p === "/" ? path.join(DIST, "index.html") : path.join(DIST, p.slice(1), "index.html");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, html);
}
const list = (items) => (items.length ? "<ul>" + items.join("") + "</ul>" : "");
const productLink = (p) => `<li><a href="/product/${encodeURIComponent(p.id)}">${esc([p.name, p.model].filter(Boolean).join(" "))}</a>${p.brand ? " (" + esc(p.brand) + ")" : ""}</li>`;
const categoryLinks = list(categories.map((c) => `<li><a href="/products/${c.slug}">${esc(c.name)}</a>: ${esc(c.blurb)}</li>`));

// ---------- The pages ----------
const out = [];
const add = (p, meta) => out.push([p, page({ path: p, ...meta })]);
const simple = (p, title, intro, metaTitle) =>
  add(p, { title: metaTitle ?? title, description: intro, body: `<h1>${esc(title)}</h1>${intro ? `<p>${esc(intro)}</p>` : ""}` });

// Home goes last: dist/index.html is the template every other page is built from.
const allDesc = "Shop CCTV cameras, access control, smart locks, metal detectors, walkie-talkies, alarms and parking systems from MS Security Systems Ltd in Kampala.";
add("/products", { title: "All products", description: allDesc, body: `<h1>All products</h1><p>${esc(allDesc)}</p>${categoryLinks}` });
for (const c of categories) {
  const desc = `${c.blurb} Delivery and installation anywhere in Uganda.`;
  const inCat = products.filter((p) => p.category === c.name);
  add("/products/" + c.slug, { title: c.name, description: desc, body: `<h1>${esc(c.name)}</h1><p>${esc(desc)}</p>${list(inCat.map(productLink))}` });
}
for (const s of solutions) simple("/solutions/" + s.slug, s.title, s.intro);
simple("/installation", "Professional installation, anywhere in Uganda", "Our own technicians survey, install, test and hand over. " + installationTerms);
simple("/projects", "Our projects", "Installations we've completed for homes, businesses and organisations across Uganda.");
simple("/for-businesses", "Security for organisations", "Schools, hotels, estates, banks, NGOs and companies: one team to plan, supply and install the whole system.");
simple("/become-a-distributor", "Become a distributor", "Sell and install MS Security Systems products in your town, with our support.");
simple("/contact", "Contact us", "Call, WhatsApp, email or visit the shop. We reply to messages during opening hours.");
simple("/about", "About " + NAME, "Your Security, Our Priority. We supply, install and support security systems for homes, businesses and organisations across Uganda.", "About us");
simple("/track-order", "Track your order", "Enter your order number and the phone number you used.");
simple("/news", "News & tips", "New products, offers and practical security advice from our team.");
simple("/reviews", "What our customers say", "Reviews from customers who bought from us or had a system installed.");
simple("/feedback", "Tell us how we did", "Praise, problems or ideas: everything is read by our team.");
simple("/privacy", "Privacy notice", "How " + NAME + " uses the details you give us on this website.");

// Only ids that are safe as a folder name and need no encoding get a file; any other product still works through the app.
const safeId = (id) => /^[A-Za-z0-9_-]+$/.test(String(id));
const skipped = products.filter((p) => !safeId(p.id)).length;
if (skipped) console.warn(`prerender: ${skipped} product(s) with unusual ids left to the app`);
for (const p of products.filter((p) => safeId(p.id))) {
  const name = [p.name, p.model].filter(Boolean).join(" ");
  const desc = p.description || [p.brand, p.subcategory || p.category, p.features?.join(", ")].filter(Boolean).join(". ");
  const price = p.price > 0 ? ugx(p.price) : "Price on request";
  const specs = (p.specs ?? []).map((s) => `<li>${esc(s.label)}: ${esc(s.value)}</li>`);
  const body =
    `<h1>${esc(name)}</h1>` +
    `<p>${[p.brand, p.category].filter(Boolean).map(esc).join(" · ")}</p>` +
    `<p><strong>${esc(price)}</strong></p>` +
    (p.description ? `<p>${esc(p.description)}</p>` : "") +
    list((p.features ?? []).map((f) => `<li>${esc(f)}</li>`)) +
    list(specs);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    ...(p.sku ? { sku: p.sku } : {}),
    ...(p.model ? { mpn: p.model } : {}),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    ...(p.description ? { description: p.description } : {}),
    image: [p.imageUrl, ...(p.images ?? [])].filter(Boolean),
    category: p.category,
    ...(p.price > 0
      ? {
          offers: {
            "@type": "Offer",
            url: `${SITE}/product/${encodeURIComponent(p.id)}`,
            priceCurrency: "UGX",
            price: p.price,
            availability: p.stock === "available_to_order" ? "https://schema.org/BackOrder" : p.stock === "low_stock" ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock",
            seller: { "@type": "Organization", name: NAME },
          },
        }
      : {}),
  };
  add("/product/" + p.id, { title: name, description: desc, image: p.imageUrl || undefined, body, jsonLd });
}

const featured = products.filter((p) => p.featured).slice(0, 8);
add("/", {
  description: DEFAULT_DESC,
  body: `<h1>${esc(NAME)}</h1><p>Your Security, Our Priority. ${esc(DEFAULT_DESC)}</p><p>TEC Plaza, Level 4, Shop L4-21, Kampala Road, Kampala. Open Monday to Saturday, 8am to 6pm.</p><h2>Products</h2>${categoryLinks}${featured.length ? "<h2>Featured</h2>" + list(featured.map(productLink)) : ""}`,
});

for (const [p, html] of out) write(p, html);
console.log(`prerender: ${out.length - (products.length - skipped)} pages + ${products.length - skipped} products written for ${SITE}`);
