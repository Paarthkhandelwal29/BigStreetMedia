import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Big Street Media collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="container-bsm py-16 pt-32">
      <div className="mx-auto max-w-3xl">
        <span className="eyebrow">Legal</span>
        <h1 className="mt-5 font-display text-4xl font-extrabold text-ink">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-body [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink">
          <div>
            <h2>Overview</h2>
            <p className="mt-3">
              {site.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what
              information we collect when you use this website and how we use it.
            </p>
          </div>
          <div>
            <h2>Information we collect</h2>
            <p className="mt-3">
              When you submit an enquiry through our forms, WhatsApp, or email, we collect the details you
              provide — such as your name, company, phone number, email, and campaign requirements. We use
              this solely to respond to your enquiry and prepare a media plan.
            </p>
          </div>
          <div>
            <h2>How we use your information</h2>
            <p className="mt-3">
              We use your information to contact you about your enquiry, prepare proposals, and provide our
              services. We do not sell your personal information to third parties.
            </p>
          </div>
          <div>
            <h2>Analytics</h2>
            <p className="mt-3">
              We may use analytics tools to understand how visitors use our site. These tools may collect
              standard, non-identifying usage data such as pages visited and device type.
            </p>
          </div>
          <div>
            <h2>Contact</h2>
            <p className="mt-3">
              For any privacy questions, contact us at{" "}
              <a href={`mailto:${site.email}`} className="font-medium text-ink underline">
                {site.email}
              </a>{" "}
              or {site.phones[0]}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
