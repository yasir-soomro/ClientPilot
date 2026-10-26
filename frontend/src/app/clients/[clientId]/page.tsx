import type { Metadata } from "next";
import { ClientManagement } from "@/components/clients/client-management";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export const metadata: Metadata = {
  title: "Client details",
  robots: { index: false, follow: false },
};

export const instant = false;

export default async function ClientDetailsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  return (
    <WorkspaceShell>
      <ClientManagement
        initialSelectedClientId={clientId}
      />
    </WorkspaceShell>
  );
}
