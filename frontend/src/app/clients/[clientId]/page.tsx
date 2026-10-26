import { ClientManagement } from "@/components/clients/client-management";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

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
