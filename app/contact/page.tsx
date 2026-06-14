import type { Metadata } from "next";
import { MultiStepContactForm } from "@/components/contact/MultiStepContactForm";
import { site, whatsappLink } from "@/lib/site";
import { Phone, WhatsappLogo, EnvelopeSimple, MapPin } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Contact — Let's Plan Your Next Campaign",
  description:
    "Reach Big Street Media by phone, WhatsApp, or email. Share your campaign brief and we'll come back with a tailored media plan within 48 hours.",
};

export default function ContactPage() {
  return (
    <section className="container-bsm py-16 pt-32">
      <span className="eyebrow">Get in touch</span>
      <h1 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[1.08] text-ink md:text-5xl">
        Let&apos;s plan your next campaign
      </h1>
      <p className="mt-4 max-w-xl text-base text-body md:text-lg">
        Tell us about your brand and goal. We&apos;ll come back with a tailored media plan within 48 hours.
      </p>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* form */}
        <MultiStepContactForm />

        {/* details */}
        <div className="flex flex-col gap-6">
          <div className="rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-8">
            <h2 className="font-display text-lg font-semibold text-ink">Reach us directly</h2>
            <ul className="mt-6 flex flex-col gap-5 text-sm">
              {site.phones.map((p) => (
                <ContactRow key={p} icon={<Phone size={18} />} label="Phone">
                  <a href={`tel:${p.replace(/[^+\d]/g, "")}`} className="font-medium text-ink hover:text-amber-deep">
                    {p}
                  </a>
                </ContactRow>
              ))}
              <ContactRow icon={<WhatsappLogo size={18} />} label="WhatsApp">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-medium text-ink hover:text-amber-deep">
                  Chat with us
                </a>
              </ContactRow>
              <ContactRow icon={<EnvelopeSimple size={18} />} label="Email">
                <a href={`mailto:${site.email}`} className="font-medium text-ink hover:text-amber-deep">
                  {site.email}
                </a>
              </ContactRow>
              <ContactRow icon={<MapPin size={18} />} label="Office">
                <span className="font-medium text-ink">{site.region}</span>
              </ContactRow>
            </ul>
          </div>

          {/* map placeholder */}
          <div className="flex aspect-video items-center justify-center rounded-[1.5rem] border border-[#f0f0f0] bg-surface-2 text-sm uppercase tracking-widest text-muted">
            Map — {site.region}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber-deep">
        {icon}
      </span>
      <div>
        <span className="block text-xs text-muted">{label}</span>
        {children}
      </div>
    </li>
  );
}
