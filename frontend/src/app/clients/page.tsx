import type { Metadata } from "next";
import { ClientManagement } from "@/components/clients/client-management";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export const metadata: Metadata = {
  title: "Clients",
  robots: { index: false, follow: false },
};

export default function ClientsPage() {
  return (
    <WorkspaceShell>
      <ClientManagement />
    </WorkspaceShell>
  );
}
