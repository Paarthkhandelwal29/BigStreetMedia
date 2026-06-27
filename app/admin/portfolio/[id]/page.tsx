import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getPortfolio } from "@/lib/cms/store";
import { EditPortfolioPageClient } from "./EditPortfolioPageClient";

export default async function PortfolioEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const { id } = await params;
  const item = await getPortfolio(id);
  if (!item) notFound();

  return <EditPortfolioPageClient item={item} />;
}
