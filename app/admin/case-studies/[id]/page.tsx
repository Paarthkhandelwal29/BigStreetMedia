import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getCaseStudy } from "@/lib/cms/store";
import { EditCaseStudyPageClient } from "./EditCaseStudyPageClient";

export default async function CaseStudyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const { id } = await params;
  const item = await getCaseStudy(id);
  if (!item) notFound();

  return <EditCaseStudyPageClient item={item} />;
}
