import { ProjectManagement } from "@/components/projects/project-management";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export default function ProjectsPage() {
  return (
    <WorkspaceShell>
      <ProjectManagement clientsRevision={0} />
    </WorkspaceShell>
  );
}
