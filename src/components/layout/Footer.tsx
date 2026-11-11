import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CATEGORIES } from "../../config/categories.ts";
import { SOLUTIONS } from "../../config/navigation.ts";
import { useShop } from "../../context/ShopContext.tsx";
import { telLink, whatsappLink } from "../../lib/format.ts";

const heading = "mb-4 text-[14px] font-semibold text-white";
const list = "space-y-2.5 text-[13.5px]";
const link = "text-white/60 transition hover:text-white";

export default function Footer() {
  const { business } = useShop();
  return (
    <footer className="bg-[#14181c] text-white">
      <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div>
          <h3 className={heading}>Products</h3>
          <ul className={list}>{CATEGORIES.map(c => <li key={c.slug}><Link to={"/products/" + c.slug} className={link}>{c.short}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className={heading}>Solutions</h3>
          <ul className={list}>
            {SOLUTIONS.map(s => <li key={s.slug}><Link to={"/solutions/" + s.slug} className={link}>{s.label}</Link></li>)}
            <li><Link to="/for-businesses" className={link}>For businesses</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={heading}>Services & tools</h3>
          <ul className={list}>
            <li><Link to="/installation" className={link}>Installation</Link></li>
            <li><Link to="/installation#request" className={link}>Request a site survey</Link></li>
            <li><Link to="/cctv-planner" className={link}>CCTV planner</Link></li>
            <li><Link to="/track-order" className={link}>Track my order</Link></li>
            <li><Link to="/become-a-distributor" className={link}>Become a distributor</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={heading}>Company</h3>
          <ul className={list}>
            <li><Link to="/about" className={link}>About us</Link></li>
            <li><Link to="/projects" className={link}>Our projects</Link></li>
            <li><Link to="/news" className={link}>News & tips</Link></li>
            <li><Link to="/reviews" className={link}>Customer reviews</Link></li>
            <li><Link to="/feedback" className={link}>Feedback</Link></li>
            <li><Link to="/privacy" className={link}>Privacy notice</Link></li>
          </ul>
        </div>
        <div>
          <h3 className={heading}>Contact us</h3>
          <ul className={list}>
            {business.phones.map(p => (
              <li key={p}><a href={telLink(p)} className={link + " inline-flex items-center gap-2"}><Phone className="h-4 w-4 text-brand" />{p}</a></li>
            ))}
            {business.whatsapp && (
              <li><a href={whatsappLink(business.whatsapp, "Hello MS Home Security, ")} target="_blank" rel="noopener noreferrer" className={link + " inline-flex items-center gap-2"}><MessageCircle className="h-4 w-4 text-brand" />WhatsApp</a></li>
            )}
            {business.email && <li><a href={"mailto:" + business.email} className={link + " inline-flex items-center gap-2 break-all"}><Mail className="h-4 w-4 shrink-0 text-brand" />{business.email}</a></li>}
            <li className="flex items-start gap-2 text-white/60"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{business.address}</li>
            <li className="flex items-start gap-2 text-white/60"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />{business.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 py-6 text-[12.5px] text-white/45 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="rounded-md bg-white px-2 py-1.5"><img src="/logo.png" alt="MS Home Security Solutions" className="h-7 w-auto" loading="lazy" /></span>
            <p>© {new Date().getFullYear()} {business.name}. All rights reserved.</p>
          </div>
          <p>Prices in Uganda Shillings · Delivery and installation across Uganda</p>
        </div>
      </div>
    </footer>
  );
}
