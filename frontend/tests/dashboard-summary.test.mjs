import assert from "node:assert/strict";
import { test } from "node:test";
import { summarizeTasks, summarizeWorkspace } from "../src/features/dashboard/summary.ts";

const client = {
  id: "client-1",
  name: "Client",
  email: null,
  company: null,
  created_at: "2026-10-25T12:00:00Z",
  updated_at: "2026-10-25T12:00:00Z",
};

function project(id, status) {
  return {
    id,
    client_id: client.id,
    name: `Project ${id}`,
    status,
    due_date: null,
    created_at: "2026-10-25T12:00:00Z",
    updated_at: "2026-10-25T12:00:00Z",
  };
}

test("workspace summary counts API records and only in-progress active projects", () => {
  assert.deepEqual(
    summarizeWorkspace([client], [
      project("planned", "planned"),
      project("active", "in_progress"),
      project("completed", "completed"),
    ]),
    {
      totalClients: 1,
      totalProjects: 3,
      activeProjects: 1,
    },
  );
});

test("task summary counts pending and overdue work and calculates project progress", () => {
  const projects = [project("project-1", "in_progress")];
  const tasks = [
    { id: "task-1", project_id: "project-1", title: "Overdue", description: null, due_date: "2026-10-26", status: "todo", created_at: "2026-10-25T12:00:00Z", updated_at: "2026-10-25T12:00:00Z" },
    { id: "task-2", project_id: "project-1", title: "Upcoming", description: null, due_date: "2026-11-01", status: "in_progress", created_at: "2026-10-25T12:00:00Z", updated_at: "2026-10-25T12:00:00Z" },
    { id: "task-3", project_id: "project-1", title: "Done", description: null, due_date: null, status: "done", created_at: "2026-10-25T12:00:00Z", updated_at: "2026-10-25T12:00:00Z" },
  ];

  const summary = summarizeTasks(tasks, projects);
  assert.equal(summary.pendingTasks, 2);
  assert.equal(summary.overdueTasks, 1);
  assert.deepEqual(summary.statusCounts, { todo: 1, in_progress: 1, done: 1 });
  assert.equal(summary.projectProgress[0].progress, 33);
  assert.equal(summary.upcomingTasks[0].id, "task-2");
});

test("project progress is zero for projects without tasks", () => {
  const summary = summarizeTasks([], [project("empty", "planned")]);

  assert.deepEqual(summary.projectProgress, [
    { project: project("empty", "planned"), total: 0, completed: 0, progress: 0 },
  ]);
});
