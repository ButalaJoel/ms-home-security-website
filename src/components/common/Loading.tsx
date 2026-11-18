import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useShop } from "../../context/ShopContext.tsx";

/**
 * Appears only when the catalogue takes a while (the POS server can sleep and needs
 * up to a minute to wake), so visitors know the page isn't broken.
 */
export function SlowLoadNotice({ className = "" }: { className?: string }) {
  const { loading } = useShop();
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (!loading) { setSlow(false); return; }
    const t = window.setTimeout(() => setSlow(true), 6000);
    return () => window.clearTimeout(t);
  }, [loading]);
  if (!loading || !slow) return null;
  return (
    <p role="status" className={"anim-fade flex items-center justify-center gap-2 rounded-xl bg-brand-soft px-4 py-3 text-center text-[14px] text-ink " + className}>
      <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-brand" />
      Connecting to our shop system… The first visit of the day can take up to a minute.
    </p>
  );
}
