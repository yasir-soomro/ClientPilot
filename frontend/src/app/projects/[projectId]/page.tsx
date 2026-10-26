import { ProjectManagement } from "@/components/projects/project-management";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export const instant = false;

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <WorkspaceShell>
      <ProjectManagement
        initialSelectedProjectId={projectId}
        clientsRevision={0}
      />
    </WorkspaceShell>
  );
}
