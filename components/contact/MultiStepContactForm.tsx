"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

type Values = {
  name: string;
  company: string;
  designation: string;
  phone: string;
  email: string;
  requirement: string;
  cities: string;
  budget: string;
  timeline: string;
};

const empty: Values = {
  name: "",
  company: "",
  designation: "",
  phone: "",
  email: "",
  requirement: "Awareness",
  cities: "",
  budget: "₹25L",
  timeline: "1 Month",
};

const requirementOptions = ["Awareness", "Product Launch", "Store Opening", "360° Campaign", "Other"];
const budgetOptions = ["₹5L", "₹10L", "₹25L", "₹50L", "₹1Cr+"];
const timelineOptions = ["ASAP", "1 Month", "3 Months", "Planning"];

const steps = ["About You", "Campaign Brief", "Confirm"] as const;

export function MultiStepContactForm() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(empty);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const set = (k: keyof Values, v: string) => setValues((s) => ({ ...s, [k]: v }));

  function validateStep1() {
    if (!values.name.trim()) return "Please enter your name.";
    if (!values.phone.trim()) return "Please enter your phone number.";
    if (!values.email.trim()) return "Please enter your email.";
    return null;
  }

  function next() {
    if (step === 0) {
      const err = validateStep1();
      if (err) {
        setError(err);
        return;
      }
    }
    setError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    const body = [
      "New campaign enquiry — Big Street Media",
      "",
      `Name: ${values.name}`,
      `Company: ${values.company || "—"}`,
      `Designation: ${values.designation || "—"}`,
      `Phone: ${values.phone}`,
      `Email: ${values.email}`,
      `Requirement: ${values.requirement}`,
      `Target cities: ${values.cities || "—"}`,
      `Budget: ${values.budget}`,
      `Timeline: ${values.timeline}`,
    ].join("\n");
    window.open(whatsappLink(body), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="mt-5 font-display text-xl font-semibold text-ink">Thanks! Our team will reach out within 4 business hours.</p>
        <p className="mt-2 text-sm text-body">
          If your messenger didn&apos;t open,{" "}
          <a href={`mailto:${site.email}`} className="font-medium text-ink underline">email us directly</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-[#f0f0f0] bg-surface p-6 md:p-8">
      {/* progress */}
      <div className="flex gap-2" aria-label={`Step ${step + 1} of ${steps.length}`}>
        {steps.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={cn("h-1.5 rounded-full transition-colors duration-300", i <= step ? "bg-amber" : "bg-[#f0f0f0]")} />
            <span className={cn("mt-2 block text-xs font-medium", i === step ? "text-ink" : "text-muted")}>
              {i + 1}. {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Field label="Name" required value={values.name} onChange={(v) => set("name", v)} placeholder="Your name" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company" value={values.company} onChange={(v) => set("company", v)} placeholder="Company" />
              <Field label="Designation" value={values.designation} onChange={(v) => set("designation", v)} placeholder="Designation" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone" required type="tel" value={values.phone} onChange={(v) => set("phone", v)} placeholder="Phone" />
              <Field label="Email" required type="email" value={values.email} onChange={(v) => set("email", v)} placeholder="you@company.com" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <ToggleField label="Requirement type" options={requirementOptions} value={values.requirement} onChange={(v) => set("requirement", v)} />
            <Field label="Target cities" value={values.cities} onChange={(v) => set("cities", v)} placeholder="e.g. Lucknow, Kanpur, PAN India" />
            <ToggleField label="Budget range" options={budgetOptions} value={values.budget} onChange={(v) => set("budget", v)} />
            <ToggleField label="Timeline" options={timelineOptions} value={values.timeline} onChange={(v) => set("timeline", v)} />
          </div>
        )}

        {step === 2 && (
          <dl className="divide-y divide-[#f0f0f0] rounded-xl border border-[#f0f0f0]">
            {[
              ["Name", values.name],
              ["Company", values.company || "—"],
              ["Designation", values.designation || "—"],
              ["Phone", values.phone],
              ["Email", values.email],
              ["Requirement", values.requirement],
              ["Target cities", values.cities || "—"],
              ["Budget", values.budget],
              ["Timeline", values.timeline],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-amber-deep">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button type="button" variant="ghost" withIcon={false} onClick={back}>
            Back
          </Button>
        ) : (
          <span />
        )}
        {step < steps.length - 1 ? (
          <Button type="button" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button type="button" onClick={submit}>
            Submit Brief
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  const id = `f-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-body">
        {label}
        {required && <span className="text-amber-deep"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border border-[#e6e6e6] bg-surface px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink focus-visible:ring-2 focus-visible:ring-amber"
      />
    </div>
  );
}

function ToggleField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-body">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o)}
              className={cn(
                "min-h-11 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2",
                active
                  ? "border-amber bg-amber text-ink"
                  : "border-[#f0f0f0] bg-surface text-body hover:border-ink/20 hover:text-ink"
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
