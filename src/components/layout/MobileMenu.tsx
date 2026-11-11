import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, X } from "lucide-react";
import { NAV } from "../../config/navigation.ts";
import { CATEGORIES } from "../../config/categories.ts";

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { pathname } = useLocation();

  // Close after following a link.
  useEffect(() => { onClose(); }, [pathname, onClose]);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="anim-fade absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="anim-slide absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col overflow-y-auto bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <img src="/logo.png" alt="MS Home Security Solutions" className="h-10 w-auto" />
          <button type="button" onClick={onClose} aria-label="Close menu" className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-paper"><X className="h-6 w-6" /></button>
        </div>
        <nav className="flex-1 px-5" aria-label="Main">
          {NAV.map(m => {
            const links = m.kind === "products"
              ? [...CATEGORIES.map(c => ({ label: c.name, to: "/products/" + c.slug })), ...(m.tools ?? [])]
              : [...m.tabs.flatMap(t => t.links), ...(m.tools ?? [])];
            const isOpen = expanded === m.id;
            return (
              <div key={m.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : m.id)}
                  aria-expanded={isOpen}
                  className={"flex w-full items-center justify-between py-4 text-[16px] font-semibold " + (isOpen ? "text-brand-dark" : "text-ink")}
                >
                  {m.label}
                  <ChevronDown className={"h-5 w-5 transition " + (isOpen ? "rotate-180" : "")} />
                </button>
                {isOpen && (
                  <ul className="pb-3">
                    {links.map(l => (
                      <li key={l.to + l.label}><Link to={l.to} className="block rounded-md px-3 py-2.5 text-[15px] text-ink-soft active:bg-paper">{l.label}</Link></li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
        <div className="space-y-2 p-5">
          <Link to="/installation#request" className="block rounded-full bg-brand py-3.5 text-center text-[15px] font-semibold text-white">Get a quote</Link>
          <Link to="/track-order" className="block rounded-full border border-line py-3 text-center text-[15px] font-semibold text-ink">Track my order</Link>
        </div>
      </div>
    </div>
  );
}
