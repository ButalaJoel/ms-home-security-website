import { useEffect } from "react";

// Page title, description and share-preview tags for each page.
// index.html has the defaults for the home page and for crawlers that don't run JavaScript.
export const SITE_NAME = "MS Home Security Solutions";
const DEFAULT_DESCRIPTION =
  "CCTV cameras, access control, smart locks, metal detectors, walkie-talkies, alarms and parking systems in Kampala, with installation anywhere in Uganda.";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Short, single-line text for a meta description (search results show about 155 characters). */
export function summary(text: string | undefined, max = 155): string {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max - 1)).replace(/[,.;:]$/, "") + "…";
}

export function usePageMeta({ title, description, image, noindex = false }: { title?: string; description?: string; image?: string; noindex?: boolean }) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Security equipment and installation, Kampala`;
    const desc = summary(description) || DEFAULT_DESCRIPTION;
    const url = window.location.origin + window.location.pathname;
    document.title = fullTitle;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image || window.location.origin + "/og-image.jpg");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "robots", noindex ? "noindex, follow" : "index, follow");
    setCanonical(url);
  }, [title, description, image, noindex]);
}
