import { BadgeCheck, CalendarCheck, ClipboardList, HardHat, Home, MapPin, Smartphone, Wrench } from "lucide-react";
import { EmptyState, Faq, HeroButton, PageHero, SectionTitle, wrap } from "../components/common/PageParts.tsx";
import RequestForm, { CONTACT_FIELDS, UG_DISTRICT_HINT } from "../components/common/RequestForm.tsx";
import { SOLUTION_PAGES } from "../config/solutions.ts";
import { useShop } from "../context/ShopContext.tsx";

const STEPS = [
  { icon: CalendarCheck, title: "Site survey", text: "We visit, look at the site with you and agree what should be covered." },
  { icon: ClipboardList, title: "Written quotation", text: "Every item and the labour, in writing. Quotations are valid for 30 days." },
  { icon: Wrench, title: "Installation", text: "You pay the 70% deposit, we bring the equipment, install and test everything." },
  { icon: Home, title: "Handover", text: "We show you how it works, set up phone viewing, and you pay the 30% balance." },
];

const INCLUDED = [
  "Neat cabling, with trunking where cables are exposed",
  "Recorder set up with the right recording time",
  "Phone viewing on your phone and family or managers' phones",
  "A short training for you or your staff",
  "6-month installation warranty",
  "Support by phone, WhatsApp or a site visit",
];

const FAQ = [
  { q: "Do you install outside Kampala?", a: "Yes. We deliver and install anywhere in Uganda. For sites far from Kampala, transport is agreed in the quotation." },
  { q: "How much does installation cost?", a: "It depends on the number of devices, cable lengths and the site. After the survey you get a written quotation with every cost listed." },
  { q: "How do I pay?", a: "A 70% deposit before installation starts and the 30% balance on handover. Mobile Money, bank or cash." },
  { q: "Can I view my cameras on my phone?", a: "Yes. We set up the app on your phone before we leave and show you how to watch live and play back recordings." },
  { q: "Can you add to a system I already have?", a: "Usually yes. We check your recorder and cameras during the survey and tell you what can be reused." },
  { q: "What if something stops working?", a: "Installations have a 6-month warranty. Call or WhatsApp us and we'll fix it, by phone or with a site visit." },
];

export function InstallationPage() {
  const { business } = useShop();
  return (
    <>
      <PageHero crumbs={[{ label: "Installation" }]} title="Professional installation, anywhere in Uganda" intro={"Our own technicians survey, install, test and hand over. " + business.installationTerms}>
        <HeroButton to="#request">Request a site survey</HeroButton>
        <HeroButton to="/projects" ghost>See our projects</HeroButton>
      </PageHero>

      <section className={wrap + " py-16"}>
        <SectionTitle kicker="How it works" title="Four steps from survey to handover" />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-2xl border border-line p-6">
              <div className="flex items-center justify-between"><Icon className="h-7 w-7 text-brand" /><span className="text-[13px] font-bold text-ink-soft/50">0{i + 1}</span></div>
              <h3 className="mt-4 text-[18px] font-bold">{title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-soft">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-ink py-16 text-white">
        <div className={wrap + " grid gap-10 lg:grid-cols-2 lg:items-center"}>
          <div>
            <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-brand">Included</p>
            <h2 className="text-[26px] font-bold sm:text-[34px]">What every installation includes</h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {INCLUDED.map(t => <li key={t} className="flex items-start gap-3 text-[15px] text-white/85"><BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" />{t}</li>)}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{ icon: MapPin, big: "All of", small: "Uganda covered" }, { icon: BadgeCheck, big: business.warranty, small: "warranty" }, { icon: Smartphone, big: "24/7", small: "phone viewing" }, { icon: HardHat, big: "70 / 30", small: "deposit and balance" }].map(({ icon: Icon, big, small }) => (
              <div key={small} className="rounded-2xl bg-white/[0.06] p-6 ring-1 ring-white/10">
                <Icon className="h-6 w-6 text-brand" />
                <p className="mt-4 text-[26px] font-bold">{big}</p>
                <p className="text-[13.5px] text-white/60">{small}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={wrap + " grid gap-10 py-16 lg:grid-cols-[0.8fr_1.2fr]"}>
        <SectionTitle kicker="Questions" title="Installation questions" />
        <Faq items={FAQ} />
      </section>

      <section id="request" className="scroll-mt-24 bg-paper py-16">
        <div className={wrap + " grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"}>
          <SectionTitle kicker="Book" title="Request a site survey" text="Give us your details and we'll call to agree a date." />
          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <RequestForm kind="installation" submitLabel="Request survey" fields={[
              ...CONTACT_FIELDS,
              { name: "location", label: "Site location", required: true, half: true, hint: UG_DISTRICT_HINT },
              { name: "place", label: "Type of place", type: "select", half: true, options: SOLUTION_PAGES.map(x => x.label).concat("Other") },
              { name: "service", label: "What do you need?", type: "select", half: true, options: ["CCTV cameras", "Alarm system", "Access control or attendance", "Smart locks", "Parking or boom barrier", "Several of these", "Repair or upgrade"] },
              { name: "when", label: "When would you like the visit?", half: true, placeholder: "e.g. this week, Saturday morning" },
              { name: "details", label: "Anything else we should know?", type: "textarea" },
            ]} />
          </div>
        </div>
      </section>
    </>
  );
}

// Projects are added by staff in the POS (Website content); until then this page explains and invites a survey.
export function ProjectsPage() {
  return (
    <>
      <PageHero crumbs={[{ label: "Installation", to: "/installation" }, { label: "Our projects" }]} title="Our projects" intro="Installations we've completed for homes, businesses and organisations across Uganda." />
      <section className={wrap + " py-16"}>
        <EmptyState icon={Wrench} title="Project photos are on the way" text="We're adding photos of our recent installations. Want to see similar work near you? Ask us and we'll share examples." action={{ label: "Request a site survey", to: "/installation#request" }} />
      </section>
    </>
  );
}
