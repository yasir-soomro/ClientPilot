import type { Client } from "@/features/clients/types";
import type { Project } from "@/features/projects/types";
import type { Task } from "@/features/tasks/types";

export function summarizeWorkspace(clients: Client[], projects: Project[]) {
  return {
    totalClients: clients.length,
    totalProjects: projects.length,
    activeProjects: projects.filter(
      (project) => project.status === "in_progress",
    ).length,
  };
}

export function summarizeTasks(tasks: Task[], projects: Project[]) {
  const today = new Date().toISOString().slice(0, 10);
  const projectById = new Map(projects.map((project) => [project.id, project]));
  const projectProgress = projects.map((project) => {
    const projectTasks = tasks.filter((task) => task.project_id === project.id);
    const completed = projectTasks.filter((task) => task.status === "done").length;
    return { project, total: projectTasks.length, completed, progress: projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0 };
  });

  return {
    pendingTasks: tasks.filter((task) => task.status !== "done").length,
    overdueTasks: tasks.filter((task) => task.status !== "done" && task.due_date !== null && task.due_date < today).length,
    statusCounts: {
      todo: tasks.filter((task) => task.status === "todo").length,
      in_progress: tasks.filter((task) => task.status === "in_progress").length,
      done: tasks.filter((task) => task.status === "done").length,
    },
    upcomingTasks: tasks.filter((task) => task.status !== "done" && task.due_date !== null && task.due_date >= today).sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? "")).slice(0, 5),
    projectProgress,
    projectById,
  };
}
