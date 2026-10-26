import type { Client } from "@/features/clients/types";
import type { Project } from "@/features/projects/types";

export function summarizeWorkspace(clients: Client[], projects: Project[]) {
  return {
    totalClients: clients.length,
    totalProjects: projects.length,
    activeProjects: projects.filter(
      (project) => project.status === "in_progress",
    ).length,
  };
}
