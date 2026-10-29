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
  const taskCountsByProject = new Map<
    string,
    { total: number; completed: number }
  >();

  for (const task of tasks) {
    const counts = taskCountsByProject.get(task.project_id) ?? {
      total: 0,
      completed: 0,
    };
    counts.total += 1;
    if (task.status === "done") {
      counts.completed += 1;
    }
    taskCountsByProject.set(task.project_id, counts);
  }

  const projectProgress = projects.map((project) => {
    const { total = 0, completed = 0 } =
      taskCountsByProject.get(project.id) ?? {};
    return {
      project,
      total,
      completed,
      progress: total ? Math.round((completed / total) * 100) : 0,
    };
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
