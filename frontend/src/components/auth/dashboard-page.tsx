import { DashboardOverview } from "@/components/workspace/dashboard-overview";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export function DashboardPage() {
  return (
    <WorkspaceShell>
      <DashboardOverview />
    </WorkspaceShell>
  );
}
