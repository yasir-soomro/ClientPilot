import type { Metadata } from "next";
import { ProjectManagement } from "@/components/projects/project-management";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

export default function ProjectsPage() {
  return (
    <WorkspaceShell>
      <ProjectManagement clientsRevision={0} />
    </WorkspaceShell>
  );
}
