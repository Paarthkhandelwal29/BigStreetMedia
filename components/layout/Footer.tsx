import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { site, whatsappLink } from "@/lib/site";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { Phone, EnvelopeSimple, WhatsappLogo, MapPin } from "@phosphor-icons/react/dist/ssr";

const company = [
  { label: "About", href: "/about" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Media Inventory", href: "/media-inventory" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="border-t-4 border-amber bg-ink text-white/70">
      <div className="container-bsm py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* brand */}
          <div className="lg:col-span-2">
            <Logo light className="h-12 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              {site.tagline} A 360° advertising agency executing campaigns across{" "}
              {site.stats.cities} cities since {site.established}.
            </p>
            <div className="mt-6 flex gap-3">
              {site.phones.map((p) => (
                <a
                  key={p}
                  href={`tel:${p.replace(/[^+\d]/g, "")}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-amber hover:text-amber"
                  aria-label={`Call ${p}`}
                >
                  <Phone size={18} />
                </a>
              ))}
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-amber hover:text-amber"
                aria-label="Chat on WhatsApp"
              >
                <WhatsappLogo size={18} />
              </a>
            </div>
          </div>

          {/* services */}
          <FooterCol title="Services">
            {services.slice(0, 6).map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}`}>
                {s.title}
              </FooterLink>
            ))}
            <FooterLink href="/services">All Services →</FooterLink>
          </FooterCol>

          {/* industries */}
          <FooterCol title="Industries">
            {industries.slice(0, 6).map((i) => (
              <FooterLink key={i.slug} href={`/industries/${i.slug}`}>
                {i.name}
              </FooterLink>
            ))}
          </FooterCol>

          {/* company */}
          <FooterCol title="Company">
            {company.map((c) => (
              <FooterLink key={c.href} href={c.href}>
                {c.label}
              </FooterLink>
            ))}
          </FooterCol>
        </div>

        {/* contact line */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-white/60 md:flex-row md:items-center md:gap-8">
          <a href={`mailto:${site.email}`} className="flex items-center gap-2 hover:text-amber">
            <EnvelopeSimple size={16} /> {site.email}
          </a>
          <span className="flex items-center gap-2">
            <MapPin size={16} /> {site.region}
          </span>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-[#333333]">
        <div className="container-bsm flex flex-col gap-3 py-6 text-[13px] text-[#666666] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.established}–{new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-amber">
              Privacy Policy
            </Link>
            <Link href="/sitemap" className="hover:text-amber">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-amber mb-4">{title}</h4>
      <ul className="flex flex-col gap-2.5 text-sm leading-[2.2]">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[#999999] transition-colors duration-200 hover:text-amber">
        {children}
      </Link>
    </li>
  );
}
