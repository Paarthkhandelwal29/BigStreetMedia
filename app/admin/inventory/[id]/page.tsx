import { notFound, redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/cms/auth";
import { getInventory } from "@/lib/cms/store";
import { EditInventoryPageClient } from "./EditInventoryPageClient";

export default async function InventoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin/login");

  const { id } = await params;
  const item = await getInventory(id);
  if (!item) notFound();

  return <EditInventoryPageClient item={item} />;
}
