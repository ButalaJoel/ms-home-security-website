import { Link, useParams } from "react-router-dom";
import { ArrowRight, BadgeCheck, Building, ClipboardList, Handshake, PackageCheck, Truck, Wrench } from "lucide-react";
import { PageHero, HeroButton, SectionTitle, wrap } from "../components/common/PageParts.tsx";
import RequestForm, { CONTACT_FIELDS, UG_DISTRICT_HINT } from "../components/common/RequestForm.tsx";
import { ProductCard } from "../components/product/ProductBits.tsx";
import { SOLUTION_PAGES, solutionBySlug } from "../config/solutions.ts";
import { categoryByName } from "../config/categories.ts";
import { useShop } from "../context/ShopContext.tsx";
import { NotFoundPage } from "./ComingNextPage.tsx";

// /solutions/:place
export function SolutionPage() {
  const { place = "" } = useParams();
  const s = solutionBySlug(place);
  const { products } = useShop();
  if (!s) return <NotFoundPage />;

  const picks = s.categories.flatMap(c => products.filter(p => p.category === c).sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 2)).slice(0, 8);
  const Icon = s.icon;

  return (
    <>
      <PageHero crumbs={[{ label: "Solutions" }, { label: s.label }]} title={s.title} intro={s.intro}>
        <HeroButton to="#request">Request a site survey</HeroButton>
        <HeroButton to="/for-businesses" ghost>Business quote</HeroButton>
      </PageHero>

      <section className={wrap + " py-16"}>
        <SectionTitle kicker="What you need" title={"What we set up for " + s.label.toLowerCase()} />
        <div className="grid gap-4 md:grid-cols-3">
          {s.needs.map((n, i) => (
            <div key={n.title} className="rounded-2xl border border-line p-6">
              <span className="text-[13px] font-bold text-brand-dark">0{i + 1}</span>
              <h3 className="mt-2 text-[19px] font-bold">{n.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{n.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper py-16">
        <div className={wrap + " grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center"}>
          <div>
            <SectionTitle kicker="Typical system" title="A starting point we adjust to your site" text="Every property is different. After the site survey we send a written quotation with exactly what you need." />
            <ul className="space-y-3">
              {s.package.map(p => <li key={p} className="flex items-start gap-3 text-[15.5px]"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />{p}</li>)}
            </ul>
          </div>
          <div className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl bg-ink">
            <div className="dot-grid absolute inset-0 opacity-60" />
            <Icon className="relative h-32 w-32 text-brand/60" strokeWidth={0.8} />
            <div className="absolute bottom-0 inset-x-0 flex flex-wrap gap-2 p-5">
              {s.categories.map(c => {
                const cat = categoryByName(c);
                return cat ? <Link key={c} to={"/products/" + cat.slug} className="rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white ring-1 ring-white/15 hover:bg-white/20">{cat.short}</Link> : null;
              })}
            </div>
          </div>
        </div>
      </section>

      {picks.length > 0 && (
        <section className={wrap + " py-16"}>
          <SectionTitle kicker="Products" title={"Popular for " + s.label.toLowerCase()} />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{picks.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      <section id="request" className="scroll-mt-24 bg-paper py-16">
        <div className={wrap + " grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"}>
          <SectionTitle kicker="Next step" title="Request a site survey" text="Tell us where the site is and what worries you most. We'll call to agree a visit, anywhere in Uganda." />
          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <RequestForm kind="installation" submitLabel="Request survey" initial={{ place: s.label }} fields={[
              ...CONTACT_FIELDS,
              { name: "location", label: "Site location", required: true, half: true, hint: UG_DISTRICT_HINT },
              { name: "place", label: "Type of place", type: "select", half: true, options: SOLUTION_PAGES.map(x => x.label).concat("Other") },
              { name: "details", label: "What do you need?", type: "textarea", placeholder: "e.g. 6 cameras for the compound and gate, phone viewing" },
            ]} />
          </div>
        </div>
      </section>

      <section className={wrap + " py-16"}>
        <h2 className="mb-6 text-[22px] font-bold">Other solutions</h2>
        <div className="flex flex-wrap gap-2">
          {SOLUTION_PAGES.filter(x => x.slug !== s.slug).map(x => (
            <Link key={x.slug} to={"/solutions/" + x.slug} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-[14.5px] font-medium hover:border-brand hover:text-brand-dark">
              <x.icon className="h-4 w-4" /> {x.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

const BUSINESS_POINTS = [
  { icon: ClipboardList, title: "One quotation", text: "Cameras, access control, radios and parking in one written quote, valid for 30 days." },
  { icon: Truck, title: "Delivered across Uganda", text: "We deliver to any district and coordinate with your site team." },
  { icon: Wrench, title: "Installed and tested", text: "Our technicians install, test and hand over with training for your staff." },
  { icon: PackageCheck, title: "Bulk and tender orders", text: "Supply-only orders for contractors, with documents for tenders and procurement." },
];

export function ForBusinessesPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Solutions", to: "/solutions/shops-offices" }, { label: "For businesses" }]} title="Security for organisations" intro="Schools, hotels, estates, banks, NGOs and companies: one team to plan, supply and install the whole system.">
        <HeroButton to="#quote">Get a business quote</HeroButton>
      </PageHero>
      <section className={wrap + " py-16"}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BUSINESS_POINTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-line p-6">
              <Icon className="h-7 w-7 text-brand" />
              <h3 className="mt-4 text-[17px] font-bold">{title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-paper py-16">
        <div className={wrap}>
          <SectionTitle kicker="By sector" title="Where we work" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {SOLUTION_PAGES.map(s => (
              <Link key={s.slug} to={"/solutions/" + s.slug} className="group flex items-center justify-between gap-3 rounded-2xl bg-white p-5 transition hover:shadow-[0_10px_30px_rgba(11,38,59,0.08)]">
                <span className="flex items-center gap-3 font-semibold"><s.icon className="h-5 w-5 text-brand" />{s.label}</span>
                <ArrowRight className="h-4 w-4 text-ink-soft transition group-hover:translate-x-1 group-hover:text-brand" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="quote" className={wrap + " scroll-mt-24 grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]"}>
        <SectionTitle kicker="Business quote" title="Tell us about the project" text="We'll call to understand the site, then send a written quotation." />
        <div className="rounded-2xl border border-line p-6 sm:p-8">
          <RequestForm kind="business" submitLabel="Send request" fields={[
            { name: "company", label: "Organisation", required: true, half: true },
            { name: "sector", label: "Sector", type: "select", half: true, options: ["School", "Hotel", "Office", "Shop or supermarket", "Estate or apartments", "Bank", "NGO", "Government", "Contractor", "Other"] },
            ...CONTACT_FIELDS,
            { name: "email", label: "Email", type: "email", half: true },
            { name: "location", label: "Site location", required: true, half: true, hint: UG_DISTRICT_HINT },
            { name: "details", label: "What do you need?", type: "textarea", required: true, placeholder: "Number of sites, buildings or gates, what you want covered, any deadline" },
          ]} />
        </div>
      </section>
    </>
  );
}

const DISTRIBUTOR_POINTS = [
  { icon: Handshake, title: "Trade prices", text: "Better prices for registered resellers and installers buying regularly." },
  { icon: PackageCheck, title: "Stock support", text: "Products from the brands we carry, with help choosing what to stock." },
  { icon: Wrench, title: "Training", text: "Product and installation training for your technicians." },
  { icon: Building, title: "Leads in your area", text: "Customers near you can be referred to you for supply and installation." },
];

export function DistributorPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Become a distributor" }]} title="Become a distributor" intro="Sell and install MS Home Security products in your town, with our support.">
        <HeroButton to="#apply">Apply now</HeroButton>
      </PageHero>
      <section className={wrap + " py-16"}>
        <SectionTitle kicker="Why partner with us" title="What you get" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DISTRIBUTOR_POINTS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-line p-6">
              <Icon className="h-7 w-7 text-brand" />
              <h3 className="mt-4 text-[17px] font-bold">{title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="apply" className="scroll-mt-24 bg-paper py-16">
        <div className={wrap + " grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"}>
          <SectionTitle kicker="Application" title="Apply to become a distributor" text="Tell us about your business. We'll review it and call you to discuss the next steps." />
          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <RequestForm kind="distributor" submitLabel="Send application" fields={[
              { name: "business", label: "Business name", required: true, half: true },
              { name: "location", label: "Town or district", required: true, half: true },
              ...CONTACT_FIELDS,
              { name: "email", label: "Email", type: "email", half: true },
              { name: "type", label: "What you do now", type: "select", half: true, options: ["Electronics shop", "Security installer", "Hardware shop", "IT company", "Starting a new business", "Other"] },
              { name: "registered", label: "Business is registered (URSB)", type: "checkbox" },
              { name: "details", label: "Tell us more", type: "textarea", placeholder: "Your shop or office, how long you've been in business, which products interest you" },
            ]} />
          </div>
        </div>
      </section>
    </>
  );
}
