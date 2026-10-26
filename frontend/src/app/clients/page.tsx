import { ClientManagement } from "@/components/clients/client-management";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export default function ClientsPage() {
  return (
    <WorkspaceShell>
      <ClientManagement />
    </WorkspaceShell>
  );
}
