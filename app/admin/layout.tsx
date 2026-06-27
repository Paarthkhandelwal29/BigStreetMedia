import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "CMS",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-2">
      <AdminNav />
      <div className="mx-auto w-full max-w-6xl px-5 py-9 md:px-8 md:py-12">
        {children}
      </div>
    </div>
  );
}
