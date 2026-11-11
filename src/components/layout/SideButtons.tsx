import { useEffect, useState } from "react";
import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { useShop } from "../../context/ShopContext.tsx";
import { telLink, whatsappLink } from "../../lib/format.ts";

// Floating buttons on the right edge (hikvision.com keeps support and shop buttons there).
export default function SideButtons() {
  const { business } = useShop();
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base = "group relative flex h-11 w-11 items-center justify-center rounded-xl sm:h-12 sm:w-12 bg-white text-ink shadow-[0_6px_20px_rgba(11,38,59,0.16)] ring-1 ring-line transition hover:text-white";
  const tip = "pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-[12.5px] font-medium text-white opacity-0 transition group-hover:opacity-100";
  return (
    <div className="fixed bottom-4 right-3 z-30 flex flex-col gap-2 sm:bottom-6 sm:right-5 sm:gap-2.5">
      {business.whatsapp && (
        <a href={whatsappLink(business.whatsapp, "Hello MS Home Security, ")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp us" className={base + " hover:bg-[#1fa855]"}>
          <MessageCircle className="h-[22px] w-[22px]" /><span className={tip}>WhatsApp us</span>
        </a>
      )}
      {business.phones[0] && (
        <a href={telLink(business.phones[0])} aria-label={"Call " + business.phones[0]} className={base + " !hidden hover:bg-brand sm:!flex"}>
          <Phone className="h-5 w-5" /><span className={tip}>Call {business.phones[0]}</span>
        </a>
      )}
      {showTop && (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className={base + " anim-fade hover:bg-ink"}>
          <ArrowUp className="h-5 w-5" /><span className={tip}>Back to top</span>
        </button>
      )}
    </div>
  );
}
