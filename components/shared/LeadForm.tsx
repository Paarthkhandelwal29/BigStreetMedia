"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { site, whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export type LeadField = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "textarea";
  required?: boolean;
  placeholder?: string;
};

/**
 * No-backend lead form: composes a WhatsApp message (primary) and offers a
 * mailto fallback. Works on any static host. Swap for Resend/Formspree later
 * by replacing the onSubmit handler.
 */
export function LeadForm({
  fields,
  subject,
  submitLabel = "Get Free Media Plan",
  channel = "whatsapp",
  layout = "stack",
  className,
}: {
  fields: LeadField[];
  subject: string;
  submitLabel?: string;
  channel?: "whatsapp" | "email";
  layout?: "stack" | "inline";
  className?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function compose() {
    const lines = fields
      .map((f) => `${f.label}: ${values[f.name]?.trim() || "—"}`)
      .join("\n");
    return `${subject}\n\n${lines}`;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const body = compose();
    if (channel === "email") {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    } else {
      window.open(whatsappLink(body), "_blank", "noopener,noreferrer");
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className={cn("rounded-[1.25rem] border border-[#f0f0f0] bg-surface p-8 text-center", className)}>
        <p className="font-display text-xl font-semibold text-ink">Thanks — your brief is ready to send.</p>
        <p className="mt-2 text-sm text-body">
          We&apos;ll come back with a tailored media plan within 48 hours. If your
          messenger didn&apos;t open,{" "}
          <a className="font-medium text-ink underline" href={`mailto:${site.email}`}>
            email us directly
          </a>
          .
        </p>
      </div>
    );
  }

  const isInline = layout === "inline";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        isInline
          ? "flex flex-col gap-3 sm:flex-row sm:items-end"
          : "flex flex-col gap-4",
        className
      )}
    >
      {fields.map((f) => (
        <div key={f.name} className={cn("flex flex-col gap-1.5", isInline && "min-w-0 flex-1")}>
          <label
            htmlFor={`lead-${f.name}`}
            className={cn("text-xs font-medium text-body", isInline && "sr-only")}
          >
            {f.label}
            {f.required && <span className="text-amber-deep"> *</span>}
          </label>
          {f.type === "textarea" ? (
            <textarea
              id={`lead-${f.name}`}
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              rows={4}
              value={values[f.name] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              className="rounded-xl border border-[#e6e6e6] bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink focus-visible:ring-2 focus-visible:ring-amber"
            />
          ) : (
            <input
              id={`lead-${f.name}`}
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder}
              value={values[f.name] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              className="h-12 w-full rounded-xl border border-[#e6e6e6] bg-surface px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-ink focus-visible:ring-2 focus-visible:ring-amber"
            />
          )}
        </div>
      ))}
      <Button type="submit" className={cn(isInline && "h-12 shrink-0")}>
        {submitLabel}
      </Button>
    </form>
  );
}
