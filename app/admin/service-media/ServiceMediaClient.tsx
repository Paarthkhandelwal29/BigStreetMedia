"use client";

import { useRef, useState } from "react";
import type { Service } from "@/data/services";
import type { ServiceFormatImageRecord } from "@/lib/cms/types";
import { deleteServiceFormatImageAction, uploadServiceFormatImageAction } from "./actions";

interface Props {
  services: Service[];
  records: ServiceFormatImageRecord[];
}

export function ServiceMediaClient({ services, records }: Props) {
  const [selectedService, setSelectedService] = useState(services[0]?.slug ?? "");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const currentService = services.find((s) => s.slug === selectedService);
  const formats = currentService?.formats ?? [];

  const recordMap = new Map<string, ServiceFormatImageRecord>();
  for (const r of records) {
    if (r.serviceSlug === selectedService) {
      recordMap.set(r.formatName, r);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !selectedFormat) return;

    setStatus(null);
    setPending(true);

    const fd = new FormData();
    fd.append("serviceSlug", selectedService);
    fd.append("formatName", selectedFormat);
    fd.append("file", file);

    const result = await uploadServiceFormatImageAction(fd);
    setStatus(result);
    setPending(false);

    if (result.ok) {
      setFile(null);
      formRef.current?.reset();
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
      <div className="rounded-xl border border-hairline bg-white p-6">
        <h2 className="mb-4 text-sm font-bold text-ink">Upload Photo</h2>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">
              Service
            </label>
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setSelectedFormat("");
              }}
              className="w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-amber"
            >
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">
              Format
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-amber"
            >
              <option value="">-- Select format --</option>
              {formats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted">
              Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-amber/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-amber-deep"
            />
          </div>

          <button
            type="submit"
            disabled={!file || !selectedFormat || pending}
            className="w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Uploading..." : "Upload Photo"}
          </button>

          {status && (
            <p
              className={`text-xs font-medium ${
                status.ok ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {status.msg}
            </p>
          )}
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-bold text-ink">
          Images for {currentService?.title ?? selectedService}
        </h2>

        {formats.length === 0 && (
          <p className="text-sm text-muted">Select a service to see its formats.</p>
        )}

        <div className="space-y-3">
          {formats.map((f) => {
            const record = recordMap.get(f);
            return (
              <div
                key={f}
                className="flex items-center gap-4 rounded-lg border border-hairline bg-white p-3"
              >
                {record ? (
                  <img
                    src={record.imageUrl}
                    alt={f}
                    className="h-16 w-24 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md bg-surface-2 text-[10px] text-muted">
                    No image
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{f}</p>
                  {record && (
                    <p className="mt-0.5 truncate text-[11px] text-muted">
                      {record.imageUrl}
                    </p>
                  )}
                </div>
                {record && (
                  <DeleteButton recordId={record.id} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DeleteButton({ recordId }: { recordId: string }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await deleteServiceFormatImageAction(recordId);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="shrink-0 text-xs font-semibold text-red-500 transition-colors hover:text-red-700 disabled:opacity-50"
    >
      {deleting ? "..." : "Remove"}
    </button>
  );
}
