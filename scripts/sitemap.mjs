// Writes dist/sitemap.xml and dist/robots.txt after the build.
// SITE_URL is the public address (set it in the host's settings when the domain is live).
// Product pages are read from the POS; if it can't be reached, the sitemap still lists every other page.
import { readFileSync, writeFileSync } from "node:fs";

const SITE = (process.env.SITE_URL || "https://ms-home-security-website-beca.vercel.app").replace(/\/$/, "");
const POS = (process.env.POS_URL || "https://ms-home-security-pos.onrender.com").replace(/\/$/, "");

const slugs = (file) => [...readFileSync(new URL(file, import.meta.url), "utf8").matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]);
const pages = [
  "/", "/products",
  ...slugs("../src/config/categories.ts").map((s) => "/products/" + s),
  ...slugs("../src/config/solutions.ts").map((s) => "/solutions/" + s),
  "/installation", "/for-businesses", "/become-a-distributor", "/projects",
  "/contact", "/about", "/track-order", "/news", "/reviews", "/feedback", "/privacy",
];

let products = [];
try {
  // The POS on a free plan can take up to a minute to wake up.
  const res = await fetch(POS + "/api/public/products", { signal: AbortSignal.timeout(60_000) });
  const body = await res.json();
  if (body?.success) products = body.products.map((p) => "/product/" + encodeURIComponent(p.id));
} catch (error) {
  console.warn("sitemap: POS not reachable, product pages left out (" + (error?.message ?? error) + ")");
}

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...pages, ...products].map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
writeFileSync(new URL("../dist/sitemap.xml", import.meta.url), xml);
writeFileSync(
  new URL("../dist/robots.txt", import.meta.url),
  `User-agent: *\nAllow: /\nDisallow: /checkout\nDisallow: /order/\n\nSitemap: ${SITE}/sitemap.xml\n`,
);
console.log(`sitemap: ${pages.length} pages + ${products.length} products for ${SITE}`);
