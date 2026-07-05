import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/shared/LeadForm";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        className="absolute inset-0 opacity-60"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(55% 80% at 85% 20%, rgba(255,193,7,0.2), transparent 70%), radial-gradient(40% 60% at 10% 80%, rgba(255,193,7,0.08), transparent 70%)",
        }}
      />
      <div className="container-bsm relative z-10 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <span className="eyebrow border-white/15 bg-white/5 text-white/80">
              Get Started
            </span>
            <h2 className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] text-white md:text-5xl">
              Let&apos;s build something{" "}
              <span className="text-amber">big.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
              Tell us your campaign goal — we&apos;ll come back with a tailored media plan within 48 hours.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/50">
              <div>
                <p className="font-mono text-2xl font-bold text-amber">{site.stats.campaigns}</p>
                <p className="mt-1">Campaigns executed</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-amber">{site.stats.cities}</p>
                <p className="mt-1">Cities covered</p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-amber">{site.stats.years}</p>
                <p className="mt-1">Years of experience</p>
              </div>
            </div>
            <ButtonLink
              href="/contact"
              variant="ghost-light"
              size="md"
              className="mt-8 hidden lg:inline-flex"
            >
              Or visit our contact page
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[1.5rem] border border-white/10 bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] sm:p-6">
              <p className="mb-4 font-display text-lg font-semibold text-ink">
                Get your free media plan
              </p>
              <LeadForm
                layout="stack"
                subject="Free Media Plan request — Big Street Media"
                submitLabel="Get Free Media Plan"
                fields={[
                  { name: "name", label: "Your Name", required: true, placeholder: "Your name" },
                  { name: "company", label: "Company", placeholder: "Company name" },
                  { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "+91 ..." },
                  { name: "email", label: "Email", type: "email", placeholder: "you@company.com" },
                ]}
              />
              <p className="mt-4 text-center text-xs text-muted">
                No commitment. No spam. Just a tailored plan for your brand.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
