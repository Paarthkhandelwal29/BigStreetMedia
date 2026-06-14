import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "@/components/shared/LeadForm";

export function FinalCTA() {
  return (
    <section className="bg-amber">
      <div className="container-bsm py-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            Let&apos;s build something big.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-ink/70 md:text-lg">
            Tell us your campaign goal — we&apos;ll come back with a media plan in 48 hours.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-[1.5rem] bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-5">
            <LeadForm
              layout="inline"
              subject="Free Media Plan request — Big Street Media"
              submitLabel="Get Free Media Plan"
              fields={[
                { name: "name", label: "Your Name", required: true, placeholder: "Your name" },
                { name: "company", label: "Company", placeholder: "Company" },
                { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "Phone" },
              ]}
            />
          </div>
          <p className="mt-4 text-center text-sm text-ink/60">
            No commitment. No spam. Just a tailored plan for your brand.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
